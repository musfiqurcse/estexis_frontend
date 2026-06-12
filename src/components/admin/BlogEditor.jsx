import { useState } from "react";

const EMPTY = {
  title: "",
  slug: "",
  ai_summary: "",
  content: "",
};

function fromPost(post) {
  return {
    title: post.title || "",
    slug: post.slug || "",
    ai_summary: post.ai_summary || "",
    content: post.content || "",
  };
}

export function BlogEditor({ post, onSave, onCancel }) {
  const [form, setForm] = useState(post ? fromPost(post) : EMPTY);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ ...form });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Title
        </label>
        <input
          className="input-field"
          placeholder="Post title"
          value={form.title}
          onChange={set("title")}
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Slug
        </label>
        <input
          className="input-field"
          placeholder="url-friendly-slug"
          value={form.slug}
          onChange={set("slug")}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Summary
        </label>
        <textarea
          className="input-field resize-none"
          rows={2}
          placeholder="Short summary shown on the blog list page"
          value={form.ai_summary}
          onChange={set("ai_summary")}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Content
        </label>
        <textarea
          className="input-field resize-y"
          rows={12}
          placeholder={"Write the full post here.\n\nSeparate paragraphs with a blank line."}
          value={form.content}
          onChange={set("content")}
          required
        />
      </div>

      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
        <button type="submit" className="btn-primary">
          Save Changes
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
