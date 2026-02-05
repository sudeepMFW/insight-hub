import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoModalProps {
  videos: { title: string; video_url: string }[];
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`p-0 overflow-hidden bg-black/95 border-none shadow-2xl rounded-3xl ${hasMultiple ? 'max-w-[90vw] h-[80vh]' : 'max-w-4xl'}`}>
        <DialogTitle className="sr-only">{productName} Demo</DialogTitle>

        <div className={`flex h-full ${hasMultiple ? 'flex-row' : 'flex-col'}`}>
          {/* Main Video Area */}
          <div className={`relative bg-black flex items-center justify-center ${hasMultiple ? 'w-3/4' : 'w-full aspect-video'}`}>
            <video
              ref={videoRef}
              key={currentVideo.video_url}
              src={currentVideo.video_url}
              autoPlay
              className="w-full h-full object-contain"
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
            />

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-white font-semibold text-lg">{currentVideo.title}</h3>
                {!hasMultiple && (
                  <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full">
                    <X className="w-6 h-6" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={togglePlay}>
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => videoRef.current?.requestFullscreen()}>
                  <Maximize className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Center Play Button */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-current ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Playlist */}
          {hasMultiple && (
            <div className="w-1/4 border-l border-white/10 bg-zinc-950 flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h4 className="font-semibold text-white">Up Next</h4>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="overflow-y-auto flex-1 p-2 space-y-2">
                {videos.map((video, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex gap-3 group ${currentIndex === idx ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                  >
                    <div className="relative w-24 h-16 bg-black rounded-lg overflow-hidden shrink-0 border border-white/10">
                      {/* Thumbnail placeholder if we don't have real thumbnails, or use video frame */}
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                        <Play className="w-4 h-4 text-white/50" />
                      </div>
                      {currentIndex === idx && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="w-1 h-3 bg-primary animate-pulse mx-[1px]" />
                          <div className="w-1 h-4 bg-primary animate-pulse mx-[1px] delay-75" />
                          <div className="w-1 h-2 bg-primary animate-pulse mx-[1px] delay-150" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className={`text-sm font-medium truncate ${currentIndex === idx ? 'text-primary' : 'text-gray-200 group-hover:text-white'}`}>
                        {video.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Video {idx + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
