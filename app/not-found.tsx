import Link from "next/link";
import BrandMark from "../src/components/BrandMark";

export default function NotFound() {
  return (
    <main className="launch-screen not-found">
      <BrandMark className="launch-symbol" />
      <h1>Page not found.</h1>
      <p>Return to your school workspace to continue.</p>
      <Link href="/">Back to Kinlo</Link>
    </main>
  );
}
