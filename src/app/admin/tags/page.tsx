"use client";

import { useState, useEffect } from "react";
import TagForm from "@/components/TagForm";
import TagList from "@/components/TagList";

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    fetchTags();
  }, []);
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags");
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Tags</h1>
      <div className={`flex ${isMobile ? "grid gap-6" : "flex-col gap-6"}`}>
        <TagForm />
        <TagList tags={tags} />
      </div>
    </div>
  );
}
