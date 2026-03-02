import Link from "next/link";
import { siteName, siteCatchCopy } from "@/constants/meta";

export default function Header() {
  return (
    <header className="relative w-full">
      <picture>
        <source
          media="(min-width: 640px)"
          srcSet="https://assets.now-imarin.com/meta/header-pc.webp"
        />
        {}
        <img
          src="https://assets.now-imarin.com/meta/header-mobile.webp"
          alt={siteName}
          fetchPriority="high"
          className="h-auto w-full"
        />
      </picture>
      <div className="absolute inset-0 bg-orange-950/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-wider text-white drop-shadow-lg transition-opacity hover:opacity-80 sm:text-3xl"
          >
            {siteName}
          </Link>
          <p className="mt-1 text-sm tracking-wide text-orange-100 drop-shadow sm:text-base">
            {siteCatchCopy}
          </p>
        </div>
      </div>
    </header>
  );
}
