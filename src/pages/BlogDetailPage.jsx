import { ArrowLeft, BookOpen, Calendar, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useBlog } from "../context/BlogContext";

export function BlogDetailPage() {
  const { slug } = useParams();
  const { getPost } = useBlog();
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="page-shell flex flex-col items-center py-32 text-center">
        <BookOpen className="mb-4 h-10 w-10 text-ink/20" />
        <h1 className="section-title">Post not found</h1>
        <p className="muted mt-1">This post may have been removed.</p>
        <Link to="/blog" className="btn-primary mt-6">
          Back to Blog
        </Link>
      </div>
    );
  }

  const paragraphs = post.body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Cover image hero */}
      <div className="relative h-64 overflow-hidden bg-ink sm:h-80 lg:h-96">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover opacity-60"
          />
        ) : (
          <div className="h-full bg-forest/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="page-shell">
        <div className="mx-auto max-w-2xl">
          {/* Back link */}
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 hover:text-forest transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-forest"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="mt-4 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-ink/10 pb-6">
            <span className="flex items-center gap-1.5 text-sm text-ink/50">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-ink/50">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
          </div>

          {/* Body */}
          <div className="mt-8 space-y-5 pb-20">
            {paragraphs.map((para, i) => (
              <p key={i} className="leading-7 text-ink/80">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
