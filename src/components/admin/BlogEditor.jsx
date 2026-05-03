import { useState } from "react";

const EMPTY = {
  title: "",
  excerpt: "",
  body: "",
  coverImage: "",
  author: "Grihoo Editorial",
  tagsInput: "",
  date: new Date().toISOString().slice(0, 10),
  status: "draft",
};

function fromPost(post) {
  return {
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    coverImage: post.coverImage || "",
    author: post.author,
    tagsInput: post.tags.join(", "),
    date: post.date,
    status: post.status,
  };
}

export function BlogEditor({ post, onSave, onCancel }) {
  const [form, setForm] = useState(post ? fromPost(post) : EMPTY);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const tags = form.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ ...form, tags });
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
          Excerpt
        </label>
        <textarea
          className="input-field resize-none"
          rows={2}
          placeholder="Short summary shown on the blog list page"
          value={form.excerpt}
          onChange={set("excerpt")}
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Body
        </label>
        <textarea
          className="input-field resize-y"
          rows={10}
          placeholder={"Write the full post here.\n\nSeparate paragraphs with a blank line."}
          value={form.body}
          onChange={set("body")}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Cover Image URL
          </label>
          <input
            className="input-field"
            placeholder="https://images.unsplash.com/..."
            value={form.coverImage}
            onChange={set("coverImage")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Author
          </label>
          <input
            className="input-field"
            placeholder="Author name"
            value={form.author}
            onChange={set("author")}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Tags (comma-separated)
          </label>
          <input
            className="input-field"
            placeholder="Berlin, Buying Guide, Germany"
            value={form.tagsInput}
            onChange={set("tagsInput")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Date
          </label>
          <input
            type="date"
            className="input-field"
            value={form.date}
            onChange={set("date")}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Status
        </label>
        <div className="flex items-center gap-4">
          {["draft", "published"].map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="status"
                value={s}
                checked={form.status === s}
                onChange={set("status")}
                className="accent-[#164b3f]"
              />
              <span className="capitalize text-gray-700">{s}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
        <button type="submit" className="btn-primary">
          {post ? "Update Post" : "Create Post"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
