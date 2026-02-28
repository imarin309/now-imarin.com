import Link from "next/link";
import { siteName } from "@/constants/meta";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-orange-100 bg-orange-950 py-6 text-center">
      <Link
        href="/privacy-policy"
        className="text-xs text-orange-400 underline transition-colors hover:text-orange-200"
      >
        プライバシーポリシー
      </Link>
      <p className="mt-2 text-sm text-orange-300">
        &copy; {new Date().getFullYear()} {siteName}
      </p>
    </footer>
  );
}
