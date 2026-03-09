import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Search, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans dark">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Hexagon className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Block<span className="text-primary">Pulse</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/category/market" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Markets</Link>
            <Link href="/category/defi" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">DeFi</Link>
            <Link href="/category/nft" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">NFTs</Link>
            <Link href="/category/tech" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Technology</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/search")} className="text-muted-foreground hover:text-foreground">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="hidden sm:flex border-primary/20 hover:bg-primary/10 text-primary font-semibold" onClick={() => setLocation("/admin/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Hexagon className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-xl">BlockPulse</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-sm">
                Premium insights and analytics for the modern crypto professional. Stay ahead of the curve with our in-depth research and market analysis.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/category/market" className="hover:text-primary transition-colors">Market Analysis</Link></li>
                <li><Link href="/category/defi" className="hover:text-primary transition-colors">DeFi Deep Dives</Link></li>
                <li><Link href="/category/tech" className="hover:text-primary transition-colors">Tech Explainers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/admin" className="hover:text-primary transition-colors">Author Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} BlockPulse. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
