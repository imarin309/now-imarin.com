"use client";

import Image from "next/image";
import Link from "next/link";
import { getAllCategories } from "@/constants/category";
import { siteName } from "@/constants/meta";
import { useCallback, useEffect, useRef, useState } from "react";

const categories = getAllCategories();

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function handleButtonKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setIsOpen(true);
        requestAnimationFrame(() => itemRefs.current[0]?.focus());
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          closeMenu();
        }
        break;
    }
  }

  function handleMenuKeyDown(event: React.KeyboardEvent) {
    const currentIndex = itemRefs.current.findIndex(
      (ref) => ref === document.activeElement,
    );

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (currentIndex < 0) return;
        itemRefs.current[(currentIndex + 1) % categories.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        if (currentIndex <= 0) {
          closeMenu();
        } else {
          itemRefs.current[currentIndex - 1]?.focus();
        }
        break;
      case "Escape":
        event.preventDefault();
        closeMenu();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-orange-100 bg-orange-50/90 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* アイコン + サイトタイトル */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://assets.now-imarin.com/meta/site-icon.webp"
              alt="now-imarin.com"
              width={28}
              height={28}
              className="rounded-sm"
            />
            <span className="text-sm font-bold text-amber-700">{siteName}</span>
          </Link>

          {/* デスクトップ nav (sm以上) */}
          <div className="hidden items-center gap-6 text-sm font-medium sm:flex">
            <Link
              href="/"
              className="text-amber-700 transition-colors hover:text-orange-600"
            >
              Home
            </Link>
            <div
              ref={menuRef}
              className="relative"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => {
                if (!menuRef.current?.contains(document.activeElement)) {
                  setIsOpen(false);
                }
              }}
            >
              <button
                ref={buttonRef}
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => setIsOpen((prev) => !prev)}
                onKeyDown={handleButtonKeyDown}
                className="text-amber-700 transition-colors hover:text-orange-600"
              >
                Category
              </button>
              <div
                className={`absolute left-0 top-full z-50 pt-2 transition-all ${
                  isOpen ? "visible opacity-100" : "invisible opacity-0"
                }`}
              >
                <ul
                  role="menu"
                  onKeyDown={handleMenuKeyDown}
                  className="min-w-40 border border-orange-100 bg-white py-1 shadow-md"
                >
                  {categories.map((category, index) => (
                    <li key={category.slug} role="none">
                      <Link
                        ref={(el) => {
                          itemRefs.current[index] = el;
                        }}
                        role="menuitem"
                        tabIndex={-1}
                        href={`/category/${category.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-amber-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link
              href="/about"
              className="text-amber-700 transition-colors hover:text-orange-600"
            >
              about
            </Link>
            <Link
              href="/contact"
              className="text-amber-700 transition-colors hover:text-orange-600"
            >
              contact
            </Link>
          </div>

          {/* ハンバーガーボタン (sm未満) */}
          <button
            className="text-amber-700 sm:hidden"
            aria-label={isMobileOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            {isMobileOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMobileOpen && (
        <div className="border-t border-orange-100 bg-orange-50/90 px-4 py-3 text-sm font-medium sm:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setIsMobileOpen(false)}
              className="text-amber-700 transition-colors hover:text-orange-600"
            >
              Home
            </Link>
            <div>
              <p className="mb-2 text-amber-700">Category</p>
              <ul className="ml-4 flex flex-col gap-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      onClick={() => setIsMobileOpen(false)}
                      className="text-amber-700 transition-colors hover:text-orange-600"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/about"
              onClick={() => setIsMobileOpen(false)}
              className="text-amber-700 transition-colors hover:text-orange-600"
            >
              about
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileOpen(false)}
              className="text-amber-700 transition-colors hover:text-orange-600"
            >
              contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
