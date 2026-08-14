import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CarbonNavbar from "../../../components/CarbonNavbar";
import StructuredData from "@/components/StructuredData";
import {
  blogPosts,
} from "../../data/blog";
import {
  getBlogPostForSite,
  getBlogPostsForSite,
  getRelatedBlogPostsForSite,
} from "@/lib/supabase/blogs";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
} from "@/lib/seo";
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
    keywords: [
      post.title,
      post.category,
      post.eyebrow,
      "avtomobil icarəsi məsləhətləri",
      "rent a car blog Bakı",
    ],
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
      <StructuredData
        data={[
          breadcrumbJsonLd([
            { name: "Ana səhifə", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          articleJsonLd({
            title: post.title,
            description: post.description,
            image: post.image,
            path: `/blog/${post.slug}`,
            date: post.date,
          }),
        ]}
      />
      <CarbonNavbar light active="blog" />
      <BlogArticleClient
        post={post}
        related={getRelatedBlogPostsForSite(posts, post.slug)}
      />
    </>
  );
}
