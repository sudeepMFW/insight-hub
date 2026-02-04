import { Product } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Play, FileText, Box } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onDescription: () => void;
  onDemo: () => void;
}

const categoryConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-200' },
  demo: { label: 'Demo', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  coming_soon: { label: 'Coming Soon', className: 'bg-amber-100 text-amber-700 border-amber-200' },
};

export function ProductCard({ product, onDescription, onDemo }: ProductCardProps) {
  const category = categoryConfig[product.category] || categoryConfig.active;
  const hasDemo = product.demo_videos && product.demo_videos.length > 0;
  const hasRedirect = !!product.redirect_url;

  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all duration-300 group animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-subtle-bg flex items-center justify-center">
            {product.icon ? (
              <span className="text-2xl">{product.icon}</span>
            ) : (
              <Box className="w-6 h-6 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <Badge variant="outline" className={`text-xs mt-1 ${category.className}`}>
              {category.label}
            </Badge>
          </div>
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
