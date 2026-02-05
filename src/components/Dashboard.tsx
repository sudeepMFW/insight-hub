import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Product, removeText, rotateImage, blurFace } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { VideoModal } from '@/components/VideoModal';
import { ProductSkeleton } from '@/components/ProductSkeleton';
import { ImageAnalysis } from '@/components/ImageAnalysis';
import { Button } from '@/components/ui/button';
import { LogOut, Package, AlertCircle, RefreshCw, Eraser, RotateCw, UserX } from 'lucide-react';
import { ToolSidebar, ToolView } from '@/components/ToolSidebar';
import { DuplicateTest } from '@/components/tools/DuplicateTest';
import { SingleImageTool } from '@/components/tools/SingleImageTool';

export function Dashboard() {
  const { data: products, isLoading, error, refetch } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeView, setActiveView] = useState<ToolView>('products');

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

  const renderMainContent = () => {
    switch (activeView) {
      case 'image-analysis':
        return <ImageAnalysis onBack={() => setActiveView('products')} />;
      case 'duplicate':
        return <DuplicateTest onBack={() => setActiveView('products')} />;
      case 'text-removal':
        return (
          <SingleImageTool
            onBack={() => setActiveView('products')}
            type="text-removal"
            title="Text Remover"
            description="Remove unwanted text from your images intelligently."
            icon={Eraser}
            iconColor="text-pink-500"
            processFunction={(source) => removeText(source, 'mask')}
          />
        );
      case 'rotation':
        return (
          <SingleImageTool
            onBack={() => setActiveView('products')}
            type="rotation"
            title="Image Rotator"
            description="Automatically correct image orientation."
            icon={RotateCw}
            iconColor="text-orange-500"
            processFunction={rotateImage}
          />
        );
      case 'face-blur':
        return (
          <SingleImageTool
            onBack={() => setActiveView('products')}
            type="face-blur"
            title="Face Blur"
            description="Automatically detect and blur faces for privacy."
            icon={UserX}
            iconColor="text-red-500"
            processFunction={blurFace}
          />
        );
      case 'products':
      default:
        // Existing Product Grid Logic
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Product Dashboard</h1>
              <p className="text-muted-foreground mt-2">Explore our products and services</p>
            </div>

            {error && (
              <div className="glass-card rounded-2xl p-8 text-center mb-8">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load products</h3>
                <p className="text-muted-foreground mb-4">{error.message || 'Something went wrong'}</p>
                <Button variant="outline" onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4" /> Try Again
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            )}

            {products && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {products.map((product, index) => {
                  // Dynamic Gradient Logic: Darker Purple to Light Blue
                  // Total products count for interpolation
                  const total = products.length;

                  // We want to interpolate between Deep Purple (e.g., Hue 270, L 20%) and Light Blue (e.g., Hue 200)

                  const startHue = 270; // Purple
                  const endHue = 190;   // Light Blue

                  const step = (startHue - endHue) / (total - 1 || 1);
                  const currentHue = startHue - (step * index);

                  // Darker start: Lower lightness (e.g. 30-40%) and higher opacity
                  const gradientStyle = {
                    backgroundImage: `linear-gradient(135deg, hsla(${currentHue}, 80%, 30%, 0.4), hsla(${currentHue - 20}, 80%, 40%, 0.2))`
                  };

                  return (
                    <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <ProductCard
                        product={product}
                        onDescription={() => handleDescription(product)}
                        onDemo={() => handleDemo(product)}
                        gradientStyle={gradientStyle}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {products && products.length === 0 && (
              <div className="glass-card rounded-2xl p-12 text-center mb-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No products yet</h3>
                <p className="text-muted-foreground">Products will appear here once they're added</p>
              </div>
            )}

            {/* Keeping ImageAnalysis below accessible if user scrolls down? 
                The user asked to make "Image Analysis" a feature in "Try our latest products". 
                So it makes sense to move it fully to its own view, accessible via sidebar. 
                I will remove it from the bottom of the dashboard home view. 
                Wait, user said "Image analysis(we are currently having)". 
                Implies it should be one of the options. I will remove the <ImageAnalysis /> at the bottom 
                and rely on the sidebar to nav to it. */}
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8 animate-fade-in">
      {/* Main Content Area - Span 9 */}
      <div className="col-span-12 lg:col-span-9 min-h-[80vh]">
        {renderMainContent()}
      </div>

      {/* Right Sidebar - Span 3 */}
      <div className="col-span-12 lg:col-span-3 space-y-8">
        <ToolSidebar activeView={activeView} onSelect={setActiveView} />
      </div>

      {/* Modals are global to dashboard */}
      {/* Modals are global to dashboard */}
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
