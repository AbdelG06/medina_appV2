const BabFtouh = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 260 380" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Background wall - weathered stone */}
    <rect x="0" y="0" width="260" height="380" fill="#C8B890" rx="2" />

    {/* Crenellations - merlons */}
    {[0, 32.5, 65, 97.5, 130, 162.5, 195, 227.5].map((x) => (
      <rect key={x} x={x} y="0" width="24" height="30" fill="#B8A878" stroke="#A89868" strokeWidth="0.5" />
    ))}
    <rect x="0" y="30" width="260" height="6" fill="#B8A878" />

    {/* Stone block texture */}
    {Array.from({ length: 8 }).map((_, row) => (
      <line key={row} x1="0" y1={45 + row * 28} x2="260" y2={45 + row * 28} stroke="#B8A878" strokeWidth="0.3" opacity="0.5" />
    ))}

    {/* Main massive arch - simple fortified style */}
    <g>
      {/* Outer arch frame */}
      <path d="M50,320 L50,160 Q50,70 130,60 Q210,70 210,160 L210,320 Z" fill="#B0A070" stroke="#9A8A60" strokeWidth="2.5" />
      {/* Inner arch */}
      <path d="M65,320 L65,165 Q65,85 130,75 Q195,85 195,165 L195,320 Z" fill="#1A1208" />

      {/* Horseshoe arch detail */}
      <path d="M65,165 Q65,85 130,75 Q195,85 195,165" fill="none" stroke="#C8B890" strokeWidth="3" />
      <path d="M65,175 Q65,95 130,85 Q195,95 195,175" fill="none" stroke="#C8B890" strokeWidth="1" />

      {/* Keystone */}
      <path d="M125,75 L130,68 L135,75" fill="#A89868" stroke="#988858" strokeWidth="1" />
    </g>

    {/* Decorative band above arch */}
    <rect x="30" y="50" width="200" height="12" fill="#8B7355" rx="1" />
    {Array.from({ length: 20 }).map((_, i) => (
      <rect key={i} x={35 + i * 10} y="52" width="6" height="8" rx="1" fill="#7A6345" />
    ))}

    {/* Flanking towers/buttresses */}
    <rect x="0" y="40" width="40" height="280" fill="#BCA878" stroke="#A89868" strokeWidth="0.5" />
    <rect x="220" y="40" width="40" height="280" fill="#BCA878" stroke="#A89868" strokeWidth="0.5" />

    {/* Ground */}
    <rect x="0" y="320" width="260" height="60" fill="#A89868" />

    {/* Cemetery suggestion (crosses/tombstones in distance through arch) */}
    {[90, 110, 130, 150, 170].map((x) => (
      <rect key={x} x={x} y={240 + Math.random() * 30} width="3" height="12" fill="#3A3020" opacity="0.2" rx="1" />
    ))}

    {/* Path through arch */}
    <path d="M100,320 L120,260 L140,260 L160,320" fill="#2A2018" opacity="0.15" />
  </svg>
);

export default BabFtouh;
