import React from 'react';

export type LogoVariant = 'primary' | 'compact' | 'authentication' | 'dashboard';

interface AvolabLogoProps {
  variant?: LogoVariant;
  className?: string;
  onClick?: () => void;
  showSubtitle?: boolean;
  lightMode?: boolean;
}

export const AvolabLogo: React.FC<AvolabLogoProps> = ({
  variant = 'primary',
  className = '',
  onClick,
  showSubtitle = true,
  lightMode = false
}) => {
  // Color palette according to specifications
  const primaryColor = lightMode ? '#FFFFFF' : '#4A5D4E';    // Primary dark green or white in lightMode
  const secondaryColor = lightMode ? '#DDEAD2' : '#4C5D4B';  // Secondary dark green or sage in lightMode
  const sageColor = '#DDEAD2';       // Sage green
  const creamColor = '#F6F1E8';      // Main background/light tone

  // Simple Minimalist Avocado Vector Icon
  const AvocadoIcon = ({ size = 36 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform group-hover:scale-105 duration-300 flex-shrink-0"
    >
      {/* Outer Skin: #4A5D4E */}
      <path
        d="M50 8 C30 8 20 30 20 56 C20 76 33 88 50 88 C67 88 80 76 80 56 C80 30 70 8 50 8 Z"
        fill={primaryColor}
      />
      {/* Avocado Flesh: #DDEAD2 */}
      <path
        d="M50 14 C34 14 26 33 26 56 C26 72 36 82 50 82 C64 82 74 72 74 56 C74 33 66 14 50 14 Z"
        fill={sageColor}
      />
      {/* Inner Flesh / Highlight: #F6F1E8 */}
      <path
        d="M50 20 C38 20 31 36 31 56 C31 68 39 76 50 76 C61 76 69 68 69 56 C69 36 62 20 50 20 Z"
        fill={creamColor}
        fillOpacity="0.7"
      />
      {/* Seed: #4C5D4B */}
      <circle
        cx="50"
        cy="60"
        r="12"
        fill={secondaryColor}
      />
      {/* Seed Subtle Highlight */}
      <circle
        cx="46"
        cy="56"
        r="3"
        fill={creamColor}
        fillOpacity="0.6"
      />
    </svg>
  );

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-2.5 cursor-pointer group ${className}`}
        role="button"
        tabIndex={0}
      >
        <AvocadoIcon size={28} />
        <div className="flex flex-col">
          <span
            className="font-bold tracking-[0.2em] text-base leading-none"
            style={{ color: primaryColor }}
          >
            AVOLAB
          </span>
          {showSubtitle && (
            <span
              className="text-[8px] uppercase tracking-[0.25em] font-semibold mt-0.5"
              style={{ color: secondaryColor }}
            >
              COSMETICS
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'authentication') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center group cursor-pointer ${className}`}
      >
        <div className="relative mb-3">
          <div className="absolute -inset-2 rounded-full bg-[#DDEAD2]/50 blur-sm group-hover:bg-[#DDEAD2]/80 transition-all duration-300"></div>
          <AvocadoIcon size={56} />
        </div>
        <h1
          className="text-3xl font-extrabold tracking-[0.22em] leading-tight"
          style={{ color: primaryColor }}
        >
          AVOLAB
        </h1>
        <p
          className="text-[11px] font-bold uppercase tracking-[0.35em] mt-1"
          style={{ color: secondaryColor }}
        >
          COSMETICS
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] font-medium mt-1" style={{ color: secondaryColor }}>
          Vegan Bio-Beauty
        </p>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-3 cursor-pointer group ${className}`}
      >
        <AvocadoIcon size={32} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className="font-bold tracking-[0.18em] text-lg leading-none"
              style={{ color: primaryColor }}
            >
              AVOLAB
            </span>
            <span className="text-[9px] bg-[#DDEAD2] text-[#4A5D4E] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">
              COSMETICS
            </span>
          </div>
          {showSubtitle && (
            <span
              className="text-[9px] uppercase tracking-[0.25em] font-semibold mt-0.5"
              style={{ color: secondaryColor }}
            >
              FLAGSHIP ECOSYSTEM
            </span>
          )}
        </div>
      </div>
    );
  }

  // Primary Default
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer group ${className}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <AvocadoIcon size={36} />
      <div className="flex flex-col">
        <span
          className="font-extrabold tracking-[0.2em] text-2xl leading-none transition-colors group-hover:opacity-90"
          style={{ color: primaryColor }}
        >
          AVOLAB
        </span>
        {showSubtitle && (
          <span
            className="text-[9px] uppercase tracking-[0.3em] font-bold mt-1"
            style={{ color: secondaryColor }}
          >
            COSMETICS
          </span>
        )}
      </div>
    </div>
  );
};
