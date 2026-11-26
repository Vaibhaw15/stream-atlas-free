import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import javax.tools.FileObject;
import javax.tools.ForwardingJavaFileManager;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.SimpleJavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;

/**
 * Runs inside CheerpJ for app/components/JavaRunner.jsx.
 *
 * Compiles one source file with javac entirely in memory and runs its main
 * method in a fresh class loader. Nothing is written to disk, which matters
 * because then nothing piles up in CheerpJ's IndexedDB-backed /files/.
 *
 * Usage: StreamAtlasLauncher <path to .java> <public class name>
 * Exit codes: 0 ok, 1 exception, 2 compile error, 3 no main method,
 * anything else = the program's own System.exit code.
 *
 * Build (any JDK 11+): ./java-runner/build.sh  -> public/java-runner/StreamAtlasLauncher.jar
 */
public class StreamAtlasLauncher {
    static final int OK = 0, RUNTIME_ERROR = 1, COMPILE_ERROR = 2, NO_MAIN = 3;

    // The JVM stays alive between runs, so keep the compiler warm.
    static JavaCompiler compiler;
    static StandardJavaFileManager standardFiles;

    static final class Source extends SimpleJavaFileObject {
        final String code;

        Source(String className, String code) {
            super(URI.create("string:///" + className + ".java"), Kind.SOURCE);
            this.code = code;
        }

        @Override
        public CharSequence getCharContent(boolean ignoreEncodingErrors) {
            return code;
        }
    }

    static final class ClassBytes extends SimpleJavaFileObject {
        final ByteArrayOutputStream bytes = new ByteArrayOutputStream();

        ClassBytes(String binaryName) {
            super(URI.create("mem:///" + binaryName.replace('.', '/') + ".class"), Kind.CLASS);
        }

        @Override
        public OutputStream openOutputStream() {
            return bytes;
        }
    }

    static final class MemoryLoader extends ClassLoader {
        final Map<String, ClassBytes> classes;

        MemoryLoader(Map<String, ClassBytes> classes, ClassLoader parent) {
            super(parent);
            this.classes = classes;
        }

        @Override
        protected Class<?> findClass(String name) throws ClassNotFoundException {
            ClassBytes c = classes.get(name);
            if (c == null) throw new ClassNotFoundException(name);
            byte[] b = c.bytes.toByteArray();
            return defineClass(name, b, 0, b.length);
        }
    }

    public static void main(String[] args) throws Exception {
        int code = run(args[0], args[1]);
        System.out.flush();
        System.err.flush();
        if (code != OK) System.exit(code);
    }

    static int run(String sourcePath, String className) throws Exception {
        String source = readUtf8(sourcePath);

        if (compiler == null) {
            compiler = ToolProvider.getSystemJavaCompiler();
            standardFiles = compiler.getStandardFileManager(null, null, StandardCharsets.UTF_8);
        }
        final Map<String, ClassBytes> classes = new HashMap<>();
        JavaFileManager files = new ForwardingJavaFileManager<StandardJavaFileManager>(standardFiles) {
            @Override
            public JavaFileObject getJavaFileForOutput(
                    Location location, String name, JavaFileObject.Kind kind, FileObject sibling) {
                ClassBytes c = new ClassBytes(name);
                classes.put(name, c);
                return c;
            }
        };
        boolean ok = compiler.getTask(null, files, null, Collections.singletonList("-nowarn"), null,
                Collections.singletonList(new Source(className, source))).call();
        if (!ok) return COMPILE_ERROR;

        // Parent = platform loader: the program sees the JDK, not this launcher.
        ClassLoader loader = new MemoryLoader(classes, ClassLoader.getSystemClassLoader().getParent());
        Method main;
        try {
            main = loader.loadClass(className).getMethod("main", String[].class);
        } catch (ClassNotFoundException | NoSuchMethodException e) {
            System.err.println("error: class " + className
                    + " needs a 'public static void main(String[] args)' method");
            return NO_MAIN;
        }
        try {
            main.invoke(null, (Object) new String[0]);
            return OK;
        } catch (Throwable t) {
            // CheerpJ doesn't always wrap the exception in InvocationTargetException.
            Throwable cause = (t instanceof InvocationTargetException && t.getCause() != null)
                    ? t.getCause() : t;
            System.err.print("Exception in thread \"main\" ");
            cause.printStackTrace();
            return RUNTIME_ERROR;
        }
    }

    static String readUtf8(String path) throws Exception {
        try (InputStream in = new FileInputStream(path)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            for (int n; (n = in.read(buf)) > 0; ) out.write(buf, 0, n);
            return new String(out.toByteArray(), StandardCharsets.UTF_8);
        }
    }
}
