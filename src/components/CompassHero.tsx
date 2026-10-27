import { BookOpen, MessageCircle, Target } from 'lucide-react';

export default function CompassHero() {
  return (
    <div className="compass-hero" aria-hidden="true">
      <svg
        className="compass-svg"
        viewBox="0 0 200 200"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="compassFace" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#faf8f5" />
          </radialGradient>
          <linearGradient id="needleGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4c19a" />
            <stop offset="100%" stopColor="#b49a68" />
          </linearGradient>
          <linearGradient id="needleNavy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e2a47" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Outer ring */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="#b49a68" strokeWidth="2" />
        <circle cx="100" cy="100" r="86" fill="url(#compassFace)" stroke="#d4c19a" strokeWidth="1" />

        {/* Direction markers (N, E, S, W) */}
        <g className="compass-markers" fill="#0f172a" fontFamily="'Playfair Display', serif" fontWeight="700">
          <text x="100" y="26" textAnchor="middle" fontSize="15">N</text>
          <text x="178" y="106" textAnchor="middle" fontSize="13">E</text>
          <text x="100" y="184" textAnchor="middle" fontSize="13">S</text>
          <text x="22" y="106" textAnchor="middle" fontSize="13">W</text>
        </g>

        {/* Tick marks */}
        <g stroke="#b49a68" strokeWidth="1">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const inner = i % 3 === 0 ? 78 : 82;
            const x1 = 100 + Math.sin(angle) * inner;
            const y1 = 100 - Math.cos(angle) * inner;
            const x2 = 100 + Math.sin(angle) * 86;
            const y2 = 100 - Math.cos(angle) * 86;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>

        {/* Needle group rotates via CSS animation */}
        <g className="compass-needle-group" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          {/* Gold tip (points up at 0deg = North) */}
          <polygon points="100,22 110,100 90,100" fill="url(#needleGold)" stroke="#b49a68" strokeWidth="0.75" />
          {/* Navy tail */}
          <polygon points="100,178 110,100 90,100" fill="url(#needleNavy)" stroke="#0f172a" strokeWidth="0.75" />
        </g>

        {/* Center pin */}
        <circle cx="100" cy="100" r="6" fill="#0f172a" />
        <circle cx="100" cy="100" r="3" fill="#d4c19a" />
      </svg>

      {/* Supporting icons */}
      <div className="compass-icons">
        <div className="compass-icon compass-icon-book">
          <BookOpen />
        </div>
        <div className="compass-icon compass-icon-chat">
          <MessageCircle />
        </div>
        <div className="compass-icon compass-icon-target">
          <Target />
        </div>
      </div>
    </div>
  );
}
