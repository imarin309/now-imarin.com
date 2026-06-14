# プロジェクト: now-imarin.com

このプロジェクトは、Next.js (App Router)、Velite、および Tailwind CSS v4 を使用した個人ブログです。

## AI 指示書 & ワークフロー

特定のタスクに特化した指示書は `.claude/` ディレクトリに格納されています。ユーザーから以下のタスクに関連する依頼があった場合、必ず該当するファイルを読み込み、そのワークフローを厳密に遵守してください。

- **記事の執筆サポート (Collab Writing)**: `.claude/commands/collab-writing.md` (ブログ記事の執筆・壁打ち支援)
- **コンテンツレビュー (Content Review)**: `.claude/commands/review-content.md` (記事の品質・規約チェック)
- **説明文の生成 (Generate Description)**: `.claude/commands/gen-description.md` (SEO用のディスクリプション生成)
- **楽天カード生成 (Rakuten Card)**: `.claude/commands/rakuten-card.md` (楽天アフィリエイト用カードの生成)
- **技術レビュー (Copilot Review)**: `.claude/commands/review-copilot.md` (技術設定や構成のレビュー)

## 開発コマンド

- **開発サーバー起動**: `pnpm dev` (Velite のウォッチと Next.js の開発サーバーを並列起動)
- **ビルド**: `pnpm build` (静的サイトとしてエクスポート)
- **リント**: `pnpm lint` (Prettier, ESLint, markdownlint の実行)
- **自動修正**: `pnpm format` (リントエラーの自動修正)

## アーキテクチャ

- **フレームワーク**: Next.js (Static Output モード)
- **コンテンツパイプライン**: `content/**/*.mdx` -> Velite -> `.velite/index.js`
- **インポートエイリアス**: 型定義されたコンテンツを読み込む際は `#site/content` を使用
- **スタイリング**: Tailwind CSS v4。設定は `src/app/globals.css` 内の CSS 変数で管理
- **画像**: Cloudflare R2 (`r2.now-imarin.com`) にホスト。`coverImage` フィールドにはフル URL を記述

## コンテンツ規法 (MDX)

- **Markdown オートリンク**: `<https://...>` 形式は使用禁止（JSX パースエラーの原因）。`[テキスト](URL)` または URL を直接記述すること。
- **フロントマター (Frontmatter)**:
  - `title`: タイトル（文字列）
  - `date`: 日付（YYYY-MM-DD）
  - `category`: カテゴリ（`anime` | `game` | `other`）
  - `coverImage`: カバー画像 URL（任意）
  - `description`: 記事の説明（任意、300文字以内）

## リントルール (Markdownlint)

`.mdx` ファイルに対して markdownlint が有効です。以下のルールは無効化または緩和されています：
- `MD013` (行の長さ)
- `MD033` (インライン HTML)
- `MD036` (強調による見出し)
- `MD001` (見出しレベルの順序)
- `MD034` (ベア URL)
