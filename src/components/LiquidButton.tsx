import React from 'react';

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'liquid' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  asAnchor?: boolean;
  href?: string;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  variant = 'liquid',
  size = 'md',
  children,
  icon,
  asAnchor = false,
  href,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }[size];

  const baseClasses =
    'relative group inline-flex items-center justify-center gap-2 font-medium tracking-wide whitespace-nowrap shrink-0 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0d10] cursor-pointer rounded-full overflow-hidden';

  if (variant === 'liquid') {
    const liquidClasses = `
      ${baseClasses}
      ${sizeClasses}
      text-neutral-950 font-semibold
      bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500
      shadow-[0_4px_24px_rgba(245,158,11,0.28)]
      hover:shadow-[0_6px_32px_rgba(245,158,11,0.45)]
      hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]
      ${className}
    `;

    const content = (
      <>
        {/* Liquid metallic sheen layer */}
        <span
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none"
          aria-hidden="true"
        />
        {/* Subtle radial inner glow */}
        <span
          className="absolute inset-0 rounded-full opacity-60 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_70%)] pointer-events-none"
          aria-hidden="true"
        />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        {icon && <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
      </>
    );

    if (asAnchor && href) {
      return (
        <a href={href} className={liquidClasses}>
          {content}
        </a>
      );
    }

    return (
      <button className={liquidClasses} {...props}>
        {content}
      </button>
    );
  }

  // Ghost / Outline fallback variants
  const outlineClasses = `
    ${baseClasses}
    ${sizeClasses}
    text-neutral-200 bg-transparent
    border border-white/20 hover:border-amber-400/80 hover:text-amber-300
    hover:bg-white/5 active:scale-[0.99]
    ${className}
  `;

  const ghostClasses = `
    ${baseClasses}
    ${sizeClasses}
    text-neutral-300 hover:text-white hover:bg-white/5
    ${className}
  `;

  const finalClasses = variant === 'outline' ? outlineClasses : ghostClasses;

  if (asAnchor && href) {
    return (
      <a href={href} className={finalClasses}>
        <span className="flex items-center gap-2">{children}</span>
        {icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
      </a>
    );
  }

  return (
    <button className={finalClasses} {...props}>
      <span className="flex items-center gap-2">{children}</span>
      {icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
    </button>
  );
};
