import type { Metadata } from "next";
import CarbonNavbar from "../../components/CarbonNavbar";
import { getBlogPostsForSite } from "@/lib/supabase/blogs";
import BlogClient from "./BlogClient";
import "./blog.css";

export const metadata: Metadata = {
  title: "Blog | Carbon Rent A Car",
  description:
    "Avtomobil kirayəsi, sığorta, səyahət marşrutları və avtomobil baxımı haqqında Carbon Rent A Car məqalələri.",
};

export default async function BlogPage() {
  const posts = await getBlogPostsForSite();

  return (
    <>
      <CarbonNavbar light active="blog" />
      <BlogClient initialPosts={posts} />
    </>
  );
}
