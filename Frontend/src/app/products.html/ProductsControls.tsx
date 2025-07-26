"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../apiConfig";

export default function ProductsControls() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortKey, setSortKey] = useState(searchParams.get("sortKey") || "name");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    fetch(API_ENDPOINTS.CATEGORIES)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  // Debounce search/category/sort input
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      if (sortKey) params.set("sortKey", sortKey);
      if (category) params.set("category", category);
      else params.delete("category");
      router.push(`?${params.toString()}`);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [search, sortKey, category]);

  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by ID, name, brand, or category"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded pl-9 pr-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <select
        value={sortKey}
        onChange={e => setSortKey(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="price-asc">Price (Low to High)</option>
        <option value="price-desc">Price (High to Low)</option>
        <option value="brand-asc">Brand (A-Z)</option>
        <option value="stock-desc">Stock (High to Low)</option>
      </select>
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">All Categories</option>
        {Array.isArray(categories) && categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
} 