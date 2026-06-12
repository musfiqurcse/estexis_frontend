import { ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listBlogPosts } from "../lib/blogApi";

function TagPill({ tag }) {
  return (
    <span className="inline-block rounded-full bg-sage px-2.5 py-0.5 text-xs font-semibold text-forest">
      {tag}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function PostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/5 bg-white transition hover:shadow-soft"
    >
      <div className="relative h-52 overflow-hidden bg-sage">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
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
          {post.language && <TagPill tag={post.language} />}
        </div>
        <h2 className="mb-2 text-base font-semibold leading-snug text-ink transition-colors group-hover:text-forest">
          {post.title}
        </h2>
        <p className="muted mb-4 flex-1 line-clamp-3">{post.ai_summary}</p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink/40">{formatDate(post.published_at)}</p>
          <span className="flex items-center gap-1 text-xs font-semibold text-forest">
            Read <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listBlogPosts()
      .then(setPosts)
      .catch((err) => setError(err.message || "Unable to load posts."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-ink py-16 text-white">
        <div className="page-shell">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">
            Grihoo Insights
          </p>
          <h1 className="section-title text-white">Insights &amp; Guides</h1>
          <p className="mt-3 max-w-xl text-white/60">
            Expert advice on buying, selling, and investing in European real estate.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="page-shell py-12">
        {loading ? (
          <div className="flex flex-col items-center py-24 text-center">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-forest/40" />
            <p className="muted">Loading posts…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-24 text-center">
            <BookOpen className="mb-4 h-10 w-10 text-ink/20" />
            <p className="section-title">Could not load posts</p>
            <p className="muted mt-1">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <BookOpen className="mb-4 h-10 w-10 text-ink/20" />
            <p className="section-title">No posts yet</p>
            <p className="muted mt-1">Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
