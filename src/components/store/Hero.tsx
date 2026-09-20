"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconArrowRight, IconArrowLeft, IconPlay, IconPause } from "./Icons";

interface Props {
  title: string;
  subtitle?: string;
  mediaUrls: string[];
  interval?: number;
  ctaHref?: string;
}

export function Hero({ title, subtitle, mediaUrls, interval = 5, ctaHref = "/categorie/caftans" }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || mediaUrls.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaUrls.length);
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [isPlaying, mediaUrls.length, interval]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaUrls.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length);
  };

  if (!mediaUrls || mediaUrls.length === 0) return null;

  return (
    <section className="relative overflow-hidden group">
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        {mediaUrls.map((url, idx) => {
          const isVideo = url.startsWith("data:video/") || !!url.match(/\.(mp4|mov|webm)$/i);
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {isVideo ? (
                <video
                  src={url}
                  className="w-full h-full object-cover"
                  autoPlay={idx === currentIndex}
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={url}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white z-30">
          {subtitle && (
            <p className="mb-3 text-xs uppercase tracking-[0.4em] md:text-sm">
              {subtitle}
            </p>
          )}
          <h1 className="font-serif text-4xl font-bold uppercase tracking-tight md:text-6xl lg:text-7xl drop-shadow-md">
            {title}
          </h1>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-smooth hover:bg-black hover:text-white"
          >
            Shop Now <IconArrowRight size={16} />
          </Link>
        </div>

        {/* Controls */}
        {mediaUrls.length > 1 && (
          <>
            {/* Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/50 opacity-0 group-hover:opacity-100 md:left-8"
              aria-label="Précédent"
            >
              <IconArrowLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/50 opacity-0 group-hover:opacity-100 md:right-8"
              aria-label="Suivant"
            >
              <IconArrowRight size={24} />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-6 right-6 z-40 rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/50 md:bottom-8 md:right-8"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <IconPause size={20} /> : <IconPlay size={20} />}
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
              {mediaUrls.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                  }`}
                  aria-label={`Aller à la diapositive ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}