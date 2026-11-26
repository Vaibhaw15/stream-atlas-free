"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Loader2, Eraser, RefreshCw } from "lucide-react";
import JavaEditor from "./JavaEditor";

/*
 * <JavaRunner code={...} />
 *
 * Compiles and runs Java in the browser with CheerpJ's Java 17 runtime, which
 * includes javac. Modern code (List.of, Stream.toList, records, var, text
 * blocks, Collectors.teeing) works.
 *
 * How it runs: public/java-runner/StreamAtlasLauncher.jar (source in
 * java-runner/, rebuild with java-runner/build.sh) compiles the code in memory
 * and runs main() in a fresh class loader, so each Run sees the new code.
 *
 * CheerpJ is loaded on the first Run, never at page load, and shared by every
 * runner on the page; runs are queued.
 *
 * Limits (CheerpJ runs Java on the page's main thread):
 *  - An infinite loop freezes the tab until it's reloaded.
 *  - Memory grows ~25-35 MB per run and isn't given back; past ~20 runs
 *    CheerpJ slows down or hangs. So after RELOAD_SUGGEST_RUNS the runner
 *    suggests a reload, and after RELOAD_REQUIRED_RUNS pressing Run reloads the
 *    page and re-runs the code automatically (edits are kept).
 *
 * Also exported: runJava(code, opts) for use without the UI.
 */

const DEFAULT_CHEERPJ_URL = "https://cjrtnc.leaningtech.com/5.0/loader.js";
const DEFAULT_LAUNCHER_JAR = "/app/java-runner/StreamAtlasLauncher.jar"; // = public/java-runner/…
const LAUNCHER_CLASS = "StreamAtlasLauncher";

// Measured in Chrome: with a 700+ MB heap a run can occasionally stall for
// 10-50 s while the garbage collector catches up. A reload frees most (not all)
// of it; closing the tab frees everything. Heap readings only count after a
// few runs on this page, because right after a reload the old page's memory
// hasn't been collected yet (otherwise we'd reload in a loop).
const RELOAD_SUGGEST_RUNS = 10;
const RELOAD_REQUIRED_RUNS = 15;
const RELOAD_SUGGEST_HEAP = { runs: 3, mb: 600 }; // Chrome only (performance.memory)
const RELOAD_REQUIRED_HEAP = { runs: 5, mb: 800 };
const RESTORE_KEY = "java-runner:restore";

// ---------------------------------------------------------------------------
// Shared CheerpJ runtime (one per page)
// ---------------------------------------------------------------------------

let runtimePromise = null;
let queue = Promise.resolve();
let pending = 0;
let runCount = 0;
const reloadListeners = new Set();

function heapMB() {
  const m = typeof performance !== "undefined" && performance.memory;
  return m ? m.usedJSHeapSize / 1048576 : 0;
}

function reloadSuggested() {
  return (
    runCount >= RELOAD_SUGGEST_RUNS ||
    (runCount >= RELOAD_SUGGEST_HEAP.runs && heapMB() > RELOAD_SUGGEST_HEAP.mb)
  );
}

/** True when the page should be reloaded before the next run (see above). */
export function reloadRequired() {
  return (
    runCount >= RELOAD_REQUIRED_RUNS ||
    (runCount >= RELOAD_REQUIRED_HEAP.runs && heapMB() > RELOAD_REQUIRED_HEAP.mb)
  );
}

// CheerpJ writes System.out / System.err into the element with id="console".
// One hidden element for the page; its text is copied into whichever runner
// is running.
function getConsoleEl() {
  let el = document.getElementById("console");
  if (!el) {
    el = document.createElement("pre");
    el.id = "console";
    el.setAttribute("aria-hidden", "true");
    el.style.display = "none";
    document.body.appendChild(el);
  }
  return el;
}

