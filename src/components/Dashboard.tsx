import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { VideoModal } from '@/components/VideoModal';
import { ProductSkeleton } from '@/components/ProductSkeleton';
import { ImageAnalysis } from '@/components/ImageAnalysis';
import { Button } from '@/components/ui/button';
import { LogOut, Package, AlertCircle, RefreshCw } from 'lucide-react';

export function Dashboard() {
  const { data: products, isLoading, error, refetch } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleDescription = (product: Product) => {
    setSelectedProduct(product);
    setIsDescriptionOpen(true);
  };

  const handleDemo = (product: Product) => {
    setSelectedProduct(product);
    setIsVideoOpen(true);
  };

  const openDemoFromDescription = () => {
    setIsDescriptionOpen(false);
    setIsVideoOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Product Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Explore our products and services
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="glass-card rounded-2xl p-8 text-center mb-8">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Failed to load products
          </h3>
          <p className="text-muted-foreground mb-4">
            {error.message || 'Something went wrong'}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Products Grid */}
      {products && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard
                product={product}
                onDescription={() => handleDescription(product)}
                onDemo={() => handleDemo(product)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {products && products.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center mb-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No products yet
          </h3>
          <p className="text-muted-foreground">
            Products will appear here once they're added
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-border/50 my-12" />

      {/* AI Image Analysis Section */}
      <ImageAnalysis />

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        isOpen={isDescriptionOpen}
        onClose={() => setIsDescriptionOpen(false)}
        onDemo={openDemoFromDescription}
      />

      <VideoModal
        videos={selectedProduct?.demo_videos || []}
        productName={selectedProduct?.name || ''}
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </div>
  );
}
