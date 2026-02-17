const BabRcif = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 260 380" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Background wall */}
    <rect x="0" y="0" width="260" height="380" fill="#D8C8A0" rx="2" />

    {/* Flat top with small crenellations */}
    <rect x="0" y="0" width="260" height="10" fill="#C8B888" />
    {[10, 40, 70, 100, 130, 160, 190, 220].map((x) => (
      <rect key={x} x={x} y="0" width="18" height="18" fill="#C0B080" stroke="#B0A070" strokeWidth="0.5" />
    ))}

    {/* Square frame around arch - characteristic of Bab Rcif */}
    <rect x="35" y="35" width="190" height="260" fill="#C0A870" stroke="#A89060" strokeWidth="2" rx="2" />
    
    {/* Blue zellige tile panel inside square frame */}
    <rect x="42" y="42" width="176" height="100" fill="#1B4D8C" rx="1" />
    {/* Zellige pattern */}
    {Array.from({ length: 5 }).map((_, row) =>
      Array.from({ length: 9 }).map((_, col) => (
        <g key={`${row}-${col}`} transform={`translate(${46 + col * 19}, ${46 + row * 19})`}>
          <rect x="0" y="0" width="15" height="15" fill="none" stroke="#3B7DD8" strokeWidth="0.4" />
          <line x1="0" y1="0" x2="15" y2="15" stroke="#2B6DC8" strokeWidth="0.3" />
          <line x1="15" y1="0" x2="0" y2="15" stroke="#2B6DC8" strokeWidth="0.3" />
        </g>
      ))
    )}

    {/* Wide horseshoe arch */}
    <g>
      <path d="M55,295 L55,180 Q55,110 130,95 Q205,110 205,180 L205,295 Z" fill="#D0C090" stroke="#B8A070" strokeWidth="2" />
      <path d="M67,295 L67,185 Q67,120 130,108 Q193,120 193,185 L193,295 Z" fill="#181008" />

      {/* Arch voussoirs - alternating colors */}
      <path d="M67,185 Q67,120 130,108 Q193,120 193,185" fill="none" stroke="#E0D0A8" strokeWidth="3" />
      
      {/* Striped voussoirs (characteristic) */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const angle = Math.PI + (i * Math.PI) / 11;
        const x1 = 130 + 55 * Math.cos(angle);
        const y1 = 170 + 60 * Math.sin(angle);
        const x2 = 130 + 68 * Math.cos(angle);
        const y2 = 170 + 73 * Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} 
            stroke={i % 2 === 0 ? "#D8C8A0" : "#A89060"} strokeWidth="1.5" />
        );
      })}
    </g>

    {/* Market activity through arch (bustling souk feel) */}
    {[90, 105, 125, 140, 155, 170].map((x, i) => (
      <g key={x}>
        <rect x={x} y={250 - i * 3} width={6 + (i % 3) * 2} height={20 + i * 2} fill="#C8A050" opacity="0.15" rx="1" />
      </g>
    ))}

    {/* Ground */}
    <rect x="0" y="295" width="260" height="85" fill="#C0B080" />
    
    {/* Awnings / market stalls hint */}
    <rect x="70" y="250" width="40" height="3" fill="#C04020" opacity="0.2" />
    <rect x="150" y="255" width="35" height="3" fill="#2060A0" opacity="0.2" />
  </svg>
);

export default BabRcif;
