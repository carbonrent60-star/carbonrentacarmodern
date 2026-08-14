import type { Metadata } from "next";
import CarbonNavbar from "../../components/CarbonNavbar";
import StructuredData from "@/components/StructuredData";
import { getBlogPostsForSite } from "@/lib/supabase/blogs";
import {
  absoluteUrl,
  createPageMetadata,
} from "@/lib/seo";
import BlogClient from "./BlogClient";
import "./blog.css";

export const metadata: Metadata = createPageMetadata({
  title: "Blog | Carbon Rent A Car",
  description:
    "Avtomobil kirayəsi, sığorta, səyahət marşrutları və avtomobil baxımı haqqında Carbon Rent A Car məqalələri.",
  path: "/blog",
  keywords: [
    "avtomobil icarəsi blog",
    "kirayə məsləhətləri",
    "avtomobil sığortası",
    "avtomobil baxımı",
    "Bakı səyahət marşrutları",
    "rent a car guide Baku",
  ],
});

export default async function BlogPage() {
  const posts = await getBlogPostsForSite();
  const blogListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/blog#itemlist"),
    name: "Carbon Rent A Car blog",
    url: absoluteUrl("/blog"),
    numberOfItems: posts.length,
    itemListElement: posts.slice(0, 24).map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/blog/${post.slug}`),
      item: {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        image: post.image,
        datePublished: post.date,
      },
    })),
  };

  return (
    <>
      <StructuredData data={blogListJsonLd} />
      <CarbonNavbar light active="blog" />
      <BlogClient initialPosts={posts} />
    </>
  );
}
