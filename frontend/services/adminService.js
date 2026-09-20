const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getAuthHeader() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('osmium_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetch Admin Metrics (Revenue, Orders, Products, Low Stock)
 */
export async function fetchAdminMetrics() {
  try {
    const res = await fetch(`${API_URL}/admin/metrics`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch admin metrics: ${res.statusText}`);
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('[adminService] Error fetching metrics:', error);
    return null;
  }
}

/**
 * Fetch Admin Customers List
 */
export async function fetchAdminCustomers() {
  try {
    const res = await fetch(`${API_URL}/admin/customers`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch customers: ${res.statusText}`);
    }

    const data = await res.json();
    return data.data.customers;
  } catch (error) {
    console.error('[adminService] Error fetching customers:', error);
    return [];
  }
}

/**
 * Create Product (Admin Mutation)
 */
export async function createProductAdmin(productData) {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data.errors
        ? Object.entries(data.errors).map(([k, v]) => `${k}: ${v}`).join('; ')
        : data.message || 'Failed to create product';
      throw new Error(errMsg);
    }

    return { success: true, data: data.data?.product };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update Product (Admin Mutation)
 */
export async function updateProductAdmin(productId, productData) {
  try {
    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data.errors
        ? Object.entries(data.errors).map(([k, v]) => `${k}: ${v}`).join('; ')
        : data.message || 'Failed to update product';
      throw new Error(errMsg);
    }

    return { success: true, data: data.data?.product };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete Product (Admin Mutation)
 */
export async function deleteProductAdmin(productId) {
  try {
    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete product');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
