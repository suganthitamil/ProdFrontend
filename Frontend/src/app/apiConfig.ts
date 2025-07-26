const API_BASE = "http://34.102.80.30:4000/api";

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE}/products`,
  PRODUCT_DETAILS: (internalId: string) => `${API_BASE}/products/${internalId}`,
  PRODUCTS_SEARCH: `${API_BASE}/products`,
  CATEGORIES: `${API_BASE}/products/categories`,
  LATEST_PRODUCTS: `${API_BASE}/products/latest`,
};

export const IMAGEKIT_BASE = "https://ik.imagekit.io/6qoew00cr/images";
export const IMAGEKIT_BANNERS = `${IMAGEKIT_BASE}/banners`;
export const IMAGEKIT_PRODUCTS = `${IMAGEKIT_BASE}/products`;
    