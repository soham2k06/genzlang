"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Trash2, Terminal } from "lucide-react";
import { transpileGenZLang, transformError } from "@/lib/utils";
import { KEYWORD_MAP } from "@/core";

const SAMPLE_CODE = `// Welcome to GenZLang
// Start typing. Let it cook.

yap("GenZLang online fr")

rn count = 3

spam (count > 0) {
  yap("Looping...")
  yap(count)
  count = count - 1
}

pov (no_cap) {
  yap("All good. No cap.")
} sike {
  yap("This should never run.")
}
`;

interface OutputLine {
  type: "log" | "error" | "info";
  content: string;
}

export function CodePlayground() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const allKeywords = Object.keys(KEYWORD_MAP);

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const highlightSyntax = (code: string): string => {
    const result: string[] = [];
    let i = 0;

    while (i < code.length) {
      // Check for comments first
      if (code[i] === "/" && code[i + 1] === "/") {
        let end = i;
        while (end < code.length && code[end] !== "\n") end++;
        const comment = code.slice(i, end);
        result.push(`<span class="code-comment">${escapeHtml(comment)}</span>`);
        i = end;
        continue;
      }

      // Check for strings
      if (code[i] === '"' || code[i] === "'") {
        const quote = code[i];
        let end = i + 1;
        while (end < code.length && code[end] !== quote) {
          if (code[end] === "\\") end++; // Skip escaped chars
          end++;
        }
        end++; // Include closing quote
        const str = code.slice(i, end);
        result.push(`<span class="code-string">${escapeHtml(str)}</span>`);
        i = end;
        continue;
      }

      // Check for keywords and identifiers
      if (/[a-zA-Z_]/.test(code[i])) {
        let end = i;
        while (end < code.length && /[a-zA-Z0-9_]/.test(code[end])) end++;
        const word = code.slice(i, end);

        if (allKeywords.includes(word)) {
          result.push(`<span class="code-keyword">${escapeHtml(word)}</span>`);
        } else if (
          code[end] === "(" ||
          code.slice(end).match(/^\s*\(/) !== null
        ) {
          result.push(`<span class="code-function">${escapeHtml(word)}</span>`);
        } else {
          result.push(escapeHtml(word));
        }
        i = end;
        continue;
      }

      // Check for numbers
      if (/\d/.test(code[i])) {
        let end = i;
        while (end < code.length && /\d/.test(code[end])) end++;
        const num = code.slice(i, end);
        result.push(`<span class="text-accent">${escapeHtml(num)}</span>`);
        i = end;
        continue;
      }

      // Regular character
      result.push(escapeHtml(code[i]));
      i++;
    }

    return result.join("");
  };

  // Sync scroll between textarea and highlight overlay
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);

    // Get current word being typed
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = newCode.slice(0, cursorPos);
    const words = textBeforeCursor.split(/[\s\n\(\)\{\}\[\];,]/);
    const currentWord = words[words.length - 1].toLowerCase();

    if (currentWord.length > 0) {
      const matches = allKeywords.filter(
        (k) => k.toLowerCase().startsWith(currentWord) && k !== currentWord,
      );
      setSuggestions(matches.slice(0, 5));
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const insertSuggestion = (suggestion: string) => {
    if (!textareaRef.current) return;

    const cursorPos = textareaRef.current.selectionStart;
    const textBeforeCursor = code.slice(0, cursorPos);
    const textAfterCursor = code.slice(cursorPos);

    const words = textBeforeCursor.split(/[\s\n\(\)\{\}\[\];,]/);
    const currentWord = words[words.length - 1];
    const beforeWord = textBeforeCursor.slice(
      0,
      textBeforeCursor.length - currentWord.length,
    );

    const newCode = beforeWord + suggestion + textAfterCursor;
    setCode(newCode);
    setShowSuggestions(false);

    // Set cursor position after inserted word
    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = beforeWord.length + suggestion.length;
        textareaRef.current.selectionStart = newPos;
        textareaRef.current.selectionEnd = newPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const runCode = useCallback(() => {
    const newOutput: OutputLine[] = [];

    // Add info line
    newOutput.push({ type: "info", content: "> Letting it cook..." });

    // Transpile to JavaScript
    const jsCode = transpileGenZLang(code);

    // Create custom console
    const customConsole = {
      log: (...args: unknown[]) => {
        newOutput.push({
          type: "log",
          content: args.map((a) => String(a)).join(" "),
        });
      },
    };

    try {
      // Execute the transpiled code
      const fn = new Function("console", jsCode);
      fn(customConsole);
      newOutput.push({ type: "info", content: "> Ran without Ls ✓" });
    } catch (error) {
      const genZError = transformError(error as Error);
      newOutput.push({ type: "error", content: genZError });
    }

    setOutput(newOutput);

    // Scroll to bottom of output
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, 0);
  }, [code]);

  const clearOutput = () => {
    setOutput([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Run code on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
      return;
    }

    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        insertSuggestion(suggestions[0]);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    }

    // Handle tab for indentation
    if (e.key === "Tab" && !showSuggestions) {
      e.preventDefault();
      const start = textareaRef.current?.selectionStart || 0;
      const end = textareaRef.current?.selectionEnd || 0;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
      return;
    }

    // Auto-close brackets, parentheses, braces, and quotes
    const autoClosePairs: Record<string, string> = {
      "(": ")",
      "[": "]",
      "{": "}",
      '"': '"',
      "'": "'",
    };

    if (autoClosePairs[e.key]) {
      e.preventDefault();
      const start = textareaRef.current?.selectionStart || 0;
      const end = textareaRef.current?.selectionEnd || 0;
      const hasSelection = start !== end;

      if (hasSelection) {
        // Wrap selection with pair
        const selectedText = code.substring(start, end);
        const newCode =
          code.substring(0, start) +
          e.key +
          selectedText +
          autoClosePairs[e.key] +
          code.substring(end);
        setCode(newCode);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + 1;
            textareaRef.current.selectionEnd = end + 1;
          }
        }, 0);
      } else {
        // Insert pair and place cursor between them
        const newCode =
          code.substring(0, start) +
          e.key +
          autoClosePairs[e.key] +
          code.substring(end);
        setCode(newCode);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + 1;
            textareaRef.current.selectionEnd = start + 1;
          }
        }, 0);
      }
      return;
    }

    // Skip over closing bracket if it's already there
    const closingChars = [")", "]", "}", '"', "'"];
    if (closingChars.includes(e.key)) {
      const start = textareaRef.current?.selectionStart || 0;
      const nextChar = code[start];

      if (nextChar === e.key) {
        e.preventDefault();
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + 1;
            textareaRef.current.selectionEnd = start + 1;
          }
        }, 0);
        return;
      }
    }
  };

  return (
    <section id="playground" className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Playground</span>
        </h2>
        <p className="text-lg text-muted-foreground">
          Start cooking with GenZLang. No cap.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="terminal-window overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-terminal-header border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/80" />
              <div className="w-3 h-3 rounded-full bg-accent/80" />
              <div className="w-3 h-3 rounded-full bg-primary/80" />
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              main.genz
            </span>
            <div className="flex gap-2">
              <Button variant="terminal" size="sm" onClick={runCode}>
                <Play className="w-4 h-4" />
                Run
              </Button>
              <Button variant="terminal" size="sm" onClick={() => setCode("")}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="relative h-96 overflow-hidden">
            {/* Syntax highlighted overlay */}
            <pre
              ref={highlightRef}
              className="absolute inset-0 p-4 font-mono text-sm leading-relaxed pointer-events-none overflow-auto whitespace-pre-wrap wrap-break-word m-0"
              aria-hidden="true"
              dangerouslySetInnerHTML={{
                __html: highlightSyntax(code) + "\n",
              }}
            />

            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-foreground font-mono text-sm resize-none focus:outline-none leading-relaxed z-10"
              spellCheck={false}
              placeholder="// Start typing your GenZLang code..."
            />

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute z-20 bg-card border border-border rounded-lg shadow-xl overflow-hidden"
                style={{ top: "2rem", left: "1rem" }}
              >
                {suggestions.map((suggestion, i) => (
                  <button
                    key={suggestion}
                    onClick={() => insertSuggestion(suggestion)}
                    className={`block w-full px-4 py-2 text-left font-mono text-sm hover:bg-muted transition-colors ${
                      i === 0 ? "bg-muted/50" : ""
                    }`}
                  >
                    <span className="code-keyword">{suggestion}</span>
                    <span className="text-muted-foreground ml-3">
                      → {KEYWORD_MAP[suggestion]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Terminal Output */}
        <div className="terminal-window overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-terminal-header border-b border-border">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground font-mono">
                output
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearOutput}>
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>

          <div
            ref={outputRef}
            className="h-96 p-4 overflow-y-auto font-mono text-sm"
          >
            {output.length === 0 ? (
              <p className="text-muted-foreground">
                <span className="text-primary">$</span> Hit &quot;Run&quot; and
                let it cook.
              </p>
            ) : (
              output.map((line, i) => (
                <div
                  key={i}
                  className={`mb-1 ${
                    line.type === "error"
                      ? "text-destructive"
                      : line.type === "info"
                        ? "text-muted-foreground"
                        : "text-foreground"
                  }`}
                >
                  {line.type === "log" && (
                    <span className="text-primary mr-2">→</span>
                  )}
                  {line.content}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
