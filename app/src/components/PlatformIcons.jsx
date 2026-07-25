export default function PlatformIcons({ platforms = [] }) {
  const norm = (platforms || []).map((p) => String(p).toLowerCase());
  const showPC = true; // PC is ALWAYS present for every Steam PC game
  const showMac = norm.includes('mac') || norm.includes('apple');
  const showLinux = norm.includes('linux');

  return (
    <div className="flex items-center gap-1 text-[10px] font-extrabold tracking-wider">
      <span className="px-1.5 py-0.5 rounded bg-white/10 text-neon-cyan border border-neon-cyan/30">
        PC
      </span>
      {showMac && (
        <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/20">
          Mac
        </span>
      )}
      {showLinux && (
        <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/20">
          Linux
        </span>
      )}
    </div>
  );
}
