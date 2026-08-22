import React from 'react';
import logoJpg from './logo.jpg';
import logoPng from './logo.png';

export const JNV_LOGO = logoJpg;
export const JNV_LOGO_PNG = logoPng;
export const JNV_LOGO_FALLBACK = '/logo.jpg';

// Helper error handler for img tags to ensure zero broken images
export const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (!target.dataset.triedFallback) {
    target.dataset.triedFallback = 'true';
    target.src = JNV_LOGO;
  } else if (target.src !== JNV_LOGO_FALLBACK) {
    target.src = JNV_LOGO_FALLBACK;
  }
};


