import { HeroBanner } from "@/components/hero-banner";
import { CodePlayground } from "@/components/code-playground";
import { Documentation } from "@/components/documentation";

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroBanner />
      <CodePlayground />
      <Documentation />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground font-mono text-sm">
            <span className="code-keyword">yap</span>(
            <span className="code-string">
              &quot;Built with 💀 and way too much caffeine&quot;
            </span>
            )
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