function ensureRuntime(cheerpjUrl) {
  if (!runtimePromise) {
    runtimePromise = (async () => {
      getConsoleEl();
      if (!window.cheerpjInit) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = cheerpjUrl;
          s.async = true;
          s.onload = resolve;
          s.onerror = () => {
            s.remove();
            reject(new Error(`Could not load CheerpJ from ${cheerpjUrl}. Check your connection and try again.`));
          };
          document.head.appendChild(s);
        });
      }
      await window.cheerpjInit({ version: 17, status: "none" });
    })().catch((err) => {
      runtimePromise = null; // let the next click retry
      throw err;
    });
  }
  return runtimePromise;
}

function detectMainClass(code) {
  const pub = code.match(/public\s+(?:(?:final|abstract|strictfp)\s+)*class\s+([A-Za-z_$][\w$]*)/);
  if (pub) return pub[1];
  const withMain = code.match(
    /class\s+([A-Za-z_$][\w$]*)[^{]*\{[\s\S]*?public\s+static\s+void\s+main\s*\(/
  );
  return withMain ? withMain[1] : "Main";
}

/**
 * Compile and run one Java source file.
 * Resolves to { exit, output, ms }. exit: 0 ok, 1 exception, 2 compile error,
 * 3 no main method, anything else = the program's System.exit code.
 */
export function runJava(
  code,
  {
    cheerpjUrl = DEFAULT_CHEERPJ_URL,
    launcherJar = DEFAULT_LAUNCHER_JAR,
    onStatus = () => {},
    onOutput = () => {},
  } = {}
) {
  const job = async () => {
    if (!runtimePromise) onStatus("loading");
    await ensureRuntime(cheerpjUrl);
    onStatus(runCount === 0 ? "warming" : "running");

    // /str/ is flat and javac wants the file named after the public class.
    const className = detectMainClass(code);
    const srcPath = `/str/${className}.java`;
    window.cheerpOSAddStringFile(srcPath, code);

    const con = getConsoleEl();
    con.textContent = "";
    const observer = new MutationObserver(() => onOutput(con.textContent));
    observer.observe(con, { childList: true, characterData: true, subtree: true });
    const t0 = performance.now();
    try {
      const exit = await window.cheerpjRunMain(LAUNCHER_CLASS, launcherJar, srcPath, className);
      const result = { exit, output: con.textContent, ms: Math.round(performance.now() - t0) };
      if (exit === 1 && /ClassNotFoundException: StreamAtlasLauncher/.test(result.output)) {
        throw new Error(
          `The Java runner couldn't load ${launcherJar.replace(/^\/app/, "")}. ` +
            "Make sure public/java-runner/StreamAtlasLauncher.jar is deployed."
        );
      }
      return result;
    } finally {
      observer.disconnect();
      runCount++;
      if (reloadSuggested()) reloadListeners.forEach((fn) => fn());
    }
  };
  if (pending > 0) onStatus("queued");
  pending++;
  const p = queue.then(job, job).finally(() => pending--);
  queue = p.catch(() => {});
  return p;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const STATUS_TEXT = {
  idle: "Output",
  loading: "Loading Java runtime…",
  warming: "Compiling & running (first run warms up javac)…",
  queued: "Waiting for another run to finish…",
  running: "Compiling & running…",
  ok: "Finished",
  compile: "Compilation failed",
  runtime: "Exception thrown",
  nomain: "No main method",
  exit: "Exited",
  error: "Runner error",
};
const BUSY = new Set(["loading", "warming", "queued", "running"]);

export default function JavaRunner({
  code = "",
  onCodeChange = () => {},
  title = "Main.java",
  actions = null,
  cheerpjUrl = DEFAULT_CHEERPJ_URL,
  launcherJar = DEFAULT_LAUNCHER_JAR,
}) {
  const [status, setStatus] = useState("idle");
  const [output, setOutput] = useState("");
  const [elapsed, setElapsed] = useState(null);
  const [exitCode, setExitCode] = useState(null);
  const [reloadSoon, setReloadSoon] = useState(false);
  const mounted = useRef(true);
  const outRef = useRef(null);
  const codeRef = useRef(code);
  codeRef.current = code;

  // After a memory reload, bring back the code and finish the run the user
  // asked for. (The page may mount us with a placeholder question before it
  // restores the user's place, so wait until the code matches.)
  const autoRun = useRef(undefined);
  if (autoRun.current === undefined && typeof window !== "undefined") {
    autoRun.current = null;
    try {
      const saved = JSON.parse(sessionStorage.getItem(RESTORE_KEY) || "null");
      sessionStorage.removeItem(RESTORE_KEY);
      if (saved && Date.now() - saved.at < 60000 && saved.run) autoRun.current = saved.code;
    } catch {}
  }

  useEffect(() => {
    mounted.current = true;
    const onReloadNeeded = () => mounted.current && setReloadSoon(true);
    reloadListeners.add(onReloadNeeded);
    if (reloadSuggested()) setReloadSoon(true);
    return () => {
      mounted.current = false;
      reloadListeners.delete(onReloadNeeded);
    };
  }, []);

  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [output]);

  const busy = BUSY.has(status);
  const busyRef = useRef(false);
  busyRef.current = busy;
  const safeSet = (fn) => mounted.current && fn();

  const run = async () => {
    if (busyRef.current) return;
    const source = codeRef.current;
    if (reloadRequired()) {
      reloadPage(true);
      return;
    }
    busyRef.current = true;
    setOutput("");
    setElapsed(null);
    setExitCode(null);
    setStatus(runtimePromise ? "running" : "loading");
    try {
      const { exit, output: text, ms } = await runJava(source, {
        cheerpjUrl,
        launcherJar,
        onStatus: (st) => safeSet(() => setStatus(st)),
        onOutput: (text) => safeSet(() => setOutput(text)),
      });
      safeSet(() => {
        setElapsed(ms);
        setOutput(text);
        setExitCode(exit);
        setStatus(
          exit === 0 ? "ok" : exit === 1 ? "runtime" : exit === 2 ? "compile" : exit === 3 ? "nomain" : "exit"
        );
      });
    } catch (err) {
      safeSet(() => {
        setStatus("error");
        setOutput(String(err && err.message ? err.message : err));
      });
    }
  };

  function reloadPage(thenRun = false) {
    setStatus("loading");
    setOutput("Reloading the page to free memory…");
    try {
      sessionStorage.setItem(
        RESTORE_KEY,
        JSON.stringify({ code: codeRef.current, run: thenRun, at: Date.now() })
      );
    } catch {}
    window.location.reload();
  }

  useEffect(() => {
    if (autoRun.current && code === autoRun.current) {
      autoRun.current = null;
      run();
    }
  });

  const tone =
    status === "ok" ? "ok" : ["compile", "runtime", "nomain", "exit", "error"].includes(status) ? "bad" : "";

  let placeholder = "Press Run (Ctrl/⌘ + Enter) to compile and run this code in your browser.";
  if (status === "loading")
    placeholder = "Downloading the Java runtime. This happens once per visit and takes a few seconds.";
  else if (busy) placeholder = "";
  else if (status === "ok") placeholder = "(no output)";

  return (
    <div className="jr-shell">
      <style href="java-runner-styles" precedence="default">{JR_CSS}</style>
      <div className="jr-toolbar">
        <span>{title}</span>
        <div className="jr-actions">
          {actions}
          <button
            type="button"
            className="jr-run-btn"
            onClick={() => run()}
            disabled={busy}
            title="Compile & run (Ctrl/⌘ + Enter)"
          >
            {busy ? <Loader2 size={13} className="jr-spin" /> : <Play size={13} />}
            {busy ? "Running" : "Run"}
          </button>
        </div>
      </div>

      <JavaEditor value={code} onChange={onCodeChange} onRun={run} />

      <div className="jr-out-bar">
        <span className={`jr-status ${tone}`} aria-live="polite">
          {busy && <Loader2 size={12} className="jr-spin" />}
          {STATUS_TEXT[status]}
          {status === "exit" && exitCode !== null ? ` (code ${exitCode})` : ""}
          {elapsed !== null && <span className="jr-faint"> · {(elapsed / 1000).toFixed(2)}s</span>}
        </span>
        {output && !busy && (
          <button
            type="button"
            className="jr-icon-btn"
            onClick={() => {
              setOutput("");
              setStatus("idle");
              setElapsed(null);
            }}
            title="Clear output"
          >
            <Eraser size={12} />
          </button>
        )}
      </div>
      <pre ref={outRef} className={`jr-out ${tone}`}>
        {output || placeholder}
      </pre>

      {reloadSoon && !busy && (
        <div className="jr-reload">
          <span>
            The in-browser Java runtime is using a lot of memory. Reload to free it (your code and
            progress are kept). After a few more runs it reloads automatically.
          </span>
          <button type="button" className="jr-run-btn" onClick={() => reloadPage(false)}>
            <RefreshCw size={12} /> Reload
          </button>
        </div>
      )}
    </div>
  );
}

const JR_CSS = `
.jr-shell {
  border: 1px solid var(--border, rgba(255,255,255,0.08));
  background: var(--surface, rgba(255,255,255,0.02));
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.jr-shell:focus-within { border-color: var(--accent-strong, rgba(251,191,36,0.4)); }
.jr-toolbar, .jr-out-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px;
  font-size: 12px;
  color: var(--text-faint, #71717a);
  font-family: 'JetBrains Mono', monospace;
  background: rgba(255,255,255,0.015);
}
.jr-toolbar { border-bottom: 1px solid var(--border, rgba(255,255,255,0.08)); }
.jr-shell { background: #0d0d0f; }
.jr-out-bar { border-top: 1px solid var(--border, rgba(255,255,255,0.08)); padding: 7px 14px; min-height: 40px; }
.jr-actions { display: flex; gap: 6px; align-items: center; }
.jr-run-btn {
  background: var(--accent, #fbbf24); color: #1a1a0a;
  border: none; padding: 7px 14px; border-radius: 6px;
  font-weight: 600; font-size: 12px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px;
  font-family: inherit; white-space: nowrap;
}
.jr-run-btn:disabled { opacity: 0.65; cursor: progress; }
.jr-icon-btn {
  background: transparent; font-family: inherit; font-size: 11px; gap: 5px;
  border: 1px solid var(--border, rgba(255,255,255,0.08));
  color: var(--text-dim, #a1a1aa);
  width: 28px; height: 28px; border-radius: 6px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  transition: all 0.15s ease;
}
.jr-icon-btn:hover:not(:disabled) { color: var(--text, #ededee); background: var(--surface, rgba(255,255,255,0.04)); }
.jr-icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.jr-status { display: inline-flex; align-items: center; gap: 6px; }
.jr-status.ok { color: #4ade80; }
.jr-status.bad { color: #f87171; }
.jr-faint { color: var(--text-faint, #71717a); }
.jr-out {
  margin: 0; padding: 14px 18px;
  min-height: 72px; max-height: 320px; overflow: auto;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12.5px; line-height: 1.6;
  color: var(--text-dim, #d4d4d8);
  background: rgba(0,0,0,0.25);
  white-space: pre-wrap; word-break: break-word;
}
.jr-out.bad { color: #fca5a5; }
.jr-reload {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 14px;
  border-top: 1px solid var(--border, rgba(255,255,255,0.08));
  background: var(--accent-dim, rgba(251,191,36,0.08));
  color: var(--text-dim, #d4d4d8);
  font-size: 12px; line-height: 1.5;
}
.jr-spin { animation: jr-spin 0.9s linear infinite; }
@keyframes jr-spin { to { transform: rotate(360deg); } }
`;
