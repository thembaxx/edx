import Link from "next/link";

export default function NotFound() {
  return (
    <main className="launch-screen not-found">
      <span className="launch-symbol" aria-hidden="true" />
      <h1>We've lost our way.</h1>
      <p>That page isn't part of this school day.</p>
      <Link href="/">Back to edx</Link>
    </main>
  );
}
