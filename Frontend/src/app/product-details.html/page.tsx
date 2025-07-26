"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import ProductCard, { Product } from "../components/ProductCard";
import Link from "next/link";
import { API_ENDPOINTS } from "../apiConfig";
import { IMAGEKIT_PRODUCTS } from "../apiConfig";

export default function ProductDetailsPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-blue-500">Loading product details...</div>}>
      <ProductDetails />
    </Suspense>
  );
}

function normalizeProduct(data: unknown): Product {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid product data");
  }
  const obj = data as Record<string, unknown>;
  return {
    id: Number(obj.id ?? obj.Index ?? obj.index),
    name: String(obj.name ?? obj.Name ?? "") || "",
    brand: String(obj.brand ?? obj.Brand ?? "") || "",
    category: String(obj.category ?? obj.Category ?? "") || "",
    price: Number(obj.price ?? obj.Price ?? 0),
    stock: Number(obj.stock ?? obj.Stock ?? 0),
    image: String(obj.image ?? obj.Image ?? "") || "",
    internalId: String(obj.internalId ?? obj.InternalId ?? "") || "",
    color: obj.color !== undefined ? String(obj.color) : obj.Color !== undefined ? String(obj.Color) : undefined,
    size: obj.size !== undefined ? String(obj.size) : obj.Size !== undefined ? String(obj.Size) : undefined,
    EAN: obj.ean !== undefined ? String(obj.ean) : obj.EAN !== undefined ? String(obj.EAN) : undefined,
    description: obj.description !== undefined ? String(obj.description) : obj.Description !== undefined ? String(obj.Description) : undefined,
  };
}

