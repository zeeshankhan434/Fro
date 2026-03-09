import { useRoute, Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useBlogBySlug } from "@/hooks/use-blogs";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  const { data: blog, isLoading } = useBlogBySlug(slug);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-20 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-16 w-full mb-6" />
          <Skeleton className="h-96 w-full rounded-2xl mb-12" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!blog) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you are looking for does not exist or has been removed.</p>
          <Link href="/" className="text-primary hover:underline">Return Home</Link>
        </div>
      </PublicLayout>
    );
  }

  const cleanHtml = DOMPurify.sanitize(blog.content);

  return (
    <PublicLayout>
      <article className="pb-24">
        {/* Header Section */}
        <header className="relative pt-20 pb-12 overflow-hidden bg-card/20 border-b border-border">
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-24 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to articles
            </Link>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
                <Tag className="w-3 h-3 mr-2" />
                {blog.category}
              </span>
              <span className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(blog.createdAt!), "MMMM d, yyyy")}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-foreground">
              {blog.title}
            </h1>
            
            {blog.metaDescription && (
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                {blog.metaDescription}
              </p>
            )}
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mt-12">
          {blog.featuredImage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/5"
            >
              <img 
                src={blog.featuredImage} 
                alt={blog.title} 
                className="w-full h-auto max-h-[600px] object-cover"
              />
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row gap-12">
            {/* Social Share Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col space-y-4 w-12 sticky top-24 h-max">
              <p className="text-xs text-muted-foreground font-semibold tracking-wider text-center mb-2">SHARE</p>
              <Button variant="outline" size="icon" className="rounded-full border-border/50 hover:border-primary hover:text-primary bg-card">
                <Share2 className="w-4 h-4" />
              </Button>
            </aside>

            {/* Content */}
            <div className="flex-1 prose prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
              <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
              
              {/* Keywords / Tags */}
              {blog.keywords && (
                <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
                  {blog.keywords.split(',').map(k => k.trim()).filter(Boolean).map(keyword => (
                    <span key={keyword} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-md font-medium">
                      #{keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </PublicLayout>
  );
}
