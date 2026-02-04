import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AgentCard, Agent } from '@/components/AgentCard';
import { analyzeImage, VoiceSummaryResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Upload, Link, X, Sparkles, Volume2, RotateCcw, Loader2 } from 'lucide-react';

const agents: Agent[] = [
  {
    id: '1',
    name: 'Nikhil Kamath',
    voiceId: 'S4FFDsQT9907lYyDfkNX',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2To4tvKMfW3yBtimgqxtSV1xy0SV69g7jruskkUno_zVwzp5zTsCsm5088SrGKS3zd-fslTvJYUHeVrS0SSWd75DM-NXVPBpFuUcgeA&s=10',
  },
  {
    id: '2',
    name: 'Sima Taparia',
    voiceId: 'QwYUcy13pNukAGEDPwZC',
    image: 'https://hips.hearstapps.com/hmg-prod/images/screen-shot-2020-07-13-at-12-04-57-pm-1594656687.png?crop=0.435xw:0.778xh;0.323xw,0.0608xh&resize=640:*',
  },
  {
    id: '3',
    name: 'Suniel Shetty',
    voiceId: 'iwD2ZElxUtPZlFNfGZqS',
    image: 'https://planify-main.s3.amazonaws.com/media/images/documents/Suniel_Shetty.webp',
  },
];

export function ImageAnalysis() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [response, setResponse] = useState<VoiceSummaryResponse | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Cache for reusing previous image
  const [cachedImage, setCachedImage] = useState<{ file?: File; url?: string } | null>(null);

  // Animated text effect
  useEffect(() => {
    if (response?.text) {
      let index = 0;
      setDisplayedText('');
      const interval = setInterval(() => {
        if (index < response.text.length) {
          setDisplayedText((prev) => prev + response.text[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [response]);

  // Auto-play audio
  useEffect(() => {
    if (response?.audio_url && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [response?.audio_url]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl('');
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setImageFile(null);
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImageUrl('');
    setImagePreview(null);
    setCachedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedAgent) {
      toast({
        title: 'Select an agent',
        description: 'Please select an AI agent first',
        variant: 'destructive',
      });
      return;
    }

    // Use cached image if no new image provided
    const currentImage = imageFile || cachedImage?.file;
    const currentUrl = imageUrl || cachedImage?.url;

    if (!currentImage && !currentUrl) {
      toast({
        title: 'No image provided',
        description: 'Please upload an image or provide a URL',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setResponse(null);

    try {
      const result = await analyzeImage(selectedAgent.voiceId, {
        image: currentImage,
        imageUrl: currentUrl,
        text: question,
      });

      setResponse(result);
      // Cache the image for reuse
      setCachedImage({ file: currentImage, url: currentUrl });

      toast({
        title: 'Analysis complete',
        description: 'Your AI analysis is ready',
      });
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  };

  if (!isOpen) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-elevated mb-6">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            AI Image Analysis
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Get intelligent insights from your images with our AI-powered analysis,
            delivered in the voice of your chosen celebrity agent.
          </p>
          <Button variant="gradient" size="lg" onClick={() => setIsOpen(true)}>
            <Sparkles className="w-5 h-5" />
            Start Analysis
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              AI Image Analysis
            </h2>
            <p className="text-muted-foreground mt-2">
              Select an agent, upload an image, and get AI-powered insights
            </p>
          </div>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Agent Selection */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Choose Your AI Agent
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgent?.id === agent.id}
                onSelect={() => setSelectedAgent(agent)}
              />
            ))}
          </div>
        </div>

        {/* Image Input */}
        {selectedAgent && (
          <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Provide an Image
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload */}
              <div className="space-y-3">
                <Label>Upload Image</Label>
                <div
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-3">
                <Label>Or Paste Image URL</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-6 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-xs rounded-xl border border-border"
                  onError={() => setImagePreview(null)}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full"
                  onClick={clearImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Question Input */}
            <div className="mt-6 space-y-3">
              <Label>Your Question (Optional)</Label>
              <Textarea
                placeholder="Ask something about this image..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
              />
            </div>

            {/* Analyze Button */}
            <div className="mt-6 flex gap-3">
              <Button
                variant="gradient"
                size="lg"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Image
                  </>
                )}
              </Button>
              {cachedImage && (
                <Button variant="outline" onClick={clearImage}>
                  Clear Image
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && selectedAgent && (
          <div className="glass-card rounded-2xl p-8 text-center animate-pulse-soft">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
              <img
                src={selectedAgent.image}
                alt={selectedAgent.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-lg font-medium text-foreground">
              {selectedAgent.name} is analyzing the image...
            </p>
            <p className="text-muted-foreground mt-2">
              Please wait while our AI processes your request
            </p>
          </div>
        )}

        {/* Response */}
        {response && !isAnalyzing && (
          <div className="glass-card-elevated rounded-2xl p-8 animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={selectedAgent?.image}
                  alt={selectedAgent?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  {selectedAgent?.name}
                </h4>
                <p className="text-sm text-muted-foreground">AI Analysis</p>
              </div>
            </div>

            {/* Animated Text */}
            <div className="bg-muted/50 rounded-xl p-6 mb-6">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {displayedText}
                {displayedText.length < (response.text?.length || 0) && (
                  <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" />
                )}
              </p>
            </div>

            {/* Audio Controls */}
            {response.audio_url && (
              <div className="flex items-center gap-4">
                <audio ref={audioRef} src={response.audio_url} controls className="flex-1" />
                <Button variant="outline" size="icon" onClick={replayAudio}>
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
