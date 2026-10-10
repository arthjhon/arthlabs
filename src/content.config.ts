import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORIES } from './lib/content';

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['active', 'wip', 'archived']).default('active'),
    github: z.string().url().optional().or(z.literal('')),
    demo: z.string().url().optional().or(z.literal('')),
    writeup: z.string().optional(),
    image: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    featured: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.enum(CATEGORIES),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
