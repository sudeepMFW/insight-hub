import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { checkDuplicate, DuplicateResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Upload, Link, X, Copy, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ArrowLeft, Trash2 } from 'lucide-react';

interface DuplicateTestProps {
    onBack?: () => void;
}

export function DuplicateTest({ onBack }: DuplicateTestProps) {
    const [inputImage, setInputImage] = useState<File | null>(null);
    const [inputUrl, setInputUrl] = useState('');
    const [inputPreview, setInputPreview] = useState<string | null>(null);

    const [testImage, setTestImage] = useState<File | null>(null);
    const [testUrl, setTestUrl] = useState('');
    const [testPreview, setTestPreview] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<DuplicateResponse | null>(null);

    const inputFileRef = useRef<HTMLInputElement>(null);
    const testFileRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    // ... existing handlers ...
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFile: (f: File | null) => void,
        setUrl: (s: string) => void,
        setPreview: (s: string | null) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            setUrl('');
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (
        url: string,
        setFile: (f: File | null) => void,
        setUrl: (s: string) => void,
        setPreview: (s: string | null) => void
    ) => {
        setUrl(url);
        setFile(null);
        if (url) setPreview(url);
        else setPreview(null);
    };

    const handleAnalyze = async () => {
        if ((!inputImage && !inputUrl) || (!testImage && !testUrl)) {
            toast({ title: "Missing inputs", description: "Please provide both Source and Test images", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await checkDuplicate(
                { file: inputImage || undefined, url: inputUrl || undefined },
                { file: testImage || undefined, url: testUrl || undefined }
            );
            setResult(response);
            toast({ title: 'Analysis complete', description: 'Duplicate check finished' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to check duplicates', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const clearAll = () => {
        setInputImage(null); setInputUrl(''); setInputPreview(null);
        setTestImage(null); setTestUrl(''); setTestPreview(null);
        setResult(null);
        if (inputFileRef.current) inputFileRef.current.value = '';
        if (testFileRef.current) testFileRef.current.value = '';
    };

    const renderUploadSection = (
        title: string,
        image: File | null,
        url: string,
        preview: string | null,
        fileRef: React.RefObject<HTMLInputElement>,
        setFile: (f: File | null) => void,
        setUrl: (s: string) => void,
        setPreview: (s: string | null) => void
    ) => (
        <div className="space-y-4">
            <h3 className="font-medium text-foreground">{title}</h3>
            {!preview ? (
                <div className="space-y-4">
                    <div
                        className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                        onClick={() => fileRef.current?.click()}
                    >
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, setFile, setUrl, setPreview)}
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-xs text-muted-foreground uppercase whitespace-nowrap">Or URL</span>
                        <Input
                            placeholder="https://..."
                            value={url}
                            onChange={(e) => handleUrlChange(e.target.value, setFile, setUrl, setPreview)}
                            className="h-9"
                        />
                    </div>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30 aspect-video flex items-center justify-center group">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                            setFile(null);
                            setUrl('');
                            setPreview(null);
                            if (fileRef.current) fileRef.current.value = '';
                        }}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <div className="glass-panel p-8 rounded-3xl border border-white/20 dark:border-white/5 space-y-8 animate-fade-in text-left relative">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        {onBack && (
                            <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 mb-2 text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="w-4 h-4 mr-1" /> Back
                            </Button>
                        )}
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            <Copy className="w-6 h-6 text-blue-500" />
                            Duplicate Image Detector
                        </h2>
                        <p className="text-muted-foreground">Compare two images to check if they are duplicates.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Clear All
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderUploadSection(
                    "Source Image",
                    inputImage,
                    inputUrl,
                    inputPreview,
                    inputFileRef,
                    setInputImage,
                    setInputUrl,
                    setInputPreview
                )}
                {renderUploadSection(
                    "Test Image",
                    testImage,
                    testUrl,
                    testPreview,
                    testFileRef,
                    setTestImage,
                    setTestUrl,
                    setTestPreview
                )}
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={isLoading || (!inputPreview || !testPreview)}
                    className="min-w-[150px] bg-blue-600 hover:bg-blue-700"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Checking...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Check Duplicates
                        </>
                    )}
                </Button>
            </div>

            {result && (
                <div className="mt-8 p-6 rounded-2xl bg-muted/30 border border-border text-center animate-slide-up">
                    <h3 className="text-lg font-semibold mb-2">Result</h3>
                    <p className={`text-xl font-medium ${result.status_code === 1 ? 'text-green-600' : 'text-orange-600'}`}>
                        {result.message}
                    </p>
                </div>
            )}
        </div>
    );
}
