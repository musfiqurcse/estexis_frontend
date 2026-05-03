import { createContext, useContext, useState } from "react";
import { seedBlogPosts } from "../data/blog";

const STORAGE_KEY = "grihoo_blog_posts";

const BlogContext = createContext(null);

function loadPosts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // corrupted data — fall back to seed
  }
  return seedBlogPosts;
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function generateId(title) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `${slug}-${Date.now()}`;
}

export function BlogProvider({ children }) {
  const [posts, setPosts] = useState(loadPosts);

  function mutate(updater) {
    setPosts((prev) => {
      const next = updater(prev);
      savePosts(next);
      return next;
    });
  }

  function createPost(data) {
    const id = generateId(data.title);
    const post = {
      ...data,
      id,
      slug: id,
      views: 0,
      date: data.date || new Date().toISOString().slice(0, 10),
    };
    mutate((prev) => [...prev, post]);
  }

  function updatePost(id, data) {
    mutate((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  }

  function deletePost(id) {
    mutate((prev) => prev.filter((p) => p.id !== id));
  }

  function getPost(slug) {
    return posts.find((p) => p.slug === slug);
  }

  const publishedPosts = posts.filter((p) => p.status === "published");

  return (
    <BlogContext.Provider
      value={{ posts, publishedPosts, getPost, createPost, updatePost, deletePost }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used within BlogProvider");
  return ctx;
}
