"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IMAGEKIT_PRODUCTS } from "../apiConfig";

export interface Product {
  id: number;
  image: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  internalId: string;
  color?: string;
  size?: string;
  EAN?: string;
  description?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [showAddedMsg, setShowAddedMsg] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start transition-shadow hover:shadow-xl">
      {product.image && (
        <div className="relative w-full h-36 mb-4">
          <Image
            src={`${IMAGEKIT_PRODUCTS}/${product.image}`}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="h-12 mb-1">
        <h3
          className="font-bold text-lg text-gray-800 line-clamp-2 overflow-hidden"
          title={product.name}
        >
          {product.name}
        </h3>
      </div>
      <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
      <p className="text-xs text-gray-400 mb-2">{product.category}</p>
      <p className="font-bold text-indigo-600 text-lg mb-1">
        {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : 'N/A'}
      </p>
      <div className="flex w-full justify-between items-center mb-2">
        <p className="text-sm text-green-600">{product.stock} in stock</p>
        <span className="text-xs text-gray-400">ID: {product.id}</span>
      </div>
      <div className="flex w-full items-center gap-2 mt-2">
        <button
          className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded text-sm font-semibold shadow hover:bg-indigo-600 transition-colors"
          onClick={() => {
            setShowAddedMsg(true);
            setTimeout(() => setShowAddedMsg(false), 2000);
          }}
        >
          Add to Cart
        </button>
        <Link
          href={`/product-details.html?internalId=${product.internalId}`}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-semibold shadow hover:bg-gray-200 transition-colors text-center"
        >
          View
        </Link>
      </div>
      {showAddedMsg && (
        <div className="mt-2 text-green-600 font-semibold text-center text-sm">Added to cart!</div>
      )}
    </div>
  );
}
