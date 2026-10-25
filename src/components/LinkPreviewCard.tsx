import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface LinkPreviewCardProps {
  href: string;
  title: string;
  description: string;
  image?: string;
  tag?: string;
  children: React.ReactNode;
}

export const LinkPreviewCard: React.FC<LinkPreviewCardProps> = ({
  href,
  title,
  description,
  image,
  tag,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        to={href}
        className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/40 underline-offset-4 hover:decoration-amber-400 transition-colors inline-flex items-center gap-0.5 font-medium"
      >
        <span>{children}</span>
        <ArrowUpRight className="w-3 h-3 opacity-70" />
      </Link>

      {/* Floating Hover Card */}
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#131720]/95 border border-white/15 rounded-xl shadow-2xl backdrop-blur-md z-40 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
          {image && (
            <div className="aspect-[16/9] rounded-lg overflow-hidden mb-2 border border-white/10">
              <img src={image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          {tag && (
            <span className="text-[9px] font-mono uppercase text-amber-400 tracking-wider block mb-0.5">
              {tag}
            </span>
          )}
          <h4 className="text-xs font-serif text-white font-medium line-clamp-1">{title}</h4>
          <p className="text-[10px] text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </span>
  );
};
