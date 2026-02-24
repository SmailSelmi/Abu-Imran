import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "أبو عمران | سلالات نادرة ومعدات تفقيس",
    short_name: "أبو عمران",
    description:
      "مصدرك الأول للسلالات النادرة والبيض المخصب وأحدث تقنيات التفقيس في الجزائر.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10b981",
    icons: [
      {
        src: "/AbuImranLogo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/AbuImranLogo.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/AbuImranLogo.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
