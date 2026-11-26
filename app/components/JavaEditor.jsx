"use client";

import { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState, Prec } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { indentUnit, HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { java } from "@codemirror/lang-java";
import { tags as t } from "@lezer/highlight";

const theme = EditorView.theme(
  {
    "&": {
      backgroundColor: "transparent",
      color: "#e4e4e7",
      fontSize: "13px",
    },
    "&.cm-focused": { outline: "none" },
    ".cm-scroller": {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      lineHeight: "1.65",
      minHeight: "320px",
      maxHeight: "640px",
    },
    ".cm-content": { padding: "14px 0", caretColor: "#fbbf24" },
    ".cm-line": { padding: "0 18px 0 10px" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#fbbf24", borderLeftWidth: "2px" },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: "rgba(251, 191, 36, 0.22) !important" },
    ".cm-activeLine": { backgroundColor: "rgba(255,255,255,0.025)" },
    ".cm-gutters": {
      backgroundColor: "transparent",
      color: "#4a4a52",
      border: "none",
      paddingLeft: "6px",
    },
    ".cm-activeLineGutter": { backgroundColor: "transparent", color: "#a1a1aa" },
    ".cm-foldGutter .cm-gutterElement": { color: "#5a5a63" },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(251, 191, 36, 0.15)",
      outline: "1px solid rgba(251, 191, 36, 0.4)",
      color: "inherit !important",
    },
    ".cm-selectionMatch": { backgroundColor: "rgba(255,255,255,0.07)" },
    ".cm-searchMatch": { backgroundColor: "rgba(251, 191, 36, 0.2)" },
    ".cm-tooltip": {
      backgroundColor: "#1a1a1f",
      border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: "8px",
      overflow: "hidden",
    },
    ".cm-tooltip-autocomplete > ul": {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "12.5px",
    },
    ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
      backgroundColor: "rgba(251, 191, 36, 0.16)",
      color: "#ededee",
    },
    ".cm-panels": { backgroundColor: "#131316", color: "#ededee" },
    ".cm-panels-bottom": { borderTop: "1px solid rgba(255,255,255,0.08)" },
  },
  { dark: true }
);

const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.modifier, t.controlKeyword, t.definitionKeyword], color: "#f472b6" },
  { tag: [t.typeName, t.className], color: "#7dd3fc" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#fbbf24" },
  { tag: [t.string, t.character], color: "#a3e635" },
  { tag: [t.number, t.bool, t.null], color: "#fb923c" },
  { tag: [t.lineComment, t.blockComment, t.comment], color: "#5a5a63", fontStyle: "italic" },
  { tag: [t.annotation, t.meta], color: "#c4b5fd" },
  { tag: [t.operator, t.arithmeticOperator, t.logicOperator, t.compareOperator], color: "#a1a1aa" },
  { tag: [t.propertyName], color: "#e4e4e7" },
  { tag: [t.variableName], color: "#e4e4e7" },
  { tag: [t.punctuation, t.bracket, t.separator], color: "#8a8a93" },
]);

export default function JavaEditor({ value, onChange, onRun }) {
  const hostRef = useRef(null);
  const viewRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  useEffect(() => {
    const view = new EditorView({
      parent: hostRef.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          java(),
          indentUnit.of("    "),
          EditorState.tabSize.of(4),
          Prec.highest(
            keymap.of([
              { key: "Mod-Enter", run: () => (onRunRef.current?.(), true) },
            ])
          ),
          keymap.of([indentWithTab]),
          theme,
          syntaxHighlighting(highlight),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) onChangeRef.current(u.state.doc.toString());
          }),
        ],
      }),
    });
    viewRef.current = view;
    return () => view.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external changes (switching problems, reset, load solution).
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (value !== current) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } });
    }
  }, [value]);

  return <div ref={hostRef} />;
}
