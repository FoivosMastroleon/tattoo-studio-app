const HF_MODEL = 'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell';
const HF_TOKEN = import.meta.env.VITE_HF_API_TOKEN;

const STYLE_HINTS: Record<string, string> = {
  japanese:      'sumi-e ink technique, dynamic composition, wind bars, complementary background elements, traditional Japanese irezumi, bold outlines, koi fish, dragons, waves, cherry blossoms, ukiyo-e',
  traditional:   'American traditional tattoo, bold black outlines, limited color palette, classic flash art',
  blackwork:     'blackwork tattoo, solid black ink, bold fills, no color, high contrast',
  geometric:     'ruler-precise linework, compass-drawn circles, perfect symmetry, architectural accuracy, geometric tattoo, precise lines, sacred geometry, mandala, symmetrical patterns, dotwork',
  watercolor:    'watercolor tattoo, flowing paint splashes, soft edges, vibrant colors, no outlines',
  realistic:      'hyperrealism, fine shading, gradient grayscale tones, skin texture, photographic quality, photorealistic tattoo, detailed shading, high detail, portrait style, lifelike',
  neotraditional:'neo-traditional tattoo, bold outlines, vibrant colors, art nouveau influence, detailed',
  minimalist:    'minimalist fine line tattoo, single needle, thin lines, simple elegant, small',
  tribal:        'tribal tattoo, bold geometric patterns, solid black, traditional tribal motifs',
  dotwork:       'hand-poked aesthetic, gradient through density, no solid fills, intricate micro-dots,dotwork tattoo, stippling technique, dots shading, intricate dot patterns',
  cartoon:       'cartoon tattoo, bold black outlines, flat cel-shaded colors, comic book panel style, exaggerated proportions, fun illustration, pop art influence, clean vector-like linework, playful design',
}

function getStyleDescriptor(style: string): string {
  const lower = style.toLowerCase().replace(/[\s-]/g, '')
  const match = Object.keys(STYLE_HINTS).find(k => lower.includes(k))
  return match ? STYLE_HINTS[match] : `${style} tattoo style`
}

type GenerateRequest = {
  style: string;
  description: string;
};

export const generateConcept = async ({ style, description }: GenerateRequest): Promise<string> => {
  const styleDescriptor = getStyleDescriptor(style)
  const prompt = `${description}, ${styleDescriptor}, professional tattoo design, bold outlines, tattoo flash art, white background, high detail`;

  const res = await fetch(HF_MODEL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { num_inference_steps: 20 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${res.status}: ${detail}`);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
};
