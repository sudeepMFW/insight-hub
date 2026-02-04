import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoModalProps {
  videos: string[];
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ videos, productName, isOpen, onClose }: VideoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!videos || videos.length === 0) return null;

  const currentVideo = videos[currentIndex];
  const hasMultiple = videos.length > 1;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black/95 border-none shadow-2xl rounded-3xl">
        <DialogTitle className="sr-only">{productName} Demo</DialogTitle>

        <div className="relative group">
          {/* Main Video Player */}
          <div className="relative aspect-video bg-black rounded-3xl overflow-hidden">
            <video
              ref={videoRef}
              key={currentVideo}
              src={currentVideo}
              autoPlay
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
            />

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold text-lg">{productName}</h3>
                  {hasMultiple && <p className="text-gray-300 text-sm">Video {currentIndex + 1} of {videos.length}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={togglePlay}>
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                  </Button>

                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full"
                    onClick={() => {
                      if (videoRef.current) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          videoRef.current.requestFullscreen();
                        }
                      }
                    }}
                  >
                    <Maximize className="w-6 h-6" />
                  </Button>
                </div>

                {/* Navigation Arrows (if multiple) */}
                {hasMultiple && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={goToPrevious} className="text-white hover:bg-white/20 rounded-full">
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={goToNext} className="text-white hover:bg-white/20 rounded-full">
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Center Play Button (when paused) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-current ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Playlist Strip */}
          {hasMultiple && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {videos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
