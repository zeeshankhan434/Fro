import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { authHeaders } from "@/lib/auth";

export function useBlogs(page = 1, limit = 10) {
  return useQuery({
    queryKey: [api.blogs.list.path, page, limit],
    queryFn: async () => {
      const url = new URL(api.blogs.list.path, window.location.origin);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", limit.toString());
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return api.blogs.list.responses[200].parse(await res.json());
    },
  });
}

export function useBlogBySlug(slug: string) {
  return useQuery({
    queryKey: [api.blogs.getBySlug.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.blogs.getBySlug.path, { slug });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch blog");
      return api.blogs.getBySlug.responses[200].parse(await res.json());
    },
  });
}

export function useBlogsByCategory(category: string) {
  return useQuery({
    queryKey: [api.blogs.getByCategory.path, category],
    queryFn: async () => {
      const url = buildUrl(api.blogs.getByCategory.path, { category });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch category");
      return api.blogs.getByCategory.responses[200].parse(await res.json());
    },
  });
}

export function useSearchBlogs(q: string) {
  return useQuery({
    queryKey: [api.blogs.search.path, q],
    queryFn: async () => {
      if (!q) return [];
      const url = new URL(api.blogs.search.path, window.location.origin);
      url.searchParams.set("q", q);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to search blogs");
      return api.blogs.search.responses[200].parse(await res.json());
    },
    enabled: q.length > 2,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: typeof api.blogs.create.input._type) => {
      const res = await fetch(api.blogs.create.path, {
        method: api.blogs.create.method,
        headers: { 
          "Content-Type": "application/json",
          ...authHeaders()
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = api.blogs.create.responses[400].parse(await res.json());
          throw new Error(err.message);
        }
        throw new Error("Failed to create blog");
      }
      return api.blogs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.blogs.list.path] });
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & typeof api.blogs.update.input._type) => {
      const url = buildUrl(api.blogs.update.path, { id });
      const res = await fetch(url, {
        method: api.blogs.update.method,
        headers: { 
          "Content-Type": "application/json",
          ...authHeaders()
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to update blog");
      }
      return api.blogs.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.blogs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.blogs.getBySlug.path] });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.blogs.delete.path, { id });
      const res = await fetch(url, {
        method: api.blogs.delete.method,
        headers: authHeaders(),
      });

      if (!res.ok) {
        throw new Error("Failed to delete blog");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.blogs.list.path] });
    },
  });
}
