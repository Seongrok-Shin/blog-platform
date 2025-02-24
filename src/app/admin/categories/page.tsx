"use client";

import { useState, useEffect } from "react";
import CategoryForm from "@/components/CategoryForm";
import CategoryList from "@/components/CategoryList";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      <div className="grid gap-6">
        <CategoryForm />
        <CategoryList categories={categories} />
      </div>
    </div>
  );
}
