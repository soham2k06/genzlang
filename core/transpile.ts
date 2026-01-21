import { KEYWORD_MAP } from "./keywords";

export function transpile(source: string): string {
  let output = source;

  for (const [slang, js] of Object.entries(KEYWORD_MAP)) {
    const regex = new RegExp(`\\b${slang}\\b`, "g");
    output = output.replace(regex, js);
  }

  return output;
}
