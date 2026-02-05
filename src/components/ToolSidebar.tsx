import { Button } from '@/components/ui/button';
import { Sparkles, Copy, Eraser, RotateCw, UserX, ChevronRight } from 'lucide-react';

export type ToolView = 'products' | 'image-analysis' | 'duplicate' | 'text-removal' | 'rotation' | 'face-blur';

interface ToolSidebarProps {
    activeView: ToolView;
    onSelect: (view: ToolView) => void;
}

export function ToolSidebar({ activeView, onSelect }: ToolSidebarProps) {
    const tools = [
        { id: 'image-analysis', label: 'Image Analysis', icon: Sparkles, color: 'text-purple-500' },
        { id: 'duplicate', label: 'Duplicate Detector', icon: Copy, color: 'text-blue-500' },
        { id: 'text-removal', label: 'Text Remover', icon: Eraser, color: 'text-pink-500' },
        { id: 'rotation', label: 'Image Rotator', icon: RotateCw, color: 'text-orange-500' },
        { id: 'face-blur', label: 'Face Blur', icon: UserX, color: 'text-red-500' },
    ] as const;

    return (
        <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-foreground px-2">Try our latest products</h3>
                <div className="space-y-2">
                    {tools.map((tool) => (
                        <Button
                            key={tool.id}
                            variant={activeView === tool.id ? 'secondary' : 'ghost'}
                            className={`w-full justify-start h-auto py-3 px-4 rounded-xl transition-all duration-300 group ${activeView === tool.id
                                ? 'bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20'
                                : 'hover:bg-gray-50 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => onSelect(tool.id as ToolView)}
                        >
                            <div className={`p-2 rounded-lg bg-white dark:bg-zinc-950 shadow-sm border border-gray-100 dark:border-zinc-800 mr-3 group-hover:scale-110 transition-transform ${tool.color}`}>
                                <tool.icon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-sm flex-1 text-left">{tool.label}</span>
                            {activeView === tool.id && (
                                <ChevronRight className="w-4 h-4 text-primary animate-in fade-in slide-in-from-left-2" />
                            )}
                        </Button>
                    ))}
                </div>
            </div>


        </div>
    );
}
