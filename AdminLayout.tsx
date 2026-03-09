import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";
import { useLogout } from "@/hooks/use-auth";
import { LayoutDashboard, FileText, Settings, LogOut, Hexagon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const logout = useLogout();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  if (!isAuthenticated()) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans dark selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card/50 backdrop-blur-xl border-r border-border md:min-h-screen flex flex-col">
        <div className="p-6 border-b border-border flex items-center space-x-2">
          <Hexagon className="w-6 h-6 text-primary" />
          <span className="font-sans font-bold text-lg">Admin Portal</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors group">
            <LayoutDashboard className="w-4 h-4 transition-colors" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/new" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors group">
            <PlusCircle className="w-4 h-4 transition-colors" />
            <span>New Post</span>
          </Link>
          <Link href="/" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors group">
            <FileText className="w-4 h-4 transition-colors" />
            <span>View Site</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
