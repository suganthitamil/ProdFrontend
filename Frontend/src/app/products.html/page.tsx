import Link from "next/link";
import ProductCard, { Product } from "../components/ProductCard";
import ProductsControls from "./ProductsControls";
import { API_ENDPOINTS } from "../apiConfig";

function isNumeric(str: string): boolean {
  if (typeof str !== "string") return false;
  return !isNaN(Number(str)) && str.trim() !== "";
}

async function getProducts(page: number, limit: number, search: string, category: string) {
  let url = "";
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (category) params.set("category", category);
  if (search) {
     if (isNumeric(search)) {
      params.set("exactIndex", search);
    } else {
      params.set("q", search);
    } 
    url = `${API_ENDPOINTS.PRODUCTS_SEARCH}?${params.toString()}`;
  } else {
    url = `${API_ENDPOINTS.PRODUCTS}?${params.toString()}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}

type RawProduct = {
  Index: number;
  Image: string;
  Name: string;
  Brand: string;
  Category: string;
  Price: number;
  Stock: number;
  InternalId: string;
  Color?: string;
  Size?: string;
  EAN?: string;
  Description?: string;
};

export default async function ProductList({ searchParams }: { searchParams: Promise<{ search?: string; sortKey?: string; page?: string; category?: string }> }) {
  const params = await searchParams;
  const search = params?.search || "";
  const sortKey = params?.sortKey || "name-asc";
  const page = parseInt(params?.page || "1", 10);
  const category = params?.category || "";
  const pageSize = 50;

  const apiResponse = await getProducts(page, pageSize, search, category);

  let products: Product[] = [];
  let totalPages = 1;
  let total = 0;

  if (Array.isArray(apiResponse)) {
    products = apiResponse.map((p: RawProduct) => ({
      id: p.Index,
      image: p.Image,
      name: p.Name,
      brand: p.Brand,
      category: p.Category,
      price: p.Price,
      stock: p.Stock,
      internalId: p.InternalId,
      color: p.Color,
      size: p.Size,
      EAN: p.EAN,
      description: p.Description,
    }));
    total = products.length;
  } else {
    products = (apiResponse.products || []).map((p: RawProduct) => ({
      id: p.Index,
      image: p.Image,
      name: p.Name,
      brand: p.Brand,
      category: p.Category,
      price: p.Price,
      stock: p.Stock,
      internalId: p.InternalId,
      color: p.Color,
      size: p.Size,
      EAN: p.EAN,
      description: p.Description,
    }));
    totalPages = apiResponse.pagination?.totalPages || 1;
    total = apiResponse.pagination?.total || products.length;
  }

  // UI sorting for current page
  switch (sortKey) {
    case "name-asc":
      products = [...products].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      products = [...products].sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "price-asc":
      products = [...products].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products = [...products].sort((a, b) => b.price - a.price);
      break;
    case "brand-asc":
      products = [...products].sort((a, b) => a.brand.localeCompare(b.brand));
      break;
    case "stock-desc":
      products = [...products].sort((a, b) => b.stock - a.stock);
      break;
    default:
      break;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Products</h1>
      <p className="mb-4">Total products: {total}</p>
      <ProductsControls />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6 items-center">
        <Link
          href={`?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${category ? `&category=${encodeURIComponent(category)}` : ""}${sortKey ? `&sortKey=${encodeURIComponent(sortKey)}` : ""}`}
          className={`px-3 py-1 rounded border ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:bg-indigo-50'}`}
          aria-disabled={page === 1}
          tabIndex={page === 1 ? -1 : 0}
        >
          Prev
        </Link>
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i + 1}
            href={`?page=${i + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${category ? `&category=${encodeURIComponent(category)}` : ""}${sortKey ? `&sortKey=${encodeURIComponent(sortKey)}` : ""}`}
            className={`px-3 py-1 rounded border ${page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-indigo-50"}`}
          >
            {i + 1}
          </Link>
        ))}
        <Link
          href={`?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${category ? `&category=${encodeURIComponent(category)}` : ""}${sortKey ? `&sortKey=${encodeURIComponent(sortKey)}` : ""}`}
          className={`px-3 py-1 rounded border ${page === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:bg-indigo-50'}`}
          aria-disabled={page === totalPages}
          tabIndex={page === totalPages ? -1 : 0}
        >
          Next
        </Link>
      </div>
    </>
  );
}
