import { ImageResponse } from "next/og";
export function renderEdxIcon(size: number, maskable = false) {
  const inset = maskable ? size * .2 : size * .08;
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#f6f7fb" }}>
      <div style={{
        width: size - inset * 2, height: size - inset * 2,
        borderRadius: Math.round(size * .24),
        background: "linear-gradient(135deg, #b44af1 4%, #4d88ff 58%, #62d8ff 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 10px 30px rgba(79,111,230,.21)",
      }}>
        <div style={{ color: "#ffffff", fontSize: size * .32, fontWeight: 800, letterSpacing: -size * .02, display: "flex", alignItems: "center" }}>e<span style={{ opacity: .84 }}>d</span>x</div>
      </div>
    </div>,
    { width: size, height: size },
  );
}
