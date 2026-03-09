import { useRoute } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { BlogCard } from "@/components/BlogCard";
import { useBlogsByCategory } from "@/hooks/use-blogs";

export default function Category() {
  const [, params] = useRoute("/category/:category");
  const category = params?.category || "";
  const { data: blogs, isLoading } = useBlogsByCategory(category);

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold capitalize mb-4">
            {category} <span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore our latest research and insights in the {category} sector.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-secondary animate-pulse" />
            ))}
          </div>
        ) : blogs?.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <h3 className="text-2xl font-bold mb-2">No articles found</h3>
            <p className="text-muted-foreground">We haven't published anything in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs?.map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} index={i} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
