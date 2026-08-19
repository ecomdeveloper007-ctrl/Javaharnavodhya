import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Layers,
  GraduationCap,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  HeartHandshake,
  Shield,
  Edit3
} from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { BannerSlide } from '../../types';

export const HeroBannerSlider: React.FC<{
  className?: string;
  autoPlayInterval?: number;
}> = ({ className = '', autoPlayInterval = 5500 }) => {
  const { bannerSlides, setActiveTab, setActiveAlumniSubTab, setIsRegisterModalOpen, user } = useData();
  const { isHindi } = useLanguage();

  // Filter active slides, fallback to all if none marked active
  const activeSlides = bannerSlides.filter(s => s.isActive !== false);
  const slides: BannerSlide[] = activeSlides.length > 0 ? activeSlides : bannerSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Safe navigation helpers
  const totalSlides = slides.length;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % totalSlides);
    setProgress(0);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  };

  const handleGoTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
  };

  // Autoplay and progress tracking
  useEffect(() => {
    if (!isPlaying || totalSlides <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    setProgress(0);
    const stepTime = 100;
    const stepInc = (stepTime / autoPlayInterval) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 0;
        return p + stepInc;
      });
    }, stepTime);

    timerRef.current = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPlaying, totalSlides, autoPlayInterval]);

  if (totalSlides === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  // Route CTA click appropriately
  const handleCtaClick = (link?: string) => {
    if (!link) return;
    const cleanLink = link.toLowerCase().trim();

    if (cleanLink.startsWith('http://') || cleanLink.startsWith('https://')) {
      window.open(cleanLink, '_blank', 'noopener,noreferrer');
      return;
    }

    if (cleanLink === 'register' || cleanLink === 'registration') {
      setIsRegisterModalOpen(true);
      return;
    }

    if (
      cleanLink === 'directory' ||
      cleanLink === 'batches' ||
      cleanLink === 'jobs' ||
      cleanLink === 'memories' ||
      cleanLink === 'welfare' ||
      cleanLink === 'elections'
    ) {
      setActiveTab('alumni');
      setActiveAlumniSubTab(cleanLink);
      return;
    }

    // Default to main app tabs
    setActiveTab(cleanLink);
  };

  // Helper icon for category badge
  const getBadgeIcon = (badge?: string) => {
    const b = (badge || '').toLowerCase();
    if (b.includes('admission') || b.includes('प्रवेश')) return BookOpen;
    if (b.includes('alumni') || b.includes('पूर्व छात्र')) return GraduationCap;
    if (b.includes('event') || b.includes('reunion') || b.includes('समारोह')) return Calendar;
    if (b.includes('welfare') || b.includes('कल्याण') || b.includes('giving')) return HeartHandshake;
    return Sparkles;
  };

  const BadgeIcon = getBadgeIcon(currentSlide.badgeText);

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.7 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  const title = (isHindi && currentSlide.titleHindi) ? currentSlide.titleHindi : currentSlide.title;
  const subtitle = (isHindi && currentSlide.subtitleHindi) ? currentSlide.subtitleHindi : currentSlide.subtitle;
  const badgeText = (isHindi && currentSlide.badgeTextHindi) ? currentSlide.badgeTextHindi : currentSlide.badgeText;
  const ctaText = (isHindi && currentSlide.ctaTextHindi) ? currentSlide.ctaTextHindi : (currentSlide.ctaText || 'Learn More');
  const secondaryCtaText = (isHindi && currentSlide.secondaryCtaTextHindi) ? currentSlide.secondaryCtaTextHindi : currentSlide.secondaryCtaText;

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-950 text-white select-none ${className}`}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      id="hero-banner-slider-container"
    >
      {/* Slider Viewport Container */}
      <div className="relative w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] xl:min-h-[560px] flex items-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide.id || currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Fallback & Ken Burns zoom effect */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <ImageWithFallback
                src={currentSlide.imageUrl}
                alt={title}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 ease-out"
              />
              {/* Dynamic Gradient Overlays for High Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent lg:w-3/4" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30" />
              <div className="absolute inset-0 bg-radial from-transparent via-slate-950/20 to-slate-950/60" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-12 sm:py-16">
              <div className="max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-5">
                
                {/* Category / Badge Pill */}
                {badgeText && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-semibold shadow-lg shadow-amber-500/10"
                  >
                    <BadgeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                    <span>{badgeText}</span>
                  </motion.div>
                )}

                {/* Main Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md"
                >
                  {title}
                </motion.h1>

                {/* Subtitle / Description */}
                {subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed drop-shadow-sm max-w-2xl font-normal"
                  >
                    {subtitle}
                  </motion.p>
                )}

                {/* Action CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="flex flex-wrap items-center gap-3 pt-2"
                >
                  {currentSlide.ctaLink && (
                    <button
                      onClick={() => handleCtaClick(currentSlide.ctaLink)}
                      className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2 cursor-pointer"
                      id={`hero-slide-cta-btn-${currentIndex}`}
                    >
                      <span>{ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {currentSlide.secondaryCtaLink && secondaryCtaText && (
                    <button
                      onClick={() => handleCtaClick(currentSlide.secondaryCtaLink)}
                      className="px-4.5 py-2.5 sm:px-5 sm:py-3 bg-slate-900/80 hover:bg-slate-800 text-slate-100 hover:text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700/80 backdrop-blur-md transition-all flex items-center space-x-2 cursor-pointer shadow-lg"
                      id={`hero-slide-secondary-cta-btn-${currentIndex}`}
                    >
                      <span>{secondaryCtaText}</span>
                    </button>
                  )}

                  {/* Admin Quick Edit Shortcut */}
                  {user?.isAdmin && (
                    <button
                      onClick={() => setActiveTab('admin')}
                      className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-semibold rounded-lg border border-amber-500/30 transition flex items-center space-x-1.5 cursor-pointer backdrop-blur-md"
                      title="Manage slider banners in Admin Portal"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit Banners</span>
                    </button>
                  )}
                </motion.div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous Navigation Arrow */}
        {totalSlides > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white hover:text-amber-400 border border-slate-700/70 backdrop-blur-md transition-all flex items-center justify-center cursor-pointer shadow-xl hover:scale-105 active:scale-95 group"
            id="hero-slider-prev-btn"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Next Navigation Arrow */}
        {totalSlides > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white hover:text-amber-400 border border-slate-700/70 backdrop-blur-md transition-all flex items-center justify-center cursor-pointer shadow-xl hover:scale-105 active:scale-95 group"
            id="hero-slider-next-btn"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Bottom Bar: Slide Progress, Dot Indicators & Controls */}
      {totalSlides > 1 && (
        <div className="relative z-20 bg-slate-950/90 border-t border-slate-800/80 px-4 sm:px-8 py-3">
          {/* Real-time Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left: Slide Index Indicators */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {slides.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={slide.id || idx}
                    onClick={() => handleGoTo(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full flex items-center cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 font-bold px-3 py-1 text-xs shadow-md shadow-amber-400/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 px-2 py-1 text-[11px] border border-slate-700/50'
                    }`}
                  >
                    <span className="font-mono">{`0${idx + 1}`}</span>
                    {isActive && (
                      <span className="ml-1.5 hidden md:inline max-w-[120px] truncate text-[10px] font-semibold">
                        {(isHindi && slide.badgeTextHindi) ? slide.badgeTextHindi : (slide.badgeText || `Slide ${idx + 1}`)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Slide Counter & Play/Pause Toggle */}
            <div className="flex items-center space-x-3">
              <div className="text-xs font-mono text-slate-400 hidden sm:inline">
                <span className="text-amber-400 font-bold">{`0${currentIndex + 1}`}</span>
                <span className="text-slate-600 mx-1">/</span>
                <span>{`0${totalSlides}`}</span>
              </div>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
                title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
