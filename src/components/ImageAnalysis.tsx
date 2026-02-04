import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AgentCard, Agent } from '@/components/AgentCard';
import { analyzeImage, VoiceSummaryResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Upload, Link, X, Sparkles, Volume2, RotateCcw, Loader2, Play, CheckCircle2, ChevronRight, User, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

const STEPS = [
  { id: 1, label: 'Select Agent', icon: User },
  { id: 2, label: 'Upload Image', icon: ImageIcon },
  { id: 3, label: 'Analyze', icon: Sparkles },
  { id: 4, label: 'Result', icon: MessageSquare },
];

export function ImageAnalysis() {
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedAgent) {
      toast({ title: "Select an agent", description: "Please choose an AI agent to proceed", variant: "destructive" });
      return;
    }
    if (currentStep === 2 && !imagePreview) {
      toast({ title: "Upload image", description: "Please upload an image to proceed", variant: "destructive" });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Analysis Logic
  const handleAnalyze = async () => {
    if (!selectedAgent || !imagePreview) return;

    setIsAnalyzing(true);
    setResponse(null);
    handleNextStep(); // Move to step 4 (Result/Loading)

    const currentImage = imageFile; // prioritize file
    const currentUrl = imageUrl;

    try {
      const result = await analyzeImage(selectedAgent.voiceId, {
        image: currentImage || undefined,
        imageUrl: currentUrl,
        text: question,
      });

      setResponse(result);
      toast({ title: 'Analysis complete', description: 'Your AI analysis is ready' });
    } catch (error) {
      toast({ title: 'Analysis failed', description: 'Something went wrong. Please try again.', variant: 'destructive' });
      setCurrentStep(3); // Go back to analyze step
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Text Animation
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

  // Audio Autoplay
  useEffect(() => {
    if (response?.audio_url && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [response?.audio_url]);

  // File Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl('');
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setImageFile(null);
    if (url) setImagePreview(url);
    else setImagePreview(null);
  };

  const clearImage = () => {
    setImageFile(null);
    setImageUrl('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="py-12 animate-fade-in" id="image-analysis">
      <div className="glass-panel p-8 rounded-3xl border border-white/20 dark:border-white/5 relative overflow-hidden">
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-white dark:to-purple-200">
            AI Image Intelligence
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Upload an image and get instant insights from our expert AI agents.
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="flex justify-between max-w-2xl mx-auto mb-12 relative z-10">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 relative group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'border-primary bg-primary text-white shadow-lg shadow-primary/25' :
                    isCompleted ? 'border-primary bg-primary/10 text-primary' : 'border-muted bg-background text-muted-foreground'
                  }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>

                {/* Connecting Line */}
                {index < STEPS.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-10 ${isCompleted ? 'bg-primary' : 'bg-muted'
                    }`} style={{ width: 'calc(100% * 3)' }} /> // Rough approximation for centered lines
                )}
                {/* Fix for lines: cleaner way usually implies absolute positioning between items, but grid is easier. Keeping simple for now */}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto min-h-[400px]">

          {/* Step 1: Select Agent */}
          {currentStep === 1 && (
            <div className="animate-slide-up space-y-6">
              <h3 className="text-xl font-semibold text-center mb-6">Choose Your Expert</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isSelected={selectedAgent?.id === agent.id}
                    onSelect={() => setSelectedAgent(agent)}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Button size="lg" onClick={handleNextStep} disabled={!selectedAgent} className="w-40">
                  Next Step <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Upload Image */}
          {currentStep === 2 && (
            <div className="animate-slide-up space-y-6">
              <h3 className="text-xl font-semibold text-center mb-6">Upload Image</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">Click to upload</h4>
                    <p className="text-sm text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or paste URL</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="https://..."
                      className="bg-transparent"
                      value={imageUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                    />
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-4 min-h-[300px] flex items-center justify-center bg-muted/20 border-dashed">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                      <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 rounded-full shadow-lg" onClick={clearImage}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Image preview will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-4 border-t border-border/50">
                <Button variant="ghost" onClick={handlePrevStep}>Back</Button>
                <Button size="lg" onClick={handleNextStep} disabled={!imagePreview} className="w-40">
                  Next Step <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Analyze */}
          {currentStep === 3 && (
            <div className="animate-slide-up max-w-2xl mx-auto text-center space-y-8">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-white shadow-xl">
                <img src={selectedAgent?.image} alt={selectedAgent?.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Ask {selectedAgent?.name}</h3>
                <p className="text-muted-foreground mt-2">What would you like to know about the image?</p>
              </div>

              <div className="relative">
                <Textarea
                  placeholder="e.g., Describe the main objects in this image..."
                  className="min-h-[120px] text-lg p-6 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-primary shadow-sm resize-none"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                  Optional
                </div>
              </div>

              <div className="flex justify-between items-center pt-8">
                <Button variant="ghost" onClick={handlePrevStep}>Back</Button>
                <Button size="lg" variant="gradient" onClick={handleAnalyze} className="min-w-[200px] h-14 text-lg shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Now
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {currentStep === 4 && (
            <div className="animate-slide-up">
              {/* Loading State */}
              {isAnalyzing && (
                <div className="text-center py-20">
                  <div className="relative inline-block w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold">Analyzing Image...</h3>
                  <p className="text-muted-foreground mt-2">Please wait while {selectedAgent?.name} processes your request.</p>
                </div>
              )}

              {/* Result State */}
              {response && !isAnalyzing && (
                <div className="glass-card-elevated rounded-3xl p-8 max-w-3xl mx-auto flex gap-6">
                  <div className="shrink-0 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 ring-4 ring-primary/5">
                      <img src={selectedAgent?.image} alt={selectedAgent?.name} className="w-full h-full object-cover" />
                    </div>
                    {response.audio_url && (
                      <Button size="icon" variant="outline" className="rounded-full w-12 h-12 hover:bg-primary hover:text-white transition-colors" onClick={() => audioRef.current?.play()}>
                        <RotateCcw className="w-5 h-5" />
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-lg">{selectedAgent?.name} says:</h4>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Analysis Complete</Badge>
                    </div>

                    <div className="bg-muted/30 rounded-2xl p-6 text-foreground/90 leading-relaxed relative group">
                      {displayedText}
                      <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse" />
                    </div>

                    {response.audio_url && (
                      <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <audio ref={audioRef} src={response.audio_url} controls className="flex-1 h-8 opacity-70 hover:opacity-100 transition-opacity" />
                      </div>
                    )}

                    <div className="pt-6 border-t border-border flex justify-end">
                      <Button variant="ghost" onClick={() => setCurrentStep(1)}>Start New Analysis</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
