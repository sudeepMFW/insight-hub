const BASE_URL = 'https://enterprise-mediafirewall-ai.millionvisions.ai';

export interface DescriptionSection {
  type: 'hero' | 'paragraph' | 'bullets' | 'highlight' | 'tagline';
  title?: string;
  subtitle?: string;
  content?: string;
  items?: string[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  description_sections?: DescriptionSection[];
  short_description?: string;
  icon?: string;
  category: 'active' | 'demo' | 'coming_soon';
  demo_videos?: { title: string; video_url: string }[];
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

export interface DuplicateResponse {
  status_code: number;
  message: string;
}

export interface ImageProcessResponse {
  message: string;
  image_url: string;
}

// 1. Duplicate Test
export async function checkDuplicate(
  input: { file?: File; url?: string },
  test: { file?: File; url?: string }
): Promise<DuplicateResponse> {
  const formData = new FormData();

  if (input.file) formData.append('input_file', input.file);
  else if (input.url) formData.append('input_url', input.url);

  if (test.file) formData.append('test_file', test.file);
  else if (test.url) formData.append('test_url', test.url);

  const response = await fetch(`${BASE_URL}/duplicate/test`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to check duplicates');
  return response.json();
}

// 2. Remove Text
export async function removeText(
  source: { file?: File; url?: string },
  mode: 'mask' | 'crop' = 'mask'
): Promise<ImageProcessResponse> {
  const formData = new FormData();
  if (source.file) formData.append('file', source.file);
  else if (source.url) formData.append('url', source.url);
  formData.append('mode', mode);

  const response = await fetch(`${BASE_URL}/text/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to remove text');
  return response.json();
}

// 3. Rotate Image
export async function rotateImage(
  source: { file?: File; url?: string }
): Promise<ImageProcessResponse> {
  const formData = new FormData();
  if (source.file) formData.append('file', source.file);
  else if (source.url) formData.append('url', source.url);

  const response = await fetch(`${BASE_URL}/rotation/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to rotate image');
  return response.json();
}

// 4. Blur Face
export async function blurFace(
  source: { file?: File; url?: string }
): Promise<ImageProcessResponse> {
  const formData = new FormData();
  if (source.file) formData.append('file', source.file);
  else if (source.url) formData.append('url', source.url);

  const response = await fetch(`${BASE_URL}/face-blur/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to blur faces');
  return response.json();
}
