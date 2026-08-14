import type { MetadataRoute } from "next";
import { getBlogPostsForSite } from "@/lib/supabase/blogs";
import { getCarsForSite } from "@/lib/supabase/cars";
import { absoluteUrl, carOgImage } from "@/lib/seo";

const now = new Date();

function route(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly",
  images?: string[]
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
    images,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cars, posts] = await Promise.all([
    getCarsForSite(),
    getBlogPostsForSite(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    route("/", 1, "daily"),
    route("/avtomobiller", 0.95, "daily"),
    route("/xidmetler", 0.9, "weekly"),
    route("/toy-avtomobilleri", 0.9, "daily"),
    route("/blog", 0.78, "weekly"),
    route("/haqqimizda", 0.72, "monthly"),
    route("/elaqe", 0.7, "monthly"),
    route("/rezervasiya", 0.65, "weekly"),
    route("/sertler", 0.35, "yearly"),
    route("/mexfilik-siyaseti", 0.3, "yearly"),
  ];

  const carRoutes = cars
    .filter((car) => car.rentalVisible !== false)
    .map((car) =>
      route(`/avtomobiller/${car.slug}`, 0.86, "weekly", [car.thumbnail])
    );

  const weddingRoutes = cars
    .filter((car) => car.weddingAvailable)
    .map((car) =>
      route(`/toy-avtomobilleri/${car.slug}`, 0.82, "weekly", [
        carOgImage(car, true),
      ])
    );

  const transferRoutes = cars
    .filter((car) => car.transferAvailable)
    .map((car) =>
      route(`/transfer/${car.slug}`, 0.76, "weekly", [car.thumbnail])
    );

  const blogRoutes = posts.map((post) =>
    route(`/blog/${post.slug}`, 0.68, "monthly", [
      post.image,
      ...(post.images ?? []),
    ])
  );

  return [
    ...staticRoutes,
    ...carRoutes,
    ...weddingRoutes,
    ...transferRoutes,
    ...blogRoutes,
  ];
}
