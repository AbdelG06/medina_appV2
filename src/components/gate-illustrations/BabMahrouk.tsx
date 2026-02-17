const BabMahrouk = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 260 380" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Background - fortress wall */}
    <rect x="0" y="0" width="260" height="380" fill="#BCA870" rx="2" />

    {/* Heavy crenellations - fortress style */}
    {[0, 36, 72, 108, 144, 180, 216].map((x) => (
      <rect key={x} x={x} y="0" width="28" height="35" fill="#A89060" stroke="#988050" strokeWidth="0.5" />
    ))}
    <rect x="0" y="35" width="260" height="10" fill="#A89060" />

    {/* Massive flanking bastions */}
    <rect x="0" y="20" width="55" height="300" fill="#B8A068" stroke="#A89058" strokeWidth="1" />
    <rect x="205" y="20" width="55" height="300" fill="#B8A068" stroke="#A89058" strokeWidth="1" />
    
    {/* Bastion arrow slits */}
    <rect x="22" y="80" width="4" height="18" fill="#2A1808" rx="1" />
    <rect x="22" y="150" width="4" height="18" fill="#2A1808" rx="1" />
    <rect x="232" y="80" width="4" height="18" fill="#2A1808" rx="1" />
    <rect x="232" y="150" width="4" height="18" fill="#2A1808" rx="1" />

    {/* Decorative panel above arch */}
    <rect x="55" y="50" width="150" height="50" fill="#8B6B35" rx="2" />
    {/* Kufic-style decorative band */}
    {Array.from({ length: 10 }).map((_, i) => (
      <g key={i} transform={`translate(${60 + i * 14}, 55)`}>
        <rect x="0" y="0" width="4" height="20" fill="#A88B45" />
        <rect x="6" y="10" width="4" height="15" fill="#A88B45" />
        <rect x="0" y="28" width="10" height="3" fill="#A88B45" />
      </g>
    ))}

    {/* Main arch - heavy and imposing */}
    <g>
      <path d="M60,320 L60,175 Q60,90 130,75 Q200,90 200,175 L200,320 Z" fill="#A89060" stroke="#907848" strokeWidth="3" />
      <path d="M75,320 L75,180 Q75,105 130,92 Q185,105 185,180 L185,320 Z" fill="#140C04" />

      {/* Double arch ring */}
      <path d="M75,180 Q75,105 130,92 Q185,105 185,180" fill="none" stroke="#C8B070" strokeWidth="3" />
      <path d="M68,178 Q68,98 130,84 Q192,98 192,178" fill="none" stroke="#B8A060" strokeWidth="2" />

      {/* Iron reinforcement suggestion */}
      <line x1="130" y1="92" x2="130" y2="320" stroke="#4A3828" strokeWidth="1.5" opacity="0.4" />
      <line x1="75" y1="240" x2="185" y2="240" stroke="#4A3828" strokeWidth="1" opacity="0.3" />
    </g>

    {/* Ground */}
    <rect x="0" y="320" width="260" height="60" fill="#A89058" />

    {/* Borj Nord suggestion in background through arch */}
    <rect x="115" y="110" width="30" height="50" fill="#5A4A30" opacity="0.15" />
    <polygon points="115,110 130,95 145,110" fill="#5A4A30" opacity="0.1" />
  </svg>
);

export default BabMahrouk;
