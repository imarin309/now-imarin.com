import {
  siteAuthor,
  siteDescription,
  siteEmail,
  siteName,
} from "@/constants/meta";
import type { Locale } from "./config";

export const messages: Record<
  Locale,
  {
    siteName: string;
    siteCatchCopy: string;
    siteDescription: string;
    siteAuthor: string;
    nav: {
      home: string;
      category: string;
      about: string;
      contact: string;
      openMenu: string;
      closeMenu: string;
    };
    posts: {
      latest: string;
      empty: string;
      pageTitle: (page: number) => string;
      recommended: string;
    };
    pagination: {
      label: string;
      previous: string;
      next: string;
    };
    footer: {
      privacyPolicy: string;
    };
    contact: {
      title: string;
      description: string;
      intro: string;
      privacyNote: string;
    };
    notFound: {
      title: string;
      description: string;
      backHome: string;
    };
  }
> = {
  ja: {
    siteName,
    siteCatchCopy: "好きなアニメやゲームについて気ままに語るブログ",
    siteDescription,
    siteAuthor,
    nav: {
      home: "Home",
      category: "Category",
      about: "about",
      contact: "contact",
      openMenu: "メニューを開く",
      closeMenu: "メニューを閉じる",
    },
    posts: {
      latest: "最新の記事",
      empty: "記事がありません。",
      pageTitle: (page) => `ページ ${page}`,
      recommended: "こちらもおすすめ",
    },
    pagination: {
      label: "ページネーション",
      previous: "前のページ",
      next: "次のページ",
    },
    footer: {
      privacyPolicy: "プライバシーポリシー",
    },
    contact: {
      title: "お問い合わせ",
      description: `${siteName}へのお問い合わせはこちらから。`,
      intro: "ご質問・ご感想はメールからお気軽にどうぞ。",
      privacyNote:
        "いただいた個人情報は、ご連絡・対応の目的にのみ使用し、第三者への提供は行いません。",
    },
    notFound: {
      title: "ページが見つかりませんでした",
      description: "お探しのページは存在しないか、移動した可能性があります。",
      backHome: "トップページへ戻る",
    },
  },
  en: {
    siteName: "In the Moment",
    siteCatchCopy: "Anime and game impressions from a Japanese fan.",
    siteDescription:
      "A blog with impressions and commentary on anime, films, OVAs, and games from a Japanese fan perspective.",
    siteAuthor,
    nav: {
      home: "Home",
      category: "Category",
      about: "About",
      contact: "Contact",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    posts: {
      latest: "Latest posts",
      empty: "No posts yet.",
      pageTitle: (page) => `Page ${page}`,
      recommended: "Recommended posts",
    },
    pagination: {
      label: "Pagination",
      previous: "Previous page",
      next: "Next page",
    },
    footer: {
      privacyPolicy: "Privacy Policy",
    },
    contact: {
      title: "Contact",
      description: "Contact In the Moment.",
      intro: "For questions or feedback, please contact me by email.",
      privacyNote:
        "Personal information will only be used for replies and related correspondence.",
    },
    notFound: {
      title: "Page not found",
      description:
        "The page you're looking for doesn't exist or may have been moved.",
      backHome: "Back to home",
    },
  },
};

export { siteEmail };

export function getMessages(locale: Locale) {
  return messages[locale];
}
