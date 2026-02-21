import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout/success", "/api"],
    },
    sitemap: "https://abu-imran-farm.com/sitemap.xml",
  };
}
