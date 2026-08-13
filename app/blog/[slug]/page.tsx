import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CarbonNavbar from "../../../components/CarbonNavbar";
import {
  blogPosts,
  getBlogPost,
  getRelatedBlogPosts,
} from "../../data/blog";
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
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Məqalə tapılmadı | Carbon Rent A Car",
    };
  }

  return {
    title: `${post.title} | Carbon Rent A Car`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <>
      <CarbonNavbar light active="blog" />
      <BlogArticleClient
        post={post}
        related={getRelatedBlogPosts(post.slug)}
      />
    </>
  );
}
