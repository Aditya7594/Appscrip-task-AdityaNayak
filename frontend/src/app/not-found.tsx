import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found container" style={{ padding: "80px 16px", textAlign: "center" }}>
      <h1 style={{ fontSize: "36px", fontWeight: 700, marginBottom: "16px", textTransform: "uppercase" }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: "18px", color: "var(--color-text-muted)", marginBottom: "32px" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/products"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "var(--color-black)",
          color: "var(--color-white)",
          fontSize: "16px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        Return to Products
      </Link>
    </section>
  );
}
