"use client";

import React, { useMemo } from 'react';
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "@/styles/plyr-custom.css";

interface PremiumVideoPlayerProps {
  url: string; // This should be the YouTube URL or ID
  title: string;
  onEnded?: () => void;
}

export function PremiumVideoPlayer({ url, title, onEnded }: PremiumVideoPlayerProps) {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<Plyr | null>(null);

  // Extract YouTube ID if full URL is passed
  const videoId = useMemo(() => {
    if (!url) return "";
    if (url.includes('embed/')) return url.split('embed/')[1]?.split('?')[0];
    if (url.includes('v=')) return url.split('v=')[1]?.split('&')[0];
    return url;
  }, [url]);

  React.useEffect(() => {
    if (!videoRef.current || !videoId) return;

    // Manual initialization of Plyr with direct target
    const player = new Plyr(videoRef.current, {
      controls: [
        'play-large', 'play', 'progress', 'current-time', 
        'mute', 'volume', 'captions', 'settings', 'fullscreen'
      ],
      settings: ['captions', 'quality', 'speed'],
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        origin: window.location.origin,
      }
    });

    player.on('ended', () => {
      if (onEnded) onEnded();
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, onEnded]);

  if (!videoId) return <div className="aspect-video bg-black rounded-2xl animate-pulse" />;

  return (
    <div 
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-outline_variant/10 group"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="plyr-container h-full">
        {/* Using data attributes is the most stable way for Plyr to identify the source */}
        <div 
            ref={videoRef} 
            data-plyr-provider="youtube" 
            data-plyr-embed-id={videoId}
        />
      </div>
      
      {/* PRECISION INTERACTION SHIELDS */}
      
      {/* Top Bar Shield: Blocks Title and Share button clicks */}
      {/* Reduced height to ensure it doesn't touch the center-play button */}
      <div className="absolute top-0 left-0 w-full h-12 z-20 cursor-default" 
           onContextMenu={(e) => e.preventDefault()}
           onClick={(e) => e.stopPropagation()}
      />

      {/* Bottom Right Shield: Blocks YouTube Logo area */}
      {/* Positioned precisely above the control bar area */}
      <div className="absolute bottom-12 right-0 w-32 h-10 z-20 cursor-default" 
           onContextMenu={(e) => e.preventDefault()}
           onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
