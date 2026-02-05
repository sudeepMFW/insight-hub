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
  const hasDescription = !!(product.description || (product.description_sections && product.description_sections.length > 0));

  // Determine default tab
  const defaultTab = hasDescription ? 'overview' : (hasDemo ? 'media' : undefined);

  if (!defaultTab) return null; // Or render just header? Assuming at least one exists usually.

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] p-0 gap-0 border border-gray-100 bg-white shadow-2xl rounded-2xl dark:bg-zinc-950 dark:border-zinc-800 overflow-hidden flex flex-col">
        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Header Banner */}
          <div className="h-32 bg-primary/5 relative">
            {/* Custom Close Removed - using default DialogClose which is now sticky relative to fixed parent */}
          </div>

          {/* Content Body */}
          <div className="px-8 pb-8 -mt-12 relative flex flex-col">
            {/* Icon */}
            <div className="w-24 h-24 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center mb-6 z-10">
              <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                <Layers className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="flex items-start justify-between mb-8">
              <div>
                <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                  {product.name}
                </DialogTitle>
                <p className="text-gray-500 mt-2 text-lg">Enterprise Grade Solution</p>
              </div>
              <div className="flex gap-2 pt-2">
                {hasRedirect && (
                  <Button variant="outline" asChild className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary">
                    <a href={product.redirect_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit
                    </a>
                  </Button>
                )}
                {hasDemo && onDemo && (
                  <Button className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20" onClick={onDemo}>
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Watch Demo
                  </Button>
                )}
              </div>
            </div>

            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="w-full justify-start h-12 bg-gray-100/50 p-1 rounded-xl mb-6 dark:bg-zinc-800/50">
                {hasDescription && (
                  <TabsTrigger
                    value="overview"
                    className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    Overview
                  </TabsTrigger>
                )}
                {hasDemo && (
                  <TabsTrigger
                    value="media"
                    className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    Media & Demos
                  </TabsTrigger>
                )}
              </TabsList>

              {hasDescription && (
                <TabsContent value="overview" className="mt-0 animate-fade-in focus-visible:outline-none">
                  <div className="space-y-8 pb-8">
                    {product.description_sections?.map((section, index) => {
                      switch (section.type) {
                        case 'hero':
                          return (
                            <div key={index} className="rounded-2xl bg-primary/5 p-8 border border-primary/10">
                              {section.title && <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">{section.title}</h3>}
                              {section.subtitle && <p className="text-lg font-medium text-primary mb-4">{section.subtitle}</p>}
                              {section.content && <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{section.content}</p>}
                            </div>
                          );
                        case 'paragraph':
                          return (
                            <div key={index} className="prose prose-sm dark:prose-invert max-w-none">
                              {section.title && <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-3">{section.title}</h4>}
                              {section.content && <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">{section.content}</p>}
                            </div>
                          );
                        case 'bullets':
                          return (
                            <div key={index}>
                              {section.title && <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">{section.title}</h4>}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {section.items?.map((item, idx) => (
                                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        case 'highlight':
                          return (
                            <div key={index} className="rounded-2xl border-l-4 border-primary bg-gray-50 p-8 text-center dark:bg-zinc-900">
                              {section.content && <p className="text-xl md:text-2xl font-medium italic leading-relaxed text-gray-800 dark:text-gray-200">"{section.content}"</p>}
                              {section.title && <p className="mt-4 font-semibold text-primary">— {section.title}</p>}
                            </div>
                          );
                        case 'tagline':
                          return (
                            <div key={index} className="text-center py-6 border-t border-gray-100 mt-8 dark:border-zinc-800">
                              <p className="text-2xl md:text-3xl font-bold text-primary">
                                {section.content || section.title}
                              </p>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}

                    {/* Fallback */}
                    {(!product.description_sections || product.description_sections.length === 0) && product.description && (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p>{product.description}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}

              {hasDemo && (
                <TabsContent value="media" className="mt-0 animate-fade-in focus-visible:outline-none">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-50">Available Demos</h4>
                    <div className="grid gap-3">
                      {product.demo_videos?.map((video, idx) => (
                        <div key={idx} className="flex items-center p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer group dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800" onClick={onDemo}>
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Play className="w-4 h-4 fill-current" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-gray-50">Product Demo {idx + 1}</p>
                            <p className="text-xs text-gray-500">Video Walkthrough</p>
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
