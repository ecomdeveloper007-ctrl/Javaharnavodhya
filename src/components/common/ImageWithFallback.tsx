import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, User, School, Award, Calendar } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackType?: 'avatar' | 'campus' | 'topper' | 'event' | 'default';
  className?: string;
  aspectRatio?: string;
  animate?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackType = 'default',
  className = '',
  aspectRatio,
  animate = true,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Curated reliable high-quality institutional placeholders
  const getFallbackPlaceholder = () => {
    switch (fallbackType) {
      case 'avatar':
        return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=faces&q=80';
      case 'campus':
        return 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=500&fit=crop&q=80';
      case 'topper':
        return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&q=80';
      case 'event':
        return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop&q=80';
      default:
        return 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop&q=80';
    }
  };

  const getFallbackIcon = () => {
    switch (fallbackType) {
      case 'avatar':
        return <User className="w-8 h-8 text-slate-400" />;
      case 'campus':
        return <School className="w-8 h-8 text-slate-400" />;
      case 'topper':
        return <Award className="w-8 h-8 text-slate-400" />;
      case 'event':
        return <Calendar className="w-8 h-8 text-slate-400" />;
      default:
        return <ImageIcon className="w-8 h-8 text-slate-400" />;
    }
  };

  const imageSrc = error ? getFallbackPlaceholder() : src || getFallbackPlaceholder();

  const ContainerComponent = animate ? motion.div : 'div';

  return (
    <ContainerComponent
      className={`relative overflow-hidden bg-slate-100 ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      {...(animate ? { whileHover: { scale: 1.02 }, transition: { duration: 0.25 } } : {})}
    >
      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <div className="opacity-40">{getFallbackIcon()}</div>
        </div>
      )}

      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (!error) {
            setError(true);
            setLoading(false);
          }
        }}
        referrerPolicy="no-referrer"
        {...props}
      />
    </ContainerComponent>
  );
};
