# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
# 開発サーバー起動（Veliteウォッチ + Next.js dev）
npm run dev

# 本番ビルド
npm run build

# リント検査（Prettier + ESLint + markdownlint）
npm run lint

# 自動修正
npm run format
```

`npm run dev` は `velite --watch` と `next dev` を並列起動する。Velite が先にビルドされていないと `posts` が空になるため、初回は少し待ってからブラウザでアクセスすること。

## アーキテクチャ

### コンテンツパイプライン

```
content/**/*.mdx  →  Velite  →  .velite/index.js  →  Next.js pages
```

Velite が `content/` 配下の MDX をスキーマ検証・コンパイルし、`.velite/index.js` に型付きデータとして出力する。Next.js からは `#site/content` エイリアスでインポートする（`tsconfig.json` に設定済み）。

- `content/posts/*.mdx` → `posts` コレクション（ブログ記事）
- `content/pages/*.mdx` → `pages` コレクション（about、privacy-policy）

スキーマ定義は `velite.config.ts`。フィールドは `title`, `description`, `date`, `category`, `coverImage`（任意）, `noindex`（任意）, `slug`（ファイルパスから自動生成）, `content`（MDXコンパイル済み）。

### ルーティングと静的生成

`output: "export"` による完全静的サイト。`generateStaticParams()` で全スラッグを列挙する必要がある。

| ルート                                 | ページ                     |
| -------------------------------------- | -------------------------- |
| `/`                                    | 記事一覧（1ページ目）      |
| `/page/[num]`                          | 記事一覧（2ページ目以降）  |
| `/posts/[slug]`                        | 記事詳細                   |
| `/category/[category_name]`            | カテゴリー記事一覧         |
| `/category/[category_name]/page/[num]` | カテゴリーページネーション |
| `/about`                               | Aboutページ                |
| `/privacy-policy`                      | プライバシーポリシー       |

ページネーション: 1ページあたり `POSTS_PER_PAGE = 5`（`src/constants/config.ts`）。

### カテゴリー

`src/constants/category.ts` に定義。現在3種類：`anime`（アニメ）、`game`（ゲーム）、`other`（その他）。新カテゴリー追加時はこのファイルの `categories` 配列を更新するだけでよい。

### デザインシステム

Tailwind CSS v4（CSS-firstアプローチ）。設定ファイルは存在せず、`src/app/globals.css` の `@theme` ブロックでカスタムカラーを定義している。

カラートークン（CSS変数）:

- `--primary`: `#d4500a`（オレンジ、メインカラー）
- `--secondary`: `#f4924b`（ライトオレンジ）
- `--accent`: `#fde3c8`（ピーチクリーム）
- `--background`: `#fffaf5`（クリーム）
- `--foreground`: `#3d2008`（ウォームブラウン）

記事本文は `@tailwindcss/typography`（`prose prose-amber`）でスタイリング。

### 画像

`next.config.ts` で `unoptimized: true`。画像は Cloudflare R2（`r2.now-imarin.com`）または旧 WordPress サーバー（`now-imarin.com`）にホストされ、`coverImage` フィールドにフル URL を記載する。

## コンテンツ記法（MDX）

記事 frontmatter の例:

```yaml
---
title: "記事タイトル"
description: "記事の説明（300文字以内、任意）"
date: 2024-10-14
category: anime
coverImage: https://r2.now-imarin.com/path/to/image.jpg
---
```

**MDX の制約:** `<https://...>` 形式の Markdown autolink は MDX では JSX としてパースされエラーになる。URL はそのまま記述するか `[テキスト](URL)` 形式を使う。

## Lint 設定

- `content/**` は Prettier・ESLint の対象外（`.prettierignore`、`eslint.config.mjs` の `globalIgnores`）
- `content/**/*.mdx` は markdownlint の対象（`npm run lint` に含まれる）
- 無効化している markdownlint ルール: `MD013`（行長）, `MD033`（HTML）, `MD036`（見出し）, `MD001`（見出しレベル）, `MD034`（ベアURL）

## WordPress 移行スクリプト

`scripts/wp-to-mdx.mjs` で WordPress XML エクスポートを MDX に変換できる。XML ファイルはリポジトリルートに `WordPress.2026-02-28.xml` として配置（`.gitignore` で除外済み）。
