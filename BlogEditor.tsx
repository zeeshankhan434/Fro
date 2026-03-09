import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useCreateBlog, useUpdateBlog, useBlogBySlug } from "@/hooks/use-blogs";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, LayoutTemplate } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function BlogEditor() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/admin/edit/:slug");
  const isEditing = Boolean(match);
  const slug = params?.slug;

  const { data: existingBlog, isLoading } = useBlogBySlug(slug || "");
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "market",
    featuredImage: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
  });

  useEffect(() => {
    if (isEditing && existingBlog) {
      setFormData({
        title: existingBlog.title,
        slug: existingBlog.slug,
        category: existingBlog.category,
        featuredImage: existingBlog.featuredImage || "",
        content: existingBlog.content,
        metaTitle: existingBlog.metaTitle || "",
        metaDescription: existingBlog.metaDescription || "",
        keywords: existingBlog.keywords || "",
      });
    }
  }, [existingBlog, isEditing]);

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEditing && !prev.slug ? generateSlug(title) : prev.slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && existingBlog) {
        await updateBlog.mutateAsync({ id: existingBlog.id, ...formData });
        toast({ title: "Post updated successfully" });
      } else {
        await createBlog.mutateAsync(formData);
        toast({ title: "Post created successfully" });
        setLocation("/admin");
      }
    } catch (error: any) {
      toast({ title: "Operation failed", description: error.message, variant: "destructive" });
    }
  };

  if (isEditing && isLoading) return <AdminLayout><div className="animate-pulse h-96 bg-secondary rounded-2xl"></div></AdminLayout>;

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        {/* Header Actions */}
        <div className="flex items-center justify-between bg-card p-4 rounded-2xl border border-border sticky top-4 z-40 shadow-sm backdrop-blur-lg bg-card/80">
          <Button type="button" variant="ghost" onClick={() => setLocation("/admin")} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-4">
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
              disabled={createBlog.isPending || updateBlog.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? "Update Post" : "Publish Post"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-6">
              <div className="space-y-2">
                <Label className="text-lg font-bold">Post Title</Label>
                <Input 
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Enter a compelling title..."
                  className="text-xl py-6 bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold flex justify-between">
                  Content Body
                </Label>
                <RichTextEditor 
                  content={formData.content} 
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))} 
                />
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-6">
              <div className="flex items-center space-x-2 text-muted-foreground border-b border-border pb-4">
                <LayoutTemplate className="w-5 h-5" />
                <h3 className="font-semibold text-foreground">Settings</h3>
              </div>

              <div className="space-y-2">
                <Label>URL Slug</Label>
                <Input 
                  value={formData.slug}
                  onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="post-url-slug"
                  className="bg-background font-mono text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market Analysis</SelectItem>
                    <SelectItem value="defi">DeFi</SelectItem>
                    <SelectItem value="nft">NFTs</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Featured Image URL</Label>
                <Input 
                  value={formData.featuredImage}
                  onChange={e => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-background"
                />
                {formData.featuredImage && (
                  <img src={formData.featuredImage} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2 border border-border" />
                )}
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-6">
              <h3 className="font-semibold text-foreground border-b border-border pb-4">SEO Optimization</h3>
              
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input 
                  value={formData.metaTitle}
                  onChange={e => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="SEO optimized title..."
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea 
                  value={formData.metaDescription}
                  onChange={e => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Brief description for search engines..."
                  className="bg-background resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <Input 
                  value={formData.keywords}
                  onChange={e => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="crypto, bitcoin, market analysis..."
                  className="bg-background"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
