'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface Slide {
  title: string;
  subtitle: string;
  bg_image: string;
  cta_text?: string;
  cta_link?: string;
}

interface HeroSliderProps {
  slides: Slide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] overflow-hidden bg-slate-950">
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background image with overlay */}
            <div className="relative w-full h-full">
              <Image
                src={slide.bg_image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover scale-105 transition-transform duration-10000"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
            </div>

            {/* Slide Text Content */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl text-white space-y-5 animate-fadeIn">
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Portal Resmi Desa Khepong Jaya</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                    {slide.subtitle}
                  </p>
                  {slide.cta_text && slide.cta_link && (
                    <div className="pt-2">
                      <Link
                        href={slide.cta_link}
                        className="inline-flex items-center space-x-2.5 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-primary/30 transition-all hover:scale-105"
                      >
                        <span>{slide.cta_text}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === current ? 'w-8 bg-primary' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
