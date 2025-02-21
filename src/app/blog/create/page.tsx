"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Category } from "@/types/category";
import type { Tag } from "@/types/tag";

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImage: null as File | null,
    categoryId: "",
    selectedTags: Array<string>(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch("/api/category"),
          fetch("/api/tags"),
        ]);

        if (!categoriesRes.ok || !tagsRes.ok) {
          throw new Error("Failed to fetch categories or tags");
        }

        const categoriesData = await categoriesRes.json();
        const tagsData = await tagsRes.json();

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setTags(Array.isArray(tagsData) ? tagsData : []);
      } catch (error) {
        console.error("Error fetching categories and tags:", error);
      }
    };

    fetchCategoriesAndTags();
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You need to be signed in to create a post.</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value, // No need to convert categoryId to number
    }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    ).filter((tag) => tag !== "");

    setFormData((prev) => ({ ...prev, selectedTags: selectedOptions }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, coverImage: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("formData:", formData);
    setIsSubmitting(true);
    try {
      let imageUrl = "";
      if (formData.coverImage) {
        const formDataImage = new FormData();
        formDataImage.append("file", formData.coverImage);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataImage,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(
            `Image upload failed: ${errorText || uploadResponse.statusText}`,
          );
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      const postResponse = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          coverImage: imageUrl,
          categoryId: formData.categoryId,
          tagIds: formData.selectedTags.map((tag) =>
            Array.isArray(tag) ? tag[0] : tag,
          ),
        }),
      });

      if (!postResponse.ok) {
        const errorText = await postResponse.text();
        throw new Error(
          `Post creation failed: ${errorText || postResponse.statusText}`,
        );
      }

      console.log("📌 Sending Data:", {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        coverImage: imageUrl,
        categoryId: formData.categoryId,
        tagIds: formData.selectedTags.map((tag) =>
          Array.isArray(tag) ? tag[0] : tag,
        ),
      });

      const postData = await postResponse.json();
      router.push(`/blog/${postData.post.slug}`);
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            name="categoryId"
            id="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value={""}>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Tags (Multiple)
          </label>
          <select
            name="tags"
            id="tags"
            multiple
            value={formData.selectedTags}
            onChange={handleTagChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            size={4}
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Hold Ctrl (Cmd on Mac) to select multiple tags
          </p>
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700"
          >
            Summary
          </label>
          <textarea
            name="excerpt"
            id="excerpt"
            required
            value={formData.excerpt}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={3}
            maxLength={100}
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            name="content"
            id="content"
            required
            value={formData.content}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={10}
          />
        </div>

        <div>
          <label
            htmlFor="coverImage"
            className="block text-sm font-medium text-gray-700"
          >
            Cover Image
          </label>
          <input
            type="file"
            name="coverImage"
            id="coverImage"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
