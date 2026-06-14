import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import type { Post } from "@/lib/posts";

interface PostListProps {
  posts: Post[];
  title?: string;
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function PostList({
  posts,
  title,
  currentPage,
  totalPages,
  basePath,
}: PostListProps) {
  return (
    <div>
      {title && (
        <div className="mb-6">
          <h2 className="inline text-lg font-semibold text-amber-900 bg-gradient-to-r from-primary to-secondary bg-[length:100%_2px] bg-no-repeat bg-bottom pb-1">
            {title}
          </h2>
        </div>
      )}

      <section>
        {posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                title={post.title}
                body={post.body}
                date={post.date}
                slug={post.slug}
                coverImage={post.coverImage}
                category={post.category}
                tags={post.tags}
              />
            ))}
          </div>
        ) : (
          <p className="text-orange-300">記事がありません。</p>
        )}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
      />
    </div>
  );
}
