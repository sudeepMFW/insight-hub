import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageProcessResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { ToolView } from '@/components/ToolSidebar';

interface SingleImageToolProps {
    type: ToolView;
    title: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
    processFunction: (source: { file?: File; url?: string }) => Promise<ImageProcessResponse>;
    onBack?: () => void;
}

export function SingleImageTool({ type, title, description, icon: Icon, iconColor, processFunction, onBack }: SingleImageToolProps) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ImageProcessResponse | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImageUrl('');
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
            setResult(null); // Clear previous result on new upload
        }
    };

    const handleUrlChange = (url: string) => {
        setImageUrl(url);
        setImageFile(null);
        if (url) setImagePreview(url);
        else setImagePreview(null);
        setResult(null);
    };

    const handleProcess = async () => {
        if (!imageFile && !imageUrl) {
            toast({ title: "Missing input", description: "Please provide an image", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await processFunction({
                file: imageFile || undefined,
                url: imageUrl || undefined
            });
            setResult(response);
            toast({ title: 'Success', description: response.message });
        } catch (error) {
            toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const clearState = () => {
        setImageFile(null);
        setImageUrl('');
        setImagePreview(null);
        setResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="glass-panel p-8 rounded-3xl border border-white/20 dark:border-white/5 space-y-8 animate-fade-in text-left">
            <div>
                {onBack && (
                    <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 mb-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                )}
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                    {title}
                </h2>
                <p className="text-muted-foreground">{description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Input Section */}
                <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Input Image</h3>

                    {!imagePreview ? (
                        <div className="space-y-4">
                            <div
                                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-10 h-10 text-muted-foreground mb-4" />
                                <p className="text-sm font-medium">Click to upload image</p>
                                <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border"></span></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or URL</span></div>
                            </div>
                            <Input
                                placeholder="https://..."
                                value={imageUrl}
                                onChange={(e) => handleUrlChange(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30 aspect-square flex items-center justify-center group">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                            <Button
                                size="icon"
                                variant="destructive"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={clearState}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {imagePreview && !result && (
                        <Button
                            size="lg"
                            onClick={handleProcess}
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>Process Image</>
                            )}
                        </Button>
                    )}
                </div>

                {/* Result Section */}
                {result && (
                    <div className="space-y-4 animate-slide-up">
                        <h3 className="font-medium text-foreground">Result</h3>
                        <div className="rounded-xl overflow-hidden border border-border bg-muted/30 aspect-square flex items-center justify-center relative">
                            <img src={result.image_url} alt="Result" className="w-full h-full object-contain" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs text-center">
                                {result.message}
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" onClick={clearState}>Process Another</Button>
                    </div>
                )}

                {/* Placeholder for result when not yet processed but layout balance */}
                {!result && imagePreview && (
                    <div className="hidden lg:flex items-center justify-center aspect-square rounded-xl border border-dashed border-muted">
                        <p className="text-muted-foreground text-sm">Result will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
