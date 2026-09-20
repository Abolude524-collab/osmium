const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Service to fetch paginated/filtered products from backend REST API
 */
export async function fetchProducts(params = {}) {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });

    const res = await fetch(`${API_URL}/products?${query.toString()}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('[productService] Error fetching products:', error);
    return { status: 'error', results: 0, pagination: {}, data: { products: [] } };
  }
}

/**
 * Service to fetch a single product by SEO slug
 */
export async function fetchProductBySlug(slug) {
  try {
    const res = await fetch(`${API_URL}/products/slug/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data.product;
  } catch (error) {
    console.error(`[productService] Error fetching product for slug '${slug}':`, error);
    return null;
  }
}

/**
 * Service to fetch a single product by MongoDB ID
 */
export async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data.product;
  } catch (error) {
    console.error(`[productService] Error fetching product for ID '${id}':`, error);
    return null;
  }
}

/**
 * Service to fetch all active categories
 */
export async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data.categories;
  } catch (error) {
    console.error('[productService] Error fetching categories:', error);
    return [];
  }
}
