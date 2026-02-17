const BabDekkakin = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 260 380" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Background wall */}
    <rect x="0" y="0" width="260" height="380" fill="#D0C0A0" rx="2" />

    {/* Crenellations on top */}
    {[0, 26, 52, 78, 104, 130, 156, 182, 208, 234].map((x) => (
      <rect key={x} x={x} y="0" width="20" height="25" fill="#C0B090" stroke="#B4A684" strokeWidth="0.5" />
    ))}
    <rect x="0" y="25" width="260" height="8" fill="#C0B090" />

    {/* Main zellige panel - green */}
    <rect x="15" y="40" width="230" height="240" rx="3" fill="#2D5D3F" />
    {/* Zellige geometric pattern */}
    {Array.from({ length: 12 }).map((_, row) =>
      Array.from({ length: 11 }).map((_, col) => (
        <g key={`${row}-${col}`} transform={`translate(${20 + col * 20}, ${45 + row * 19})`}>
          <rect x="1" y="1" width="16" height="16" fill="none" stroke="#4D7D5F" strokeWidth="0.5" />
          <polygon points="8,2 14,8 8,14 2,8" fill="none" stroke="#6D9D7F" strokeWidth="0.4" />
          <circle cx="8" cy="8" r="2" fill="none" stroke="#8DBD9F" strokeWidth="0.3" />
        </g>
      ))
    )}

    {/* Gold decorative band */}
    <rect x="15" y="145" width="230" height="18" fill="#B8860B" opacity="0.8" />
    {Array.from({ length: 23 }).map((_, i) => (
      <polygon key={i} points={`${20 + i * 10},148 ${25 + i * 10},155 ${20 + i * 10},162`} fill="#DAA520" opacity="0.6" />
    ))}

    {/* Main central horseshoe arch */}
    <g>
      {/* Arch frame - beige stone */}
      <path d="M60,280 L60,170 Q60,100 130,90 Q200,100 200,170 L200,280 Z" fill="#E8D8B8" stroke="#C4B090" strokeWidth="2" />
      {/* Inner arch opening */}
      <path d="M72,280 L72,175 Q72,115 130,105 Q188,115 188,175 L188,280 Z" fill="#2A1810" />
      {/* Arch keystone decorations */}
      <path d="M72,175 Q72,115 130,105 Q188,115 188,175" fill="none" stroke="#D4C4A0" strokeWidth="3" />
      {/* Inner decorative arch line */}
      <path d="M80,175 Q80,125 130,115 Q180,125 180,175" fill="none" stroke="#C4A050" strokeWidth="1" />

      {/* Scalloped arch detail (polylobed) */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = Math.PI + (i * Math.PI) / 7;
        const cx = 130 + 50 * Math.cos(angle);
        const cy = 165 + 40 * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r="8" fill="none" stroke="#C4A050" strokeWidth="0.5" />;
      })}
    </g>

    {/* Left small arch */}
    <g>
      <path d="M18,280 L18,210 Q18,180 40,175 Q62,180 62,210 L62,280 Z" fill="#E0D0B0" stroke="#C4B090" strokeWidth="1.5" />
      <path d="M24,280 L24,213 Q24,187 40,183 Q56,187 56,213 L56,280 Z" fill="#1A1008" />
    </g>

    {/* Right small arch */}
    <g>
      <path d="M198,280 L198,210 Q198,180 220,175 Q242,180 242,210 L242,280 Z" fill="#E0D0B0" stroke="#C4B090" strokeWidth="1.5" />
      <path d="M204,280 L204,213 Q204,187 220,183 Q236,187 236,213 L236,280 Z" fill="#1A1008" />
    </g>

    {/* Ground / threshold */}
    <rect x="0" y="280" width="260" height="100" fill="#C8B890" />
    <line x1="0" y1="280" x2="260" y2="280" stroke="#B8A67A" strokeWidth="1" />

    {/* People silhouettes for scale (subtle) */}
    <ellipse cx="110" cy="270" rx="6" ry="12" fill="#2A1810" opacity="0.3" />
    <ellipse cx="150" cy="268" rx="5" ry="14" fill="#2A1810" opacity="0.25" />
  </svg>
);

export default BabDekkakin;
