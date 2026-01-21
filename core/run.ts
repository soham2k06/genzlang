import vm from "node:vm";
import { transpile } from "./transpile";
import { errorMap } from "./errorMap";

export function run(source: string): void {
  const jsCode = `
let __loopGuard = 0;
const __MAX_LOOPS = 10000;

${transpile(source).replace(
  /while\s*\(/g,
  "while (__loopGuard++ < __MAX_LOOPS && (",
)}`;

  try {
    vm.runInNewContext(jsCode, { console });
  } catch (err: unknown) {
    const error = err as Error;
    let message = error.message || "Unknown error";
    let matched = false;

    if (errorMap[error.name]) {
      const map = errorMap[error.name];

      for (const [pattern, replacement] of Object.entries(map)) {
        const regex = new RegExp(pattern, "i");

        if (regex.test(message)) {
          matched = true;

          if (replacement.includes("{var}")) {
            const varMatch = message.match(/^['"]?(\w+)['"]?\s/);

            if (varMatch) {
              message = replacement.replace("{var}", varMatch[1]);
            } else {
              message = replacement
                .replace("'{var}'", "that variable")
                .replace("{var}", "that variable");
            }
          } else if (replacement.includes("{token}")) {
            const tokenMatch = message.match(
              /Unexpected token ['"]?([^'"]+)['"]?/,
            );

            message = tokenMatch
              ? replacement.replace("{token}", tokenMatch[1])
              : replacement.replace("{token}", "unknown thing");
          } else {
            message = replacement;
          }

          break;
        }
      }
    }

    // Default fallback if nothing matched
    if (!matched) {
      message = "Oops! You cooked so hard that it broke. " + message;
    }

    throw new Error(message);
  }
}
