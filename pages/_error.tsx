type ErrorProps = {
  statusCode?: number;
};

export default function ErrorPage({ statusCode = 404 }: ErrorProps) {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#07101e", color: "#fff", padding: 24 }}>
      <div style={{ maxWidth: 560, textAlign: "center" }}>
        <p style={{ color: "#f4b54d", letterSpacing: "0.4em", fontSize: 11, textTransform: "uppercase" }}>{statusCode}</p>
        <h1 style={{ fontSize: 48, lineHeight: 1.05, margin: "16px 0" }}>This rhythm is off-map.</h1>
        <p style={{ color: "rgba(255,255,255,0.62)" }}>The requested page could not be loaded.</p>
        <a href="/" style={{ display: "inline-block", marginTop: 28, borderRadius: 999, background: "#f4b54d", color: "#07101e", padding: "12px 24px", fontWeight: 700, textDecoration: "none" }}>
          Return Home
        </a>
      </div>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: { res?: { statusCode?: number }; err?: { statusCode?: number } }) => {
  return { statusCode: res?.statusCode || err?.statusCode || 404 };
};
