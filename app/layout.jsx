export const metadata = {
  title: "Stream Atlas — 100 Java Stream Interview Questions",
  description:
    "Practice Java Streams API with 100 interview questions, hints, official solutions, and a live in-browser editor.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#0a0a0b",
          color: "#ededee",
          fontFamily:
            "'Geist', 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
