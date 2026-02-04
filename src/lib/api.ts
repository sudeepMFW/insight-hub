const BASE_URL = 'https://enterprise-mediafirewall-ai.millionvisions.ai';

export interface Product {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  icon?: string;
  category: 'active' | 'demo' | 'coming_soon';
  demo_videos?: string[];
  redirect_url?: string | null;
  order: number;
}

export interface ProductsResponse {
  total: number;
  products: Product[];
}

export interface VoiceSummaryResponse {
  request_id: string;
  text: string;
  audio_url: string;
  status: 'success' | 'error';
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data: ProductsResponse = await response.json();
  return data.products.sort((a: Product, b: Product) => a.order - b.order);
}

export async function analyzeImage(
  voiceId: string,
  options: {
    image?: File;
    imageUrl?: string;
    text?: string;
  }
): Promise<VoiceSummaryResponse> {
  const formData = new FormData();
  formData.append('voice_id', voiceId);
  
  if (options.image) {
    formData.append('image', options.image);
  }
  if (options.imageUrl) {
    formData.append('image_url', options.imageUrl);
  }
  if (options.text) {
    formData.append('text', options.text);
  }

  const response = await fetch(`${BASE_URL}/ai/voice-summary`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze image');
  }

  return response.json();
}
