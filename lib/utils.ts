import { errorMap, KEYWORD_MAP } from "@/core";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformError(error: Error): string {
  const errorType = error.constructor.name as keyof typeof errorMap;
  const errorMessages = errorMap[errorType];

  if (!errorMessages) {
    return `Oof! ${error.message}`;
  }

  for (const [pattern, genZMessage] of Object.entries(errorMessages)) {
    if (error.message.includes(pattern)) {
      // Extract variable name if present
      const varMatch = error.message.match(/['"]?(\w+)['"]?/);
      const varName = varMatch ? varMatch[1] : "something";
      return genZMessage.replace(/\{var\}|\{token\}/g, varName);
    }
  }

  return `Oof! ${error.message}`;
}

export function transpileGenZLang(code: string): string {
  // Sort keywords by length (longest first) to avoid partial replacements
  const sortedKeywords = Object.entries(KEYWORD_MAP).sort(
    ([a], [b]) => b.length - a.length,
  );

  // Regex to match:
  // 1. Double/single/backtick strings
  // 2. Single-line comments
  // 3. Multi-line comments
  // 4. Words
  const regex =
    /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`|\/\/[^\n]*|\/\*[\s\S]*?\*\/)|\b(\w+)\b/g;

  return code.replace(regex, (match, strOrComment, word) => {
    // If it's a string literal or a comment, leave as is
    if (strOrComment) return strOrComment;

    // Otherwise, replace the word if it's in the map
    if (word) {
      const replacement = sortedKeywords.find(([genZ]) => genZ === word);
      if (replacement) return replacement[1];
    }

    return match;
  });
}
