import type { AnchorHTMLAttributes } from "react";

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};

export function SiteLink({ href, ...props }: SiteLinkProps) {
  const basePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";
  const pageHref = basePath && href !== "/" ? `${href}.html` : href;
  const resolvedHref = href.startsWith("/") ? `${basePath}${pageHref}` : href;

  return <a href={resolvedHref} {...props} />;
}
