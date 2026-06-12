import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Globe,
  GlobeLock,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { BlogEditor } from "../../components/admin/BlogEditor";
import {
  deleteBlogPost,
  generateBlogPost,
  listAdminBlogPosts,
  publishBlogPost,
  rejectBlogPost,
  unpublishBlogPost,
  updateBlogPost,
} from "../../lib/adminApi";

const statusStyles = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-gray-100 text-gray-500",
  rejected: "bg-red-50 text-red-600",
};

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [editingPost, setEditingPost] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [generateOpen, setGenerateOpen] = useState(false);
  const [generateForm, setGenerateForm] = useState({ prompt: "", language: "english" });

  async function loadPosts() {
    setLoading(true);
    setError("");
    try {
      const data = await listAdminBlogPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message || "Unable to load posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();
    setActionLoading("generate");
    setError("");
    setNotice("");
    try {
      await generateBlogPost(generateForm.prompt.trim(), generateForm.language.trim() || "english");
      setGenerateOpen(false);
      setGenerateForm({ prompt: "", language: "english" });
      setNotice("Post generated and saved as draft.");
      await loadPosts();
    } catch (err) {
      setError(err.message || "Generation failed.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleSaveEdit(data) {
    if (!editingPost) return;
    setActionLoading("edit");
    setError("");
    setNotice("");
    try {
      await updateBlogPost(editingPost.id, data);
      setEditingPost(null);
      setNotice("Post updated.");
      await loadPosts();
    } catch (err) {
      setError(err.message || "Update failed.");
    } finally {
      setActionLoading("");
    }
  }

  async function handlePublish(post) {
    setActionLoading(`publish-${post.id}`);
    setError("");
    setNotice("");
    try {
      await publishBlogPost(post.id);
      setNotice("Post published.");
      await loadPosts();
    } catch (err) {
      setError(err.message || "Publish failed.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleUnpublish(post) {
    setActionLoading(`unpublish-${post.id}`);
    setError("");
    setNotice("");
    try {
      await unpublishBlogPost(post.id);
      setNotice("Post unpublished.");
      await loadPosts();
    } catch (err) {
      setError(err.message || "Unpublish failed.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleReject(post) {
    setActionLoading(`reject-${post.id}`);
    setError("");
    setNotice("");
    try {
      await rejectBlogPost(post.id);
      setNotice("Post rejected.");
      await loadPosts();
    } catch (err) {
      setError(err.message || "Reject failed.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setActionLoading("delete");
    setError("");
    setNotice("");
    try {
      await deleteBlogPost(deleteTarget.id);
      setDeleteTarget(null);
      setNotice("Post deleted.");
      await loadPosts();
    } catch (err) {
      setError(err.message || "Delete failed.");
    } finally {
      setActionLoading("");
    }
  }

  if (editingPost) {
    return (
      <AdminLayout title="Edit Post">
        <div className="mx-auto max-w-2xl rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-6 text-sm font-semibold text-gray-900">
            Editing: {editingPost.title}
          </h2>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
          <BlogEditor
            post={editingPost}
            onSave={handleSaveEdit}
            onCancel={() => { setEditingPost(null); setError(""); }}
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Blog Content">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Blog Posts</h2>
            <p className="mt-1 text-sm text-gray-400">
              Generate AI posts, edit content, and manage publish status.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="btn-secondary py-2"
              onClick={loadPosts}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              className="btn-primary py-2"
              onClick={() => setGenerateOpen(true)}
              disabled={Boolean(actionLoading)}
            >
              <Sparkles className="h-4 w-4" />
              Generate Post
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}
        {notice && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {notice}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          {loading ? (
            <div className="flex flex-col items-center py-16 text-gray-400">
              <Loader2 className="mb-2 h-5 w-5 animate-spin" />
              <p className="text-sm">Loading posts…</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <p className="text-sm text-gray-400">No posts yet. Generate your first post.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Post
                    </th>
                    <th className="hidden p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">
                      Language
                    </th>
                    <th className="hidden p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 md:table-cell">
                      Published
                    </th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Status
                    </th>
                    <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-gray-50 transition hover:bg-gray-50/50 last:border-0"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {post.cover_image_url ? (
                            <img
                              src={post.cover_image_url}
                              alt=""
                              className="h-10 w-14 flex-shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-14 flex-shrink-0 rounded-lg bg-gray-100" />
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-900 max-w-[200px]">
                              {post.title}
                            </p>
                            <p className="truncate text-xs text-gray-400 max-w-[200px]">
                              {post.ai_summary}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden p-4 text-gray-500 sm:table-cell capitalize">
                        {post.language || "—"}
                      </td>
                      <td className="hidden p-4 text-gray-500 md:table-cell">
                        {formatDate(post.published_at)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[post.status] || "bg-gray-100 text-gray-500"}`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          {post.status !== "published" && (
                            <button
                              onClick={() => handlePublish(post)}
                              title="Publish"
                              disabled={Boolean(actionLoading)}
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              {actionLoading === `publish-${post.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Globe className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          {post.status === "published" && (
                            <button
                              onClick={() => handleUnpublish(post)}
                              title="Unpublish"
                              disabled={Boolean(actionLoading)}
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-amber-50 hover:text-amber-600"
                            >
                              {actionLoading === `unpublish-${post.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <GlobeLock className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          {post.status !== "rejected" && (
                            <button
                              onClick={() => handleReject(post)}
                              title="Reject"
                              disabled={Boolean(actionLoading)}
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                            >
                              {actionLoading === `reject-${post.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => setEditingPost(post)}
                            title="Edit"
                            disabled={Boolean(actionLoading)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(post)}
                            title="Delete"
                            disabled={Boolean(actionLoading)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Generate modal */}
      {generateOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form
            className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl"
            onSubmit={handleGenerate}
          >
            <h3 className="text-base font-semibold text-gray-900">Generate Blog Post</h3>
            <p className="mt-1 text-sm text-gray-400">
              Describe the topic and the AI will write a full post.
            </p>
            <div className="mt-4 space-y-3">
              <textarea
                className="input-field min-h-28 resize-none"
                placeholder="Write about buying property in Berlin as a foreigner, covering financing, costs, and legal steps…"
                value={generateForm.prompt}
                onChange={(e) =>
                  setGenerateForm((prev) => ({ ...prev, prompt: e.target.value }))
                }
                maxLength={2000}
                required
              />
              <input
                className="input-field"
                placeholder="Language (e.g. english, german)"
                value={generateForm.language}
                onChange={(e) =>
                  setGenerateForm((prev) => ({ ...prev, language: e.target.value }))
                }
              />
            </div>
            {error && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setGenerateOpen(false); setError(""); }}
                disabled={actionLoading === "generate"}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={actionLoading === "generate"}
              >
                {actionLoading === "generate" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">Delete post</h3>
            <p className="mt-1 text-sm text-gray-400">
              This will permanently delete &ldquo;{deleteTarget.title}&rdquo;. This cannot be
              undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={actionLoading === "delete"}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary bg-red-600 hover:bg-red-700"
                onClick={handleConfirmDelete}
                disabled={actionLoading === "delete"}
              >
                {actionLoading === "delete" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
