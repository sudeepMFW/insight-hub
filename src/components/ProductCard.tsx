import { Product } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play, FileText, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onDescription: () => void;
  onDemo: () => void;
}

export function ProductCard({ product, onDescription, onDemo }: ProductCardProps) {
  const hasDemo = product.demo_videos && product.demo_videos.length > 0;
  const hasRedirect = !!product.redirect_url;

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all duration-300 group animate-slide-up">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl gradient-subtle-bg flex items-center justify-center shrink-0">
          <Layers className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {product.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
        {product.short_description || product.description}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onDescription}>
          <FileText className="w-4 h-4" />
          Description
        </Button>

        {hasDemo && (
          <Button variant="outline" size="sm" onClick={onDemo}>
            <Play className="w-4 h-4" />
            Demo
          </Button>
        )}

        {hasRedirect && (
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <a href={product.redirect_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Visit Site
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
