import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useBlog } from "../context/BlogContext";

function TagPill({ tag }) {
  return (
    <span className="inline-block rounded-full bg-sage px-2.5 py-0.5 text-xs font-semibold text-forest">
      {tag}
    </span>
  );
}

function PostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/5 bg-white transition hover:shadow-soft"
    >
      <div className="relative h-52 overflow-hidden bg-sage">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-10 w-10 text-forest/30" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
        <h2 className="mb-2 text-base font-semibold leading-snug text-ink group-hover:text-forest transition-colors">
          {post.title}
        </h2>
        <p className="muted mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-ink">{post.author}</p>
            <p className="text-xs text-ink/40">{post.date}</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-forest">
            Read <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BlogListPage() {
  const { publishedPosts } = useBlog();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-ink py-16 text-white">
        <div className="page-shell">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">
            Grihoo Insights
          </p>
          <h1 className="section-title text-white">Insights &amp; Guides</h1>
          <p className="mt-3 max-w-xl text-ink/60 text-white/60">
            Expert advice on buying, selling, and investing in European real estate.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="page-shell py-12">
        {publishedPosts.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <BookOpen className="mb-4 h-10 w-10 text-ink/20" />
            <p className="section-title">No posts yet</p>
            <p className="muted mt-1">Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publishedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