function ProductDetails() {
  const searchParams = useSearchParams();
  const internalId = searchParams.get("internalId");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [wishlist, setWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [showAddedMsg, setShowAddedMsg] = useState(false);

  useEffect(() => {
    if (!internalId) return;
    setLoading(true);
    setError(null);
    const url = API_ENDPOINTS.PRODUCT_DETAILS(internalId);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch product details");
        return res.json();
      })
      .then(data => {
        setLoading(false);
        const normalizedProduct = normalizeProduct(data);
        setProduct(normalizedProduct);
        // Fetch related products from the same category
        if (normalizedProduct.category && normalizedProduct.category.trim() !== "") {
          const relatedUrl = `${API_ENDPOINTS.PRODUCTS}?category=${encodeURIComponent(normalizedProduct.category)}`;
          fetch(relatedUrl)
            .then(r => r.json())
            .then(rdata => {
              let products: unknown[] = [];
              if (Array.isArray(rdata)) {
                products = rdata;
              } else if (Array.isArray(rdata.products)) {
                products = rdata.products;
              } else if (Array.isArray(rdata.data)) {
                products = rdata.data;
              }
              const normalizedRelated = products
                .map(normalizeProduct)
                .filter((p: Product) => String(p.internalId) !== String(normalizedProduct.internalId));
              // Shuffle and take up to 5
              const shuffled = normalizedRelated.sort(() => 0.5 - Math.random());
              setRelatedProducts(shuffled.slice(0, 5));
            });
        }
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [internalId]);

  if (!internalId) {
    return <p className="text-red-500">Invalid product Internal ID</p>;
  }

  if (loading) {
    return <p className="text-blue-500">Loading product details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!product) {
    return <p className="text-red-500">Product not found</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm flex items-center space-x-2">
        <Link href="/" className="text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors">Home</Link>
        <span className="text-gray-300">&gt;</span>
        <Link href="/products.html" className="text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors">Products</Link>
        <span className="text-gray-300">&gt;</span>
        <span className="text-blue-600 font-bold">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left - Large Image */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 flex items-center justify-center mb-6 md:mb-0 h-80">
          {product.image && (
            <div className="relative w-full h-full">
              <Image
                src={`${IMAGEKIT_PRODUCTS}/${product.image}`}
                alt={product.name}
                fill
                className="object-contain rounded-xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>

        {/* Right - Info Card */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h1 className="text-3xl font-extrabold mb-2 text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-indigo-600">${product.price}</span>
              <span className="line-through text-gray-400 text-lg">${(product.price * 1.25).toFixed(0)}</span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">20% OFF</span>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-700">
              <div><span className="font-semibold">SKU</span><br />{product.id}</div>
              <div><span className="font-semibold">CATEGORY</span><br />{product.category}</div>
              <div><span className="font-semibold">COLOR</span><br />{product.color || "-"}</div>
              <div><span className="font-semibold">SIZE</span><br />{product.size || "-"}</div>
              <div><span className="font-semibold">BRAND</span><br />{product.brand}</div>
              <div><span className="font-semibold">EAN</span><br />{product.EAN || "-"}</div>
            </div>
            <div
              className="mb-4 text-gray-600"
              dangerouslySetInnerHTML={{ __html: product.description || "No description available." }}
            />
            {/* Stock/Alert Message */}
            {product.stock < 50 ? (
              <div className="bg-yellow-100 text-yellow-800 rounded-lg px-4 py-2 mb-4 flex items-center font-semibold">
                <span className="mr-2">⚠️</span> Limited Stock ({product.stock} remaining)
              </div>
            ) : (
              <div className="bg-green-100 text-green-700 rounded-lg px-4 py-2 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                In Stock ({product.stock} available)
              </div>
            )}
            <div className="flex items-center mb-4">
              <span className="mr-4 font-semibold">Quantity:</span>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-200 rounded-l-lg text-lg font-bold hover:bg-gray-300"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                min={1}
                max={product.stock < 10 ? product.stock : 10}
                onChange={e => setQuantity(Math.min(product.stock < 10 ? product.stock : 10, Math.max(1, Number(e.target.value))))}
                className="w-12 text-center border-t border-b border-gray-200 focus:outline-none"
              />
              <button
                onClick={() => setQuantity(q => Math.min(product.stock < 10 ? product.stock : 10, q + 1))}
                className="px-3 py-1 bg-gray-200 rounded-r-lg text-lg font-bold hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowAddedMsg(true);
                  setTimeout(() => setShowAddedMsg(false), 2000);
                }}
                className="flex-1 bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-indigo-600 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 008.48 18h7.04a2 2 0 001.83-2.7L17 13M7 13V6h13" /></svg>
                Add to Cart
              </button>
              {showAddedMsg && (
                <div className="mt-2 text-green-600 font-semibold text-center">Added to cart!</div>
              )}
              <button
                className={`flex-1 border-2 border-indigo-300 px-6 py-3 rounded-lg font-semibold shadow hover:bg-indigo-50 transition-colors flex items-center justify-center ${wishlist ? 'bg-red-50 border-red-300' : 'text-indigo-500'}`}
                onClick={() => setWishlist(w => !w)}
              >
                <svg className={`w-5 h-5 mr-2 transition-colors ${wishlist ? 'text-red-500 fill-red-500' : 'text-indigo-300'}`} fill={wishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs go here, outside the flex row */}
      <div className="bg-white rounded-2xl shadow p-6 mt-6">
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab("description")}
            className={`flex-1 py-2 text-lg font-semibold rounded-tl-2xl focus:outline-none transition-colors ${activeTab === "description" ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50" : "text-gray-400"}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`flex-1 py-2 text-lg font-semibold rounded-tr-2xl focus:outline-none transition-colors ${activeTab === "specifications" ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50" : "text-gray-400"}`}
          >
            Specifications
          </button>
        </div>
        {activeTab === "description" && (
          <div className="text-gray-700">
            <p className="mb-2"><span className="font-bold">Product Description</span></p>
            <p className="mb-2"><span className="font-semibold">{product.name}</span> is a top product in our <span className="italic">{product.category}</span> category.</p>
            <p className="mb-2">Price: <span className="font-semibold">${product.price} (USD)</span></p>
            <p className="mb-2">Brand: <span className="font-semibold">{product.brand}</span></p>
            <p className="mb-2">Available in color: <span className="italic">{product.color || "-"}</span>, size: <span className="italic">{product.size || "-"}</span></p>
            <p className="mb-2">Stock status: <span className="text-green-600 font-semibold">{product.stock} units left.</span></p>
            <p className="mb-2">EAN: <span className="font-mono">{product.EAN || "-"}</span></p>
            <div className="mb-2" dangerouslySetInnerHTML={{ __html: product.description || "This premium product offers exceptional quality and value, designed to meet your specific needs with attention to detail and craftsmanship." }} />
          </div>
        )}
        {activeTab === "specifications" && (
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-200 w-full text-gray-700">
              <tbody>
                {Object.entries(product).map(([key, val]) => (
                  typeof val !== 'object' && (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="px-4 py-2 font-semibold whitespace-nowrap">{key}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{val?.toString()}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Related Products */}
      <section className="mt-14">
        <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-10 mt-8 tracking-wide">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {relatedProducts.map((p: Product) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
