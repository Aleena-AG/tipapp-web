/** Shared decorative background for all Service Provider screens so the
 *  backdrop stays consistent between the home and its sub-screens. */
const SPScreenBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Light mode soft brand blobs */}
    <div className="absolute -left-40 -top-40 h-[460px] w-[460px] rounded-full bg-[#9E2A2B]/[0.06] blur-[70px] dark:hidden" />
    <div className="absolute -bottom-48 -right-40 h-[520px] w-[520px] rounded-full bg-[#d71921]/[0.07] blur-[80px] dark:hidden" />
    <div className="absolute right-1/4 top-1/3 h-[280px] w-[280px] rounded-full bg-[#9E2A2B]/[0.04] blur-[60px] dark:hidden" />

    {/* Dark mode — midnight navy + soft red glow */}
    <div className="absolute inset-0 hidden bg-[#010816] dark:block" />
    <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_65%_50%_at_50%_30%,rgba(158,42,43,0.22)_0%,transparent_60%)] dark:block" />
    <div className="absolute -left-40 -top-40 hidden h-[460px] w-[460px] rounded-full bg-[#9E2A2B]/20 blur-[90px] dark:block" />
    <div className="absolute -bottom-48 -right-40 hidden h-[520px] w-[520px] rounded-full bg-[#d71921]/15 blur-[100px] dark:block" />

    {/* Faint concentric rings — top left */}
    <div className="absolute -left-20 -top-20 h-[220px] w-[220px] rounded-full border border-[#9E2A2B]/10 dark:border-[#E8B923]/15" />
    <div className="absolute -left-10 -top-10 h-[160px] w-[160px] rounded-full border border-[#9E2A2B]/[0.08] dark:border-[#E8B923]/10" />

    {/* Faint ring — bottom right */}
    <div className="absolute bottom-[8%] right-[6%] h-[140px] w-[140px] rounded-full border border-[#d71921]/10 dark:border-[#E8B923]/12" />
  </div>
);

export default SPScreenBackground;
