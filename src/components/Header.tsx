import Image from "next/image";
import Link from "next/link";
import { siteName, siteCatchCopy } from "@/constants/meta";

export default function Header() {
  return (
    <header className="relative w-full">
      <Image
        src="https://assets.now-imarin.com/meta/header-pc.webp"
        alt={siteName}
        width={0}
        height={0}
        sizes="100vw"
        className="hidden h-auto w-full sm:block"
        priority
      />
      <Image
        src="https://assets.now-imarin.com/meta/header-mobile.webp"
        alt={siteName}
        width={0}
        height={0}
        sizes="100vw"
        className="h-auto w-full sm:hidden"
        priority
      />
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
