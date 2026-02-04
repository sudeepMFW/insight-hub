import { Product } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play, Layers, FileText, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDemo?: () => void;
}

export function ProductModal({ product, isOpen, onClose, onDemo }: ProductModalProps) {
  if (!product) return null;

  const hasDemo = product.demo_videos && product.demo_videos.length > 0;
  const hasRedirect = !!product.redirect_url;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-hidden p-0 gap-0 border-none bg-transparent shadow-none">
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl relative">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-primary/20 to-purple-600/20 relative">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full bg-black/10 hover:bg-black/20 text-foreground" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content Body */}
          <div className="px-8 pb-8 -mt-12 relative">
            {/* Icon */}
            <div className="w-24 h-24 rounded-3xl bg-background shadow-xl flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center">
                <Layers className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="flex items-start justify-between mb-8">
              <div>
                <DialogTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-white dark:to-purple-200">
                  {product.name}
                </DialogTitle>
                <p className="text-muted-foreground mt-2 text-lg">Enterprise Grade Solution</p>
              </div>
              <div className="flex gap-2">
                {hasRedirect && (
                  <Button variant="outline" asChild className="rounded-full">
                    <a href={product.redirect_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit
                    </a>
                  </Button>
                )}
                {hasDemo && onDemo && (
                  <Button className="rounded-full shadow-lg shadow-primary/20" onClick={onDemo}>
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Watch Demo
                  </Button>
                )}
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-muted/50 p-1 rounded-xl mb-6">
                <TabsTrigger value="overview" className="rounded-lg px-6">Overview</TabsTrigger>
                {hasDemo && <TabsTrigger value="media" className="rounded-lg px-6">Media & Demos</TabsTrigger>}
              </TabsList>

              <TabsContent value="overview" className="mt-0 animate-fade-in focus-visible:outline-none">
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  <p>{product.description}</p>

                  {/* Feature placeholders just to make it look populated if description is short */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-foreground mb-1">High Performance</h4>
                      <p className="text-xs">Optimized for speed and efficiency at scale.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <h4 className="font-semibold text-foreground mb-1">Secure by Design</h4>
                      <p className="text-xs">Enterprise-grade security standards built-in.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {hasDemo && (
                <TabsContent value="media" className="mt-0 animate-fade-in focus-visible:outline-none">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Available Demos</h4>
                    <div className="grid gap-3">
                      {product.demo_videos?.map((video, idx) => (
                        <div key={idx} className="flex items-center p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group" onClick={onDemo}>
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Play className="w-4 h-4 fill-current" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">Product Demo {idx + 1}</p>
                            <p className="text-xs text-muted-foreground">Video Walkthrough</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
