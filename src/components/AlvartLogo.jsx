export default function AlvartLogo({ size = 56, withText = false, className = '' }) {
  return (
    <div className={`alvart-logo-container ${className}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', background: 'transparent' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Red Ring */}
        <circle cx="100" cy="100" r="92" stroke="#d92121" strokeWidth="12" fill="#d92121" />

        {/* Thin White Outer Border Line */}
        <circle cx="100" cy="100" r="86" stroke="#ffffff" strokeWidth="3.5" fill="none" />

        {/* Dark Navy Concentric Ring */}
        <circle cx="100" cy="100" r="76" stroke="#091636" strokeWidth="8" fill="#d92121" />

        {/* Thin Inner White Line */}
        <circle cx="100" cy="100" r="72" stroke="#ffffff" strokeWidth="2.5" fill="#d92121" />

        {/* Inner Red Core Field */}
        <circle cx="100" cy="100" r="70" fill="#d92121" />

        {/* 4-Pointed Curved Star (Outer White Shield) */}
        <path
          d="M 100 34 C 100 66 134 100 166 100 C 134 100 100 134 100 166 C 100 134 66 100 34 100 C 66 100 100 66 100 34 Z"
          fill="#ffffff"
          stroke="#091636"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* 4-Pointed Curved Star (Inner Dark Navy Frame) */}
        <path
          d="M 100 48 C 100 72 128 100 152 100 C 128 100 100 128 100 152 C 100 128 72 100 48 100 C 72 100 100 72 100 48 Z"
          fill="#091636"
        />

        {/* Center White Diamond Star */}
        <path
          d="M 100 72 L 118 100 L 100 128 L 82 100 Z"
          fill="#ffffff"
        />

        {/* Center Navy Diamond Frame */}
        <path
          d="M 100 79 L 113 100 L 100 121 L 87 100 Z"
          fill="#091636"
        />

        {/* Center Tiny Red Diamond Accent */}
        <path
          d="M 100 88 L 108 100 L 100 112 L 92 100 Z"
          fill="#d92121"
        />
      </svg>

      {withText && (
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <span style={{
            display: 'block',
            fontSize: '11px',
            letterSpacing: '3px',
            color: '#cfd7eb',
            fontWeight: 500,
            textTransform: 'uppercase'
          }}>
            UNIVERSIDAD
          </span>
          <span style={{
            display: 'block',
            fontSize: '24px',
            letterSpacing: '4px',
            color: '#ffffff',
            fontWeight: 800,
            lineHeight: 1.1
          }}>
            ALVART
          </span>
        </div>
      )}
    </div>
  );
}
