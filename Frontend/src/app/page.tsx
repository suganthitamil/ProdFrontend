import ImageSlider from "./components/ImageSlider";
import ProductCard, { Product } from "./components/ProductCard";
import { API_ENDPOINTS } from "./apiConfig";

async function getLatestProducts(limit: number = 10) {
  const url = `${API_ENDPOINTS.LATEST_PRODUCTS}?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch latest products");
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

export default async function HomePage() {
  let latestProducts: Product[] = [];
  try {
    const response = await getLatestProducts(10);
    const rawProducts = Array.isArray(response)
      ? response
      : response.products || [];
    latestProducts = rawProducts.map((p: RawProduct) => ({
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
  } catch {
    // Optionally handle error
    latestProducts = [];
  }
  return (
    <>
      <ImageSlider />
      <section>
        <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-10 mt-8 tracking-wide">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {latestProducts.map((product: Product) => {
            return (
              <ProductCard key={product.id} product={product} />
            );
          })}
        </div>
      </section>
    </>
  );
}
