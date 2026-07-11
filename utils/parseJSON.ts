
export function safeParseJSON<T>(raw: string, fallback: T): T {
  if (!raw) return fallback;

  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;

  const objMatch = candidate.match(/\{[\s\S]*\}/);
  const arrMatch = candidate.match(/\[[\s\S]*\]/);
  const jsonText = objMatch ? objMatch[0] : arrMatch ? arrMatch[0] : candidate;

  try {
    return JSON.parse(jsonText.trim()) as T;
  } catch {
    return fallback;
  }
}
