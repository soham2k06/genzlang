import { errorMap, KEYWORD_MAP } from "@/core";
import { ArrowRight, Skull, Sparkles } from "lucide-react";

export function Documentation() {
  return (
    <section id="docs" className="py-20 px-4 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">The Translation Guide</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know to start vibing with GenZLang
          </p>
        </div>

        {/* Keywords Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="size-6" />
            </span>
            Keywords
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(KEYWORD_MAP).map(([genZ, js]) => (
              <div
                key={genZ}
                className="terminal-window p-4 grid grid-cols-3 items-center justify-between hover:border-primary/30 transition-colors group"
              >
                <code className="code-keyword font-semibold text-lg">
                  {genZ}
                </code>
                <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto group-hover:text-primary transition-colors" />
                <code className="text-muted-foreground font-mono ml-auto">
                  {js}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Error Messages Section */}
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="p-2 rounded-lg bg-destructive/20 flex items-center justify-center text-destructive">
              <Skull className="size-6" />
            </span>
            Error Messages (They Hit Different)
          </h3>

          <div className="space-y-6">
            {Object.entries(errorMap).map(([errorType, messages]) => (
              <div key={errorType} className="terminal-window overflow-hidden">
                <div className="px-4 py-3 bg-terminal-header border-b border-border">
                  <h4
                    className={`font-mono font-semibold ${
                      errorType === "Warning"
                        ? "text-accent"
                        : "text-destructive"
                    }`}
                  >
                    {errorType}
                  </h4>
                </div>
                <div className="p-4 space-y-3">
                  {Object.entries(messages).map(([trigger, message]) => (
                    <div key={trigger} className="flex flex-col gap-1">
                      <code className="text-xs text-muted-foreground font-mono">
                        When: &quot;
                        {trigger.replace(
                          /(?<=cannot access\s)['"]?.+?['"]?(?=\s+before initialization)/,
                          "",
                        )}
                        &quot;
                      </code>
                      <p className="text-foreground pl-4 border-l-2 border-primary/30">
                        {message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example Section */}
        <div className="mt-16 terminal-window p-6">
          <h3 className="text-xl font-bold mb-4 text-primary">Quick Example</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2 font-mono">
                GenZLang:
              </p>
              <pre className="bg-background/50 p-4 rounded-lg overflow-x-auto">
                <code>
                  <span className="code-keyword">cook</span>{" "}
                  <span className="code-function">sayHello</span>(name) {"{"}
                  {"\n"} <span className="code-keyword">fr</span> greeting ={" "}
                  <span className="code-string">&quot;Yo, &quot;</span>
                  {"\n"} <span className="code-keyword">yap</span>(greeting +
                  name)
                  {"\n"} <span className="code-keyword">bet</span>{" "}
                  <span className="code-keyword">no_cap</span>
                  {"\n"}
                  {"}"}
                </code>
              </pre>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2 font-mono">
                JavaScript:
              </p>
              <pre className="bg-background/50 p-4 rounded-lg overflow-x-auto">
                <code>
                  <span className="code-keyword">function</span>{" "}
                  <span className="code-function">sayHello</span>(name) {"{"}
                  {"\n"} <span className="code-keyword">const</span> greeting ={" "}
                  <span className="code-string">&quot;Yo, &quot;</span>
                  {"\n"} <span className="code-keyword">console.log</span>
                  (greeting + name)
                  {"\n"} <span className="code-keyword">return</span>{" "}
                  <span className="code-keyword">true</span>
                  {"\n"}
                  {"}"}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
