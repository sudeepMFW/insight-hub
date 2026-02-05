import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AgentCard, Agent } from '@/components/AgentCard';
import { analyzeImage, VoiceSummaryResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Sparkles, Volume2, RotateCcw, CheckCircle2, ChevronRight, User, Image as ImageIcon, MessageSquare, Send, Loader2, ArrowLeft, Trash2 } from 'lucide-react';
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

const LOADING_MESSAGES = [
  "Analyzing image composition...",
  "Identifying key elements...",
  "Running facial recognition...",
  "Checking object dimensions...",
  "Synthesizing insights...",
  "Almost there..."
];

interface ImageAnalysisProps {
  onBack?: () => void;
}

export function ImageAnalysis({ onBack }: ImageAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [question, setQuestion] = useState('');

  // Chat State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', text: string, audio?: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null); // For scrolling
  const { toast } = useToast();

  // Scroll to bottom of chat
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isAnalyzing]);

  // Loading Message Cycle & Auto-play Audio
  useEffect(() => {
    if (isAnalyzing) {
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[i]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  // Audio effect to play last assistant message automatically
  useEffect(() => {
    const lastMsg = chatHistory[chatHistory.length - 1];
    if (lastMsg && lastMsg.role === 'assistant' && lastMsg.audio && audioRef.current) {
      audioRef.current.src = lastMsg.audio;
      audioRef.current.play().catch(e => console.error("Audio playback error:", e));
    }
  }, [chatHistory]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl('');
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setCurrentStep(3); // Auto advance to Analyze step if agent selected
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setImageFile(null);
    if (url) {
      setImagePreview(url);
      setCurrentStep(3);
    } else {
      setImagePreview(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedAgent || !imagePreview) return;
    if (!question.trim()) {
      toast({ title: "Question required", description: "Please ask a question about the image", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(4); // Show Result UI

    // Add user question to chat if it's a follow up
    if (chatHistory.length > 0) {
      setChatHistory(prev => [...prev, { role: 'user', text: question }]);
    }

    try {
      const result = await analyzeImage(selectedAgent.voiceId, {
        image: imageFile || undefined,
        imageUrl: imageUrl,
        text: question,
      });

      setChatHistory(prev => {
        const newHistory = [...prev];
        if (prev.length === 0) {
          newHistory.push({ role: 'user', text: question });
        }

        newHistory.push({
          role: 'assistant',
          text: result.text,
          audio: result.audio_url
        });

        return newHistory;
      });

      setQuestion(''); // Clear input
      toast({ title: 'Success', description: 'Analysis complete' });
    } catch (error) {
      toast({ title: 'Error', description: 'Analysis failed. Please try again.', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedAgent(null);
    setImageFile(null);
    setImageUrl('');
    setImagePreview(null);
    setQuestion('');
    setChatHistory([]);
    setCurrentStep(1);
    setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-white/20 dark:border-white/5 min-h-[600px] flex flex-col lg:flex-row gap-8 animate-fade-in relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

      {/* Header Actions */}
      <div className="absolute top-6 left-6 z-20 flex gap-2">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack} className="bg-background/80 backdrop-blur-md">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        )}
        {imagePreview && (
          <Button variant="outline" size="sm" onClick={handleReset} className="bg-background/80 backdrop-blur-md text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" /> Clear
          </Button>
        )}
      </div>

      {/* Left Column: Image Preview (Persistent) */}
      <div className={`flex-1 lg:max-w-[40%] flex flex-col transition-all duration-500 mt-12 lg:mt-0 ${!imagePreview ? 'hidden lg:flex' : 'flex'}`}>
        <div className="bg-muted/30 rounded-2xl border border-white/10 dark:border-white/5 overflow-hidden relative flex-1 min-h-[300px] flex items-center justify-center group h-full">
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-black/60 hover:bg-black/70 text-white backdrop-blur-md border-none">
                  Analyzing
                </Badge>
              </div>
            </>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-10 h-10 opacity-50" />
              </div>
              <p className="font-medium">No Image Selected</p>
              <p className="text-sm mt-1">Please upload an image to start</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Interaction Steps */}
      <div className="flex-1 flex flex-col relative z-10 w-full">
        {/* Step 1: Select Agent */}
        {currentStep === 1 && (
          <div className="animate-slide-up flex-1 flex flex-col">
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-2xl font-bold">Select an Expert</h2>
              <p className="text-muted-foreground">Who should check this image?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgent?.id === agent.id}
                  onSelect={() => {
                    setSelectedAgent(agent);
                    setCurrentStep(2); // Auto advance
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Upload Image */}
        {currentStep === 2 && (
          <div className="animate-slide-up flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Upload Media</h2>
                <p className="text-muted-foreground">Select an image to analyze</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>Change Expert</Button>
            </div>

            <div className="space-y-4 flex-1">
              <div
                className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-foreground">Click to upload</h4>
                <p className="text-sm text-muted-foreground mt-1">Supports JPG, PNG (max 10MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground uppercase">OR</span>
                <Input
                  placeholder="Paste Image URL..."
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Initial Question */}
        {currentStep === 3 && (
          <div className="animate-slide-up flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Ask {selectedAgent?.name}</h2>
                <p className="text-muted-foreground">What do you want to know?</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>Change Image</Button>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <Textarea
                placeholder={`e.g., "Is this image real or deepfake?", "Describe the scene"`}
                className="flex-1 min-h-[150px] text-lg p-4 bg-muted/30 border-2 focus:border-primary/50 resize-none rounded-xl"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <Button size="lg" className="w-full text-lg h-12" onClick={handleAnalyze} disabled={!question.trim()}>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Image
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Chat Interface */}
        {currentStep === 4 && (
          <div className="animate-slide-up flex-1 flex flex-col h-[600px] max-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                  <img src={selectedAgent?.image} alt={selectedAgent?.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold leading-tight">{selectedAgent?.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-muted-foreground">AI Active</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>
                New Analysis
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-muted">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto rounded-tr-none'
                    : 'bg-muted/50 text-foreground rounded-tl-none border border-white/10'
                    }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    {msg.audio && (
                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-background/20 hover:bg-background/40" onClick={() => {
                          if (audioRef.current) {
                            audioRef.current.src = msg.audio!;
                            audioRef.current.play();
                          }
                        }}>
                          <Volume2 className="w-4 h-4" />
                        </Button>
                        <span className="text-xs opacity-70">Voice Response</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAnalyzing && (
                <div className="flex gap-3">
                  <div className="max-w-[70%] bg-muted/30 rounded-2xl rounded-tl-none p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="animate-pulse">{loadingMessage}</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="relative mt-auto">
              <Textarea
                placeholder="Ask a follow-up question..."
                className="pr-12 min-h-[50px] max-h-[150px] bg-muted/30 border-white/10 focus:border-primary/30 resize-none py-3"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAnalyze();
                  }
                }}
              />
              <Button
                size="icon"
                className="absolute right-2 bottom-2 rounded-xl transition-all hover:scale-105"
                disabled={!question.trim() || isAnalyzing}
                onClick={handleAnalyze}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <audio ref={audioRef} className="hidden" />
          </div>
        )}
      </div>
    </div>
  );
}

