import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { BlogCard } from "@/components/BlogCard";
import { useSearchBlogs } from "@/hooks/use-blogs";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming we'll make a quick inline debounce

// Inline hook for debounce
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useState(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }); // Need effect
  return debouncedValue;
}

export default function Search() {
  const [query, setQuery] = useState("");
  // Simple inline debounce implementation to avoid missing dependencies
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  import("react").then(React => {
    React.useEffect(() => {
      const timer = setTimeout(() => setDebouncedQuery(query), 500);
      return () => clearTimeout(timer);
    }, [query]);
  });

  const { data: blogs, isLoading } = useSearchBlogs(debouncedQuery);

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h1 className="text-4xl font-display font-bold mb-8">Search the Archives</h1>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <SearchIcon className="h-6 w-6" />
            </div>
            <Input
              type="text"
              className="w-full pl-12 pr-4 py-6 text-lg rounded-2xl bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-lg"
              placeholder="Search for DeFi, NFTs, Market Analysis..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {debouncedQuery.length > 2 && (
          <div>
            <h2 className="text-xl font-medium mb-8 text-muted-foreground">
              Results for "<span className="text-foreground">{debouncedQuery}</span>"
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-96 rounded-2xl bg-secondary animate-pulse" />
                ))}
              </div>
            ) : blogs?.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">No matching articles found. Try another search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs?.map((blog, i) => (
                  <BlogCard key={blog.id} blog={blog} index={i} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
