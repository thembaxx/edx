export default function Loading() {
  return (
    <main className="launch-screen" aria-live="polite">
      <BrandMark className="launch-symbol" />
      <span>Opening Kinlo…</span>
    </main>
  );
}
import BrandMark from "../src/components/BrandMark";
