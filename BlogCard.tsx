import { Link } from "wouter";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Blog } from "@shared/schema";

export function BlogCard({ blog, index = 0 }: { blog: Blog; index?: number }) {
  // Use a fallback generic crypto pattern if no featured image
  const imageUrl = blog.featuredImage || `https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex flex-col glass-panel rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="aspect-[16/9] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
        <img
          src={imageUrl}
          alt={blog.title}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-full backdrop-blur-md">
            {blog.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 relative z-20 bg-card/50">
        <p className="text-sm text-muted-foreground mb-3 font-medium">
          {format(new Date(blog.createdAt!), "MMM d, yyyy")}
        </p>
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
          {blog.metaDescription || "Read more about this topic in our detailed analysis."}
        </p>
        <Link href={`/blog/${blog.slug}`} className="inline-flex items-center text-sm font-semibold text-primary group-hover:text-accent transition-colors w-max">
          Read Article
          <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
