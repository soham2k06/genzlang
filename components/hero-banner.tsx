import { Button } from "@/components/ui/button";
import { Code2, Github, Sparkles } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border mb-8">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">
            A programming language that hits different
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
          <span className="gradient-text">GenZLang</span>
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
          JavaScript, but make it{" "}
          <span className="text-primary font-semibold">bussin&apos;</span>.
          Write code that slaps with GenZ slang keywords.
        </p>

        <p className="text-lg text-muted-foreground/80 mb-12 font-mono">
          <span className="code-keyword">yap</span>(
          <span className="code-string">&quot;no cap, this is fr fr&quot;</span>
          )
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button variant="hero" size="xl" className="group" asChild>
            <a href="#playground">
              <Code2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Playground
            </a>
          </Button>
          <Button variant="heroOutline" size="xl" asChild>
            <a
              href="https://github.com/soham2k06/genzlang"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
              View Source
            </a>
          </Button>
        </div>

        {/* Made by */}
        <p className="text-sm text-muted-foreground">
          Made with 💀 by{" "}
          <a
            href="https://x.com/sohmmdev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            @Sohmmdev
          </a>
        </p>
      </div>
    </section>
  );
}
