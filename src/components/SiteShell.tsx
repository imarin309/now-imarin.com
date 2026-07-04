import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RecommendedPosts from "@/components/RecommendedPosts";
import GoogleAnalytics from "@/components/google/GoogleAnalytics";
import GoogleAdSense from "@/components/google/GoogleAdSense";
import WebSiteJsonLd from "@/components/WebSiteJsonLd";
import type { Locale } from "@/i18n/config";

/**
 * ロケールごとのルートレイアウトで共有する共通クローム。
 * NavBar / Header / main / RecommendedPosts / Footer をまとめ、
 * ルートグループ間での重複を防ぐ。
 */
export default function SiteShell({
  locale,
  pathPrefix,
  children,
}: {
  locale: Locale;
  pathPrefix: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {process.env.NODE_ENV === "production" &&
        process.env.CF_PAGES_BRANCH === "main" && (
          <>
            <GoogleAnalytics />
            <GoogleAdSense />
          </>
        )}
      <WebSiteJsonLd locale={locale} />
      <NavBar locale={locale} pathPrefix={pathPrefix} />
      <Header locale={locale} pathPrefix={pathPrefix} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {children}
      </main>
      <RecommendedPosts locale={locale} pathPrefix={pathPrefix} />
      <Footer locale={locale} pathPrefix={pathPrefix} />
    </>
  );
}
