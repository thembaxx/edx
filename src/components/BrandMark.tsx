import Image from "next/image";

export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      width={128}
      height={128}
      alt=""
      aria-hidden="true"
      className={`brand-mark ${className}`}
      unoptimized
    />
  );
}
