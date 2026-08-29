import React from 'react';

interface MYatriLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'light' | 'dark' | 'white';
  showTagline?: boolean;
  taglineText?: string;
  iconOnly?: boolean;
}

export const MYatriLogo: React.FC<MYatriLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
  showTagline = false,
  taglineText = 'Bus Ticketing',
  iconOnly = false,
}) => {
  const sizeConfig = {
    xs: { height: 26, width: iconOnly ? 28 : 105 },
    sm: { height: 34, width: iconOnly ? 38 : 138 },
    md: { height: 44, width: iconOnly ? 48 : 178 },
    lg: { height: 56, width: iconOnly ? 62 : 228 },
    xl: { height: 72, width: iconOnly ? 80 : 290 },
    '2xl': { height: 96, width: iconOnly ? 106 : 380 },
  };

  const cfg = sizeConfig[size] || sizeConfig.md;
  const isWhite = variant === 'white';

  // Exact Brand Colors from the M Yatri Web Logo
  const brandBlue = isWhite ? '#FFFFFF' : '#005BA6';
  const brandOrange = isWhite ? '#FFAC59' : '#FF8C00';
  const headlightAmber = '#FFB800';
  const windshieldColor = isWhite ? '#003F75' : '#FFFFFF';
  const speedLineColor = isWhite ? '#FFFFFF' : '#005BA6';

  if (iconOnly) {
    return (
      <div className={`inline-flex items-center select-none ${className}`} title="M Yatri">
        <svg
          viewBox="0 0 155 130"
          style={{ height: cfg.height, width: 'auto' }}
          className="overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Orange Canopy Arc */}
          <path
            d="M 22 38 C 48 14, 114 14, 150 44 C 153 46, 149 49, 144 48 C 112 30, 56 28, 20 43 C 17 45, 17 40, 22 38 Z"
            fill={brandOrange}
          />

          {/* Left Side Mirror */}
          <g>
            <path
              d="M 16 48 C 11 48, 9 52, 9 57 C 9 65, 14 65, 15 60 Z"
              fill={brandBlue}
            />
            <path
              d="M 15 54 Q 20 54, 21 57"
              stroke={brandBlue}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* Bus Main Cabin */}
          <path
            d="M 23 46 C 30 43, 68 41, 80 46 C 86 48, 88 54, 88 64 L 88 98 C 88 103, 83 105, 78 105 L 28 105 C 23 105, 20 101, 20 95 L 20 52 C 20 48, 21 46, 23 46 Z"
            fill={brandBlue}
          />

          {/* Windshield Panoramic Glass */}
          <path
            d="M 26 51 C 32 49, 62 48, 75 51 C 78 52, 79 55, 79 60 L 79 75 C 79 77, 77 79, 74 79 L 27 79 C 25 79, 23 77, 23 74 L 23 56 C 23 53, 24 51, 26 51 Z"
            fill={windshieldColor}
          />

          {/* Amber Yellow Headlights */}
          <ellipse cx="28" cy="90" rx="4.5" ry="3.5" fill={headlightAmber} transform="rotate(-6 28 90)" />
          <ellipse cx="73" cy="90" rx="4.5" ry="3.5" fill={headlightAmber} transform="rotate(6 73 90)" />

          {/* Center Grille Dots */}
          <circle cx="45" cy="90" r="1.5" fill={windshieldColor} opacity="0.95" />
          <circle cx="50" cy="90" r="1.5" fill={windshieldColor} opacity="0.95" />
          <circle cx="55" cy="90" r="1.5" fill={windshieldColor} opacity="0.95" />

          {/* Ground Speedline Shadow */}
          <path
            d="M 22 105 C 38 111, 74 111, 108 105 L 122 105 C 102 112, 52 114, 22 106 Z"
            fill={speedLineColor}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`} title="M Yatri Bus Services">
      <svg
        viewBox="0 0 350 120"
        style={{ height: cfg.height, width: 'auto' }}
        className="overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. ORANGE SPEED CANOPY SWOOSH (Top Arch over bus and M) */}
        <path
          d="M 24 39 C 55 13, 126 13, 168 45 C 172 48, 167 52, 161 50 C 122 29, 64 27, 22 44 C 18 46, 18 41, 24 39 Z"
          fill={brandOrange}
        />

        {/* 2. BLUE STREAMLINED ROOF HOOD (Extends above the M) */}
        <path
          d="M 75 42 C 97 36, 142 39, 164 57 C 167 59, 164 62, 160 61 C 140 47, 103 44, 74 50 Z"
          fill={brandBlue}
        />

        {/* 3. BUS FRONT CABIN (Left) */}
        <g id="bus-front">
          {/* Left Side Mirror */}
          <path
            d="M 18 49 C 14 49, 11 53, 11 58 C 11 66, 16 66, 17 61 Z"
            fill={brandBlue}
          />
          <path
            d="M 17 55 Q 22 55, 23 58"
            stroke={brandBlue}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Main Bus Front Cabin */}
          <path
            d="M 24 47 C 32 44, 69 42, 81 47 C 87 49, 89 55, 89 65 L 89 99 C 89 104, 84 106, 79 106 L 29 106 C 24 106, 21 102, 21 96 L 21 53 C 21 49, 22 47, 24 47 Z"
            fill={brandBlue}
          />

          {/* Panoramic Windshield (Clean White) */}
          <path
            d="M 27 52 C 33 50, 63 49, 76 52 C 79 53, 80 56, 80 61 L 80 76 C 80 78, 78 80, 75 80 L 28 80 C 26 80, 24 78, 24 75 L 24 57 C 24 54, 25 52, 27 52 Z"
            fill={windshieldColor}
          />

          {/* Dual Amber Headlights */}
          <ellipse cx="28.5" cy="91.5" rx="4.5" ry="3.5" fill={headlightAmber} transform="rotate(-6 28.5 91.5)" />
          <ellipse cx="73.5" cy="91.5" rx="4.5" ry="3.5" fill={headlightAmber} transform="rotate(6 73.5 91.5)" />

          {/* 3 Center Grille Accent Dots */}
          <circle cx="45.5" cy="91.5" r="1.5" fill={windshieldColor} opacity="0.95" />
          <circle cx="50.5" cy="91.5" r="1.5" fill={windshieldColor} opacity="0.95" />
          <circle cx="55.5" cy="91.5" r="1.5" fill={windshieldColor} opacity="0.95" />

          {/* Bottom Speedline Streak / Ground Shadow */}
          <path
            d="M 23 106 C 38 112, 75 112, 110 106 L 124 106 C 104 113, 54 115, 23 107 Z"
            fill={speedLineColor}
          />
        </g>

        {/* 4. BLUE CAPITAL "M" */}
        <g id="letter-M" fill={brandBlue}>
          <path
            d="M 100 55 L 115 55 L 126 86 L 137 55 L 152 55 L 152 106 L 139 106 L 139 71 L 130 96 L 122 96 L 113 71 L 113 106 L 100 106 Z"
          />
        </g>

        {/* 5. ORANGE WORDMARK "Yatri" */}
        <g id="wordmark-Yatri" fill={brandOrange}>
          {/* 'Y' */}
          <path
            d="M 158 55 L 171 55 L 180 79 L 189 55 L 202 55 L 186 89 L 186 106 L 174 106 L 174 89 Z"
          />
          {/* 'a' */}
          <path
            d="M 223 72 C 223 67 218 63 211 63 C 203 63 199 67 198 71 L 187 71 C 188 61 197 53 211 53 C 226 53 235 62 235 74 L 235 106 L 223 106 L 223 100 C 219 105 212 107 205 107 C 194 107 186 101 186 91 C 186 81 194 75 208 75 L 223 75 Z M 223 83 L 209 83 C 203 83 198 86 198 91 C 198 96 202 99 208 99 C 216 99 223 94 223 88 Z"
          />
          {/* 't' */}
          <path
            d="M 245 64 L 254 64 L 254 55 L 245 55 L 245 44 L 234 44 L 234 55 L 228 55 L 228 64 L 234 64 L 234 94 C 234 103 239 107 251 107 L 256 107 L 256 98 L 249 98 C 246 98 245 96 245 92 Z"
          />
          {/* 'r' */}
          <path
            d="M 260 55 L 271 55 L 271 66 C 275 58 281 54 289 54 L 289 66 C 279 66 271 71 271 82 L 271 106 L 260 106 Z"
          />
          {/* 'i' */}
          <circle cx="301" cy="44" r="5.5" />
          <path d="M 295 55 L 307 55 L 307 106 L 295 106 Z" />
        </g>

        {/* Optional Tagline */}
        {showTagline && (
          <text
            x="158"
            y="118"
            fill={isWhite ? '#FFD4AA' : '#FF8C00'}
            fontSize="9.5"
            fontWeight="800"
            letterSpacing="2.8"
            className="uppercase select-none font-sans"
          >
            {taglineText}
          </text>
        )}
      </svg>
    </div>
  );
};
