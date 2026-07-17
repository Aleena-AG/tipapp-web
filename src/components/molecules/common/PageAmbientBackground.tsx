/**
 * Ambient background matching the tipper dark design:
 * deep midnight navy (#010816) with soft blue center glow.
 * Light mode keeps soft lavender blobs.
 */
export const PageAmbientBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Light mode blobs */}
    <div className="absolute -left-64 -top-52 h-[640px] w-[640px] rounded-full bg-[#D5DBF1] blur-[60px] dark:hidden" />
    <div className="absolute -bottom-56 -left-40 h-[680px] w-[900px] rounded-[46%] bg-[#D3DEF2] blur-[60px] dark:hidden" />
    <div className="absolute -right-48 top-10 h-[680px] w-[680px] rounded-full bg-[#D2E1F2] blur-[70px] dark:hidden" />
    <div className="absolute bottom-4 right-1/4 h-[480px] w-[760px] rounded-[46%] bg-[#DBE0F3] blur-[60px] dark:hidden" />
    <div className="absolute right-16 top-1/3 h-[320px] w-[320px] rounded-full bg-[#D8E2F1] blur-[50px] dark:hidden" />

    {/* Dark mode — deep navy atmosphere + soft blue glow */}
    <div className="absolute inset-0 hidden dark:block bg-[#010816]" />
    <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_70%_55%_at_58%_42%,rgba(11,83,141,0.42)_0%,rgba(5,22,48,0.5)_35%,transparent_65%)]" />
    <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_45%_35%_at_18%_12%,rgba(37,99,235,0.14)_0%,transparent_55%)]" />
    <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_40%_35%_at_88%_78%,rgba(11,83,141,0.2)_0%,transparent_50%)]" />
    <div className="absolute left-1/2 top-[38%] hidden h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0B538D]/20 blur-[100px] dark:block" />
  </div>
);
