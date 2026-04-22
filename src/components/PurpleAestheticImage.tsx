import React from 'react';
import { motion } from 'motion/react';

interface PurpleAestheticImageProps {
  className?: string;
}

export default function PurpleAestheticImage({ className }: PurpleAestheticImageProps) {
  return (
    <div className={`relative overflow-hidden bg-[#0f0720] ${className}`}>
      {/* Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] via-[#2d1b4d] to-[#4c2b62]" />
      
      {/* Stars with flicker animation */}
      <div className="absolute inset-0">
        {[...Array(60)].map((_, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: Math.random() * 0.5 + 0.2 }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 1.5 + 0.5}px`,
              height: `${Math.random() * 1.5 + 0.5}px`,
            }}
          />
        ))}
      </div>

      {/* Moon with soft glow */}
      <div className="absolute top-[35%] left-[40%] -translate-x-1/2 w-40 h-40 bg-[#f3e8ff] rounded-full shadow-[0_0_100px_rgba(168,85,247,0.4)] opacity-95">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-100 to-purple-200 rounded-full" />
        <div className="absolute top-4 left-6 w-8 h-8 bg-black/5 rounded-full blur-md" />
        <div className="absolute bottom-8 right-12 w-12 h-12 bg-black/5 rounded-full blur-lg" />
      </div>

      {/* Tree Silhouette - stylized puff clouds/leaves */}
      <div className="absolute bottom-0 left-0 right-0 h-3/5 flex flex-col items-center justify-end">
        <div className="relative w-full h-full flex items-end justify-center pb-2">
          {/* Canopy */}
          <div className="absolute bottom-20 w-48 h-48 bg-[#0a0514] rounded-full blur-[2px]" />
          <div className="absolute bottom-28 -left-20 w-32 h-32 bg-[#0a0514] rounded-full blur-[1px]" />
          <div className="absolute bottom-32 -right-16 w-36 h-36 bg-[#0a0514] rounded-full blur-[1px]" />
          
          {/* Trunk */}
          <div className="w-6 h-32 bg-[#0a0514] rounded-t-full shadow-2xl z-10" />
        </div>
      </div>

      {/* Ground/Grass silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#05020a]" />
    </div>
  );
}
