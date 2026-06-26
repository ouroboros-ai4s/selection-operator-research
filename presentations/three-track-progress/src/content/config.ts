import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    order: z.number().int().min(1).max(13),
    title: z.string(),
    chapter: z.enum(['ch1', 'ch2', 'ch3', 'ch4', 'ch5'])
  })
});

export const collections = { pages };
