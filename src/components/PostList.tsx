import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

interface Post {
  title: string;
  body: string;
  date: string;
  slug: string;
  coverImage?: string;
  category: string;
  tags?: string[];
}

interface PostListProps {
  posts: Post[];
  title: string;
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
      <section>
        <h2 className="mb-6 border-b border-orange-100 pb-2 text-lg font-semibold text-amber-800">
          {title}
        </h2>
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
