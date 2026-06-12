import { ArrowLeft, BookOpen, Calendar, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlogPost } from "../lib/blogApi";

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getBlogPost(slug)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="page-shell flex flex-col items-center py-32 text-center">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-forest/40" />
        <p className="muted">Loading post…</p>
      </div>
    );
  }

  if (notFound || !post) {
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

  const paragraphs = post.content
    ? post.content
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen">
      {/* Cover image hero */}
      <div className="relative h-64 overflow-hidden bg-ink sm:h-80 lg:h-96">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
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
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Language tag */}
          {post.language && (
            <div className="mt-4">
              <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-forest capitalize">
                {post.language}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="mt-4 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-ink/10 pb-6">
            <span className="flex items-center gap-1.5 text-sm text-ink/50">
              <Calendar className="h-4 w-4" />
              {formatDate(post.published_at)}
            </span>
          </div>

          {/* Body */}
          <div className="mt-8 space-y-5 pb-16">
            {paragraphs.map((para, i) => (
              <p key={i} className="leading-7 text-ink/80">
                {para}
              </p>
            ))}
          </div>

          {/* Cover image credit — required when image is from Unsplash */}
          {post.cover_image_url?.includes("unsplash.com") && (
            <p className="pb-20 text-xs text-ink/30">
              {post.cover_image_credit_name ? (
                <>
                  Photo by{" "}
                  {post.cover_image_credit_url ? (
                    <a
                      href={post.cover_image_credit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-ink/60"
                    >
                      {post.cover_image_credit_name}
                    </a>
                  ) : (
                    post.cover_image_credit_name
                  )}{" "}
                  on{" "}
                  <a
                    href="https://unsplash.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink/60"
                  >
                    Unsplash
                  </a>
                </>
              ) : (
                <>
                  Photo on{" "}
                  <a
                    href="https://unsplash.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink/60"
                  >
                    Unsplash
                  </a>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
