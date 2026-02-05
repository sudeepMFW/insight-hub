// Product interface imported from api
import { Product } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CSSProperties } from 'react';

interface ProductCardProps {
  product: Product;
  onDescription: () => void;
  onDemo: () => void;
  gradientStyle?: CSSProperties;
}

export function ProductCard({ product, onDescription, onDemo, gradientStyle }: ProductCardProps) {
  const hasDemo = product.demo_videos && product.demo_videos.length > 0;
  const hasRedirect = !!product.redirect_url;
  const hasDescription = (product.description && product.description.trim().length > 0) || (product.description_sections && product.description_sections.length > 0);

  return (
    <div
      className="group relative rounded-2xl p-[1px] transition-all duration-500 overflow-hidden"
      style={gradientStyle}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative h-full glass-card rounded-2xl p-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-elevated flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {hasDemo && (
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Demo Available
              </Badge>
            )}
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed flex-1">
          {product.short_description || product.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
          {hasDescription && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDescription}
              className="flex-1 hover:bg-primary/5 hover:text-primary transition-colors"
            >
              Description
            </Button>
          )}

          {hasDemo ? (
            <Button
              size="sm"
              onClick={onDemo}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
            >
              <Play className="w-3.5 h-3.5 mr-2 fill-current" />
              Play Demo
            </Button>
          ) : hasRedirect ? (
            <Button
              size="sm"
              asChild
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
            >
              <a href={product.redirect_url} target="_blank" rel="noopener noreferrer">
                Visit <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </a>
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
