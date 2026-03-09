import { z } from 'zod';
import { insertBlogSchema, blogs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/admin/login' as const,
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.object({ token: z.string() }),
        401: errorSchemas.unauthorized,
      }
    }
  },
  blogs: {
    list: {
      method: 'GET' as const,
      path: '/api/blogs' as const,
      input: z.object({
        page: z.string().optional(),
        limit: z.string().optional()
      }).optional(),
      responses: {
        200: z.object({
          blogs: z.array(z.custom<typeof blogs.$inferSelect>()),
          total: z.number(),
          page: z.number(),
          totalPages: z.number()
        })
      }
    },
    getBySlug: {
      method: 'GET' as const,
      path: '/api/blog/:slug' as const,
      responses: {
        200: z.custom<typeof blogs.$inferSelect>(),
        404: errorSchemas.notFound
      }
    },
    getByCategory: {
      method: 'GET' as const,
      path: '/api/category/:category' as const,
      responses: {
        200: z.array(z.custom<typeof blogs.$inferSelect>())
      }
    },
    search: {
      method: 'GET' as const,
      path: '/api/search' as const,
      input: z.object({ q: z.string() }),
      responses: {
        200: z.array(z.custom<typeof blogs.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/admin/create-blog' as const,
      input: insertBlogSchema,
      responses: {
        201: z.custom<typeof blogs.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/admin/update-blog/:id' as const,
      input: insertBlogSchema.partial(),
      responses: {
        200: z.custom<typeof blogs.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/admin/delete-blog/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
