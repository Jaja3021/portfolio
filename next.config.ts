import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

// MDX powers the /guides articles (src/content/guides/*.mdx).
const withMDX = createMDX({
  // GitHub-flavored markdown: tables, strikethrough, autolinks.
  options: { remarkPlugins: ["remark-gfm"] },
});

export default withMDX(nextConfig);
