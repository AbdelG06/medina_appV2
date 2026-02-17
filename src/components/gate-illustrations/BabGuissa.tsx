const BabGuissa = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 260 380" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Background - hilltop stone wall */}
    <rect x="0" y="0" width="260" height="380" fill="#D0C098" rx="2" />

    {/* Crenellations - pointed merlons */}
    {[0, 28, 56, 84, 112, 140, 168, 196, 224].map((x) => (
      <polygon key={x} points={`${x},28 ${x + 14},0 ${x + 28},28`} fill="#C0B088" stroke="#A89868" strokeWidth="0.5" />
    ))}
    <rect x="0" y="28" width="260" height="8" fill="#C0B088" />

    {/* Tower left */}
    <rect x="0" y="10" width="50" height="310" fill="#C8B890" stroke="#B8A878" strokeWidth="0.5" />
    <rect x="5" y="50" width="40" height="3" fill="#B0A070" />
    <rect x="5" y="100" width="40" height="3" fill="#B0A070" />

    {/* Tower right */}
    <rect x="210" y="10" width="50" height="310" fill="#C8B890" stroke="#B8A878" strokeWidth="0.5" />
    <rect x="215" y="50" width="40" height="3" fill="#B0A070" />
    <rect x="215" y="100" width="40" height="3" fill="#B0A070" />

    {/* Pointed horseshoe arch */}
    <g>
      <path d="M55,320 L55,170 Q55,80 130,55 Q205,80 205,170 L205,320 Z" fill="#BCA878" stroke="#A89060" strokeWidth="2" />
      <path d="M68,320 L68,175 Q68,95 130,72 Q192,95 192,175 L192,320 Z" fill="#181008" />

      {/* Pointed arch top emphasis */}
      <path d="M68,175 Q68,95 130,72 Q192,95 192,175" fill="none" stroke="#D4C4A0" strokeWidth="2.5" />

      {/* Decorative voussoirs */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        const angle = Math.PI + (i * Math.PI) / 9;
        const x1 = 130 + 55 * Math.cos(angle);
        const y1 = 155 + 70 * Math.sin(angle);
        const x2 = 130 + 65 * Math.cos(angle);
        const y2 = 155 + 80 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C0B080" strokeWidth="1" />;
      })}
    </g>

    {/* Zellige band above arch */}
    <rect x="50" y="42" width="160" height="18" fill="#1A5B3A" rx="2" />
    {Array.from({ length: 16 }).map((_, i) => (
      <polygon key={i} points={`${58 + i * 10},46 ${63 + i * 10},51 ${58 + i * 10},56 ${53 + i * 10},51`} fill="#2D8B55" opacity="0.6" />
    ))}

    {/* View of city through arch (panorama suggestion) */}
    <rect x="80" y="200" width="100" height="40" fill="#3A6848" opacity="0.15" rx="2" />
    {[95, 115, 135, 155].map((x) => (
      <rect key={x} x={x} y={210} width="8" height="25" fill="#4A7858" opacity="0.12" />
    ))}

    {/* Ground */}
    <rect x="0" y="320" width="260" height="60" fill="#B8A878" />
    <path d="M90,320 L115,280 L145,280 L170,320" fill="#201808" opacity="0.1" />
  </svg>
);

export default BabGuissa;
