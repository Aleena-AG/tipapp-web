/** Decorative background for tip success screen — matches design mockup */
const TipSuccessDecorations = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Soft gradient blobs */}
    <div className="absolute -left-24 top-[18%] h-[280px] w-[280px] rounded-full bg-[#0B538D]/[0.04] blur-3xl" />
    <div className="absolute -right-20 top-[12%] h-[320px] w-[320px] rounded-full bg-[#0077B6]/[0.05] blur-3xl" />
    <div className="absolute bottom-[10%] left-1/2 h-[200px] w-[400px] -translate-x-1/2 rounded-full bg-[#0B538D]/[0.03] blur-3xl" />

    {/* Large faint rings */}
    <div className="absolute left-[8%] top-[22%] h-[90px] w-[90px] rounded-full border border-[#0B538D]/10" />
    <div className="absolute right-[10%] top-[28%] h-[70px] w-[70px] rounded-full border border-[#0077B6]/12" />
    <div className="absolute right-[18%] bottom-[18%] h-[110px] w-[110px] rounded-full border border-[#0B538D]/8" />

    {/* Heart in circle — left */}
    <div className="absolute left-[6%] top-[38%] flex h-12 w-12 items-center justify-center rounded-full border border-[#0B538D]/15 bg-card/60 shadow-sm sm:left-[12%]">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#0B538D]/40" aria-hidden>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>

    {/* Gold coins — left & right */}
    {[
      { left: "4%", top: "52%", size: 52, blur: true },
      { left: "14%", top: "68%", size: 38, blur: false },
      { right: "6%", top: "48%", size: 48, blur: true },
      { right: "16%", top: "62%", size: 34, blur: false },
    ].map((coin, i) => (
      <div
        key={i}
        className={`absolute flex items-center justify-center rounded-full bg-gradient-to-br from-[#F5D76E] to-[#E8B923] shadow-[0_4px_16px_rgba(232,185,35,0.35)] ${
          coin.blur ? "opacity-50 blur-[1px]" : "opacity-70"
        }`}
        style={{
          left: coin.left,
          right: (coin as { right?: string }).right,
          top: coin.top,
          width: coin.size,
          height: coin.size,
        }}
      >
        <span className="poppins-bold text-[#8B6914]" style={{ fontSize: coin.size * 0.38 }}>
          £
        </span>
      </div>
    ))}

    {/* Wireframe globe — right */}
    <div className="absolute right-[8%] top-[20%] hidden h-16 w-16 rounded-full border border-[#0B538D]/15 sm:block">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#0B538D]/12" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#0B538D]/12" />
      <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0B538D]/12" />
    </div>

    {/* Confetti dots & stars */}
    {[
      { left: "20%", top: "15%", color: "#FFB800", shape: "dot" },
      { left: "75%", top: "18%", color: "#0B538D", shape: "star" },
      { left: "28%", top: "78%", color: "#FF5A79", shape: "dot" },
      { left: "68%", top: "75%", color: "#7B61FF", shape: "star" },
      { left: "45%", top: "12%", color: "#22A45D", shape: "dot" },
      { left: "85%", top: "35%", color: "#FFB800", shape: "dot" },
      { left: "10%", top: "28%", color: "#0077B6", shape: "star" },
    ].map((p, i) => (
      <span
        key={i}
        className={`ta-confetti absolute ${p.shape === "star" ? "ta-float" : ""}`}
        style={{
          left: p.left,
          top: p.top,
          animationDelay: `${i * 0.25}s`,
        }}
      >
        {p.shape === "dot" ? (
          <span
            className="block rounded-full"
            style={{ width: 8, height: 8, backgroundColor: p.color }}
          />
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill={p.color} aria-hidden>
            <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" />
          </svg>
        )}
      </span>
    ))}
  </div>
);

export default TipSuccessDecorations;
