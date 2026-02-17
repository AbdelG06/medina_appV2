const BabChorfa = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 260 380" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Background wall - refined plaster */}
    <rect x="0" y="0" width="260" height="380" fill="#E0D4B8" rx="2" />

    {/* Elegant cornice top */}
    <rect x="0" y="0" width="260" height="8" fill="#C8BC9C" />
    <rect x="0" y="8" width="260" height="4" fill="#D0C4A8" />
    {/* Dentil molding */}
    {Array.from({ length: 26 }).map((_, i) => (
      <rect key={i} x={5 + i * 10} y="12" width="6" height="6" fill="#C0B498" />
    ))}

    {/* Ornate rectangular frame */}
    <rect x="30" y="25" width="200" height="275" fill="none" stroke="#B8A878" strokeWidth="3" rx="3" />
    
    {/* Intricate zellige mosaic panel - green (spiritual) */}
    <rect x="38" y="32" width="184" height="80" fill="#0E4D2A" rx="2" />
    {/* Star pattern (characteristic of sacred architecture) */}
    {Array.from({ length: 4 }).map((_, row) =>
      Array.from({ length: 9 }).map((_, col) => (
        <g key={`${row}-${col}`} transform={`translate(${44 + col * 20}, ${36 + row * 19})`}>
          <polygon points="7,0 9,5 14,5 10,8 12,14 7,10 2,14 4,8 0,5 5,5" 
            fill="#1D7A45" opacity="0.7" />
          <circle cx="7" cy="7" r="1.5" fill="#2DA060" opacity="0.5" />
        </g>
      ))
    )}

    {/* Calligraphic band */}
    <rect x="38" y="112" width="184" height="14" fill="#8B6B25" />
    {Array.from({ length: 12 }).map((_, i) => (
      <g key={i} transform={`translate(${44 + i * 15}, 114)`}>
        <path d={`M0,5 Q3,0 7,5 Q10,10 13,5`} fill="none" stroke="#C8A840" strokeWidth="0.8" />
      </g>
    ))}

    {/* Ornate polylobed arch (multi-foil) */}
    <g>
      <path d="M55,300 L55,180 Q55,110 130,95 Q205,110 205,180 L205,300 Z" fill="#D4C8A8" stroke="#B8A878" strokeWidth="2" />
      
      {/* Multi-foil (polylobed) inner arch */}
      <path d="M68,300 L68,185 Q68,120 130,108 Q192,120 192,185 L192,300 Z" fill="#140A04" />
      
      {/* Polylobed decoration - scalloped edge */}
      <path d="M68,185 Q68,120 130,108 Q192,120 192,185" fill="none" stroke="#D4C8A8" strokeWidth="2.5" />
      
      {/* Scallops along arch */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
        const angle = Math.PI + (i * Math.PI) / 10;
        const cx = 130 + 52 * Math.cos(angle);
        const cy = 168 + 55 * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r="6" fill="none" stroke="#C8B890" strokeWidth="1" />;
      })}

      {/* Radiating voussoir lines */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
        const angle = Math.PI + (i * Math.PI) / 12;
        const x1 = 130 + 55 * Math.cos(angle);
        const y1 = 168 + 58 * Math.sin(angle);
        const x2 = 130 + 72 * Math.cos(angle);
        const y2 = 168 + 75 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8BC9C" strokeWidth="0.8" />;
      })}
    </g>

    {/* Pillar details on sides */}
    <rect x="55" y="130" width="8" height="170" fill="#D0C4A8" stroke="#C0B498" strokeWidth="0.5" />
    <rect x="197" y="130" width="8" height="170" fill="#D0C4A8" stroke="#C0B498" strokeWidth="0.5" />
    {/* Column capitals */}
    <rect x="52" y="126" width="14" height="8" fill="#C8BC9C" rx="1" />
    <rect x="194" y="126" width="14" height="8" fill="#C8BC9C" rx="1" />

    {/* Ground */}
    <rect x="0" y="300" width="260" height="80" fill="#C8BC9C" />

    {/* Lamp / lantern detail hanging in arch */}
    <line x1="130" y1="108" x2="130" y2="140" stroke="#8B6B25" strokeWidth="0.5" />
    <polygon points="125,140 135,140 133,155 127,155" fill="#C8A040" opacity="0.4" />
  </svg>
);

export default BabChorfa;
