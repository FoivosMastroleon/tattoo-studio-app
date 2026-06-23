const HF_MODEL = 'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell';
const HF_TOKEN = import.meta.env.VITE_HF_API_TOKEN;

type GenerateRequest = {
  style: string;
  description: string;
};

export const generateConcept = async ({ style, description }: GenerateRequest): Promise<string> => {
  const prompt = `professional tattoo design, ${style} style, ${description}, bold outlines, tattoo flash art, black and grey ink, clean linework, high contrast, white background`;

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
