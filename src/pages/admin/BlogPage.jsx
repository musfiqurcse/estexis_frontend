import { Edit2, Globe, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { BlogEditor } from "../../components/admin/BlogEditor";
import { useBlog } from "../../context/BlogContext";

const statusStyles = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-gray-100 text-gray-500",
};

export function AdminBlogPage() {
  const { posts, createPost, updatePost, deletePost } = useBlog();
  const [mode, setMode] = useState("list"); // "list" | "create" | "edit"
  const [editingPost, setEditingPost] = useState(null);

  function handleSave(data) {
    if (mode === "edit" && editingPost) {
      updatePost(editingPost.id, data);
    } else {
      createPost(data);
    }
    setMode("list");
    setEditingPost(null);
  }

  function handleEdit(post) {
    setEditingPost(post);
    setMode("edit");
  }

  function handleCancel() {
    setMode("list");
    setEditingPost(null);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this post? This cannot be undone.")) {
      deletePost(id);
    }
  }

  function handleToggleStatus(post) {
    updatePost(post.id, {
      status: post.status === "published" ? "draft" : "published",
    });
  }

  if (mode === "create" || mode === "edit") {
    return (
      <AdminLayout title={mode === "edit" ? "Edit Post" : "New Post"}>
        <div className="mx-auto max-w-2xl rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-6 text-sm font-semibold text-gray-900">
            {mode === "edit" ? `Editing: ${editingPost.title}` : "Create New Post"}
          </h2>
          <BlogEditor
            post={mode === "edit" ? editingPost : null}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Blog Content">
      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">All Posts</h2>
            <p className="mt-0.5 text-xs text-gray-400">{posts.length} total</p>
          </div>
          <button
            onClick={() => setMode("create")}
            className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
          >
            <PlusCircle className="h-4 w-4" />
            New Post
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-sm text-gray-400">No posts yet. Create your first post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Post
                  </th>
                  <th className="hidden p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">
                    Date
                  </th>
                  <th className="hidden p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 md:table-cell">
                    Views
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
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
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
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden p-4 text-gray-500 sm:table-cell">{post.date}</td>
                    <td className="hidden p-4 text-gray-500 md:table-cell">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[post.status]}`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(post)}
                          title={post.status === "published" ? "Set to draft" : "Publish"}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                          <Globe className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(post)}
                          title="Edit"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          title="Delete"
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
    </AdminLayout>
  );
}
