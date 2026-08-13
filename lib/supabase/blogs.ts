import { createClient } from "@supabase/supabase-js";
import { blogPosts as fallbackBlogPosts, type BlogPost } from "@/app/data/blog";
import { getSupabasePublicConfig } from "./config";

type BlogRow = {
  slug: string;
  title: string;
  description: string;
  image: string;
  images: string[] | null;
  date: string;
  category: string;
  reading_time: string;
  eyebrow: string;
  intro: string;
  sections: BlogPost["sections"];
  sort_order: number;
  is_active: boolean;
};

let publicBlogClient: ReturnType<typeof createClient> | null = null;

export type AdminBlogPost = BlogPost & {
  sortOrder?: number;
  isActive?: boolean;
};

function cleanBlogSections(sections: BlogPost["sections"]) {
  return (sections ?? []).map((section) => {
    const cleaned: BlogPost["sections"][number] = {
      paragraphs: (section.paragraphs ?? []).filter(Boolean),
    };

    if (section.heading) {
      cleaned.heading = section.heading;
    }

    if (section.quote) {
      cleaned.quote = section.quote;
    }

    return cleaned;
  });
}

export function rowToBlogPost(row: BlogRow): AdminBlogPost {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    image: row.image,
    images: row.images ?? undefined,
    date: row.date,
    category: row.category,
    readingTime: row.reading_time,
    eyebrow: row.eyebrow,
    intro: row.intro,
    sections: row.sections ?? [],
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

export function blogPostToRow(post: AdminBlogPost, sortOrder = 0): BlogRow {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    image: post.image,
    images: post.images ?? null,
    date: post.date,
    category: post.category,
    reading_time: post.readingTime,
    eyebrow: post.eyebrow,
    intro: post.intro,
    sections: cleanBlogSections(post.sections),
    sort_order: sortOrder,
    is_active: post.isActive ?? true,
  };
}

export async function fetchPublicBlogPosts() {
  const config = getSupabasePublicConfig();

  if (!config) {
    return null;
  }

  publicBlogClient ??= createClient(config.url, config.key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await publicBlogClient
    .from("blog_posts")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("date", { ascending: false });

  if (error || !data?.length) {
    return null;
  }

  return data.map((row) => rowToBlogPost(row as BlogRow));
}

export async function getBlogPostsForSite() {
  return (await fetchPublicBlogPosts()) ?? fallbackBlogPosts;
}

export async function getBlogPostForSite(slug: string) {
  const posts = await getBlogPostsForSite();
  return posts.find((post) => post.slug === slug) ?? null;
}

export function getRelatedBlogPostsForSite(posts: BlogPost[], slug: string) {
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return posts.filter((item) => item.slug !== slug).slice(0, 3);
  }

  return posts
    .filter(
      (item) =>
        item.slug !== slug &&
        (item.category === post.category || item.eyebrow === post.eyebrow)
    )
    .slice(0, 3);
}

export { fallbackBlogPosts };
