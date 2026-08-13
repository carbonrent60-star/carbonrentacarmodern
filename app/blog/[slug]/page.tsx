import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CarbonNavbar from "../../../components/CarbonNavbar";
import {
  blogPosts,
} from "../../data/blog";
import {
  getBlogPostForSite,
  getBlogPostsForSite,
  getRelatedBlogPostsForSite,
} from "@/lib/supabase/blogs";
import { createPageMetadata } from "@/lib/seo";
import BlogArticleClient from "./BlogArticleClient";
import "../blog.css";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostForSite(slug);

  if (!post) {
    return createPageMetadata({
      title: "Məqalə tapılmadı | Carbon Rent A Car",
      description:
        "Axtardığınız Carbon məqaləsi tapılmadı. Avtomobil icarəsi və səyahət bələdçiləri üçün blog səhifəsinə baxın.",
      path: "/blog",
      type: "article",
    });
  }

  return createPageMetadata({
    title: `${post.title} | Carbon Rent A Car`,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.image,
    type: "article",
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getBlogPostsForSite();
  const post = posts.find((item) => item.slug === slug) ?? null;

  if (!post) notFound();

  return (
    <>
      <CarbonNavbar light active="blog" />
      <BlogArticleClient
        post={post}
        related={getRelatedBlogPostsForSite(posts, post.slug)}
      />
    </>
  );
}
