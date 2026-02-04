import { Product } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Play, Box, X } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDemo?: () => void;
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  demo: { label: 'Demo', className: 'bg-blue-100 text-blue-700' },
  coming_soon: { label: 'Coming Soon', className: 'bg-amber-100 text-amber-700' },
};

export function ProductModal({ product, isOpen, onClose, onDemo }: ProductModalProps) {
  if (!product) return null;

  const status = statusConfig[product.status] || statusConfig.active;
  const hasDemo = product.demo_videos && product.demo_videos.length > 0;
  const hasRedirect = !!product.redirect_url;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-subtle-bg flex items-center justify-center shrink-0">
              {product.icon ? (
                <span className="text-3xl">{product.icon}</span>
              ) : (
                <Box className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
              <Badge variant="outline" className={`mt-2 ${status.className}`}>
                {status.label}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">About</h4>
          <p className="text-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Demo Videos Preview */}
        {hasDemo && (
          <div className="py-4 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Demo Videos</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {product.demo_videos?.length} video{product.demo_videos?.length !== 1 ? 's' : ''} available
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          {hasDemo && onDemo && (
            <Button variant="default" onClick={onDemo}>
              <Play className="w-4 h-4" />
              Watch Demo
            </Button>
          )}

          {hasRedirect && (
            <Button variant="outline" asChild>
              <a href={product.redirect_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Visit Site
              </a>
            </Button>
          )}

          <Button variant="ghost" onClick={onClose} className="ml-auto">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
