const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Central API service utility for "Creators Hub Foundry"
 */
export const api = {
    // Auth endpoints
    async login(credentials: any) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        // We need to parse json even if status is not ok to get error message and requiresVerification flag
        return res.json();
    },

    async register(userData: any) {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return res.json();
    },

    async getMe(token: string) {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return res.json();
    },

    // Product endpoints
    async getProducts(params?: string) {
        const res = await fetch(`${API_URL}/products${params ? `?${params}` : ''}`);
        return res.json();
    },

    async getProduct(id: string) {
        const res = await fetch(`${API_URL}/products/${id}`);
        return res.json();
    },

    async deleteProduct(id: string, token: string) {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },

    async createProduct(productData: any, token: string) {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        return res.json();
    },

    async updateProduct(id: string, productData: any, token: string) {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        return res.json();
    },

    // Order endpoints
    async createOrder(orderData: any, token: string) {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        return res.json();
    },

    async getMyOrders(token: string) {
        const res = await fetch(`${API_URL}/orders/myorders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },

    async getOrderById(id: string, token: string) {
        const res = await fetch(`${API_URL}/orders/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },

    async getOrders(token: string) {
        const res = await fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },

    async updateOrderToDelivered(id: string, token: string) {
        const res = await fetch(`${API_URL}/orders/${id}/deliver`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },

    async getUsers(token: string) {
        const res = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },

    async updateUserRole(userId: string, role: string, password: string, token: string) {
        const res = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ role, password })
        });
        return res.json();
    },

    async deleteUser(userId: string, password: string, token: string) {
        const res = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password })
        });
        return res.json();
    },

    async updateProfile(profileData: any, token: string) {
        const res = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });
        return res.json();
    },

    async verifyPassword(password: string, token: string) {
        const res = await fetch(`${API_URL}/auth/verify-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password })
        });
        return res.json();
    },

    async forgotPassword(email: string) {
        const res = await fetch(`${API_URL}/auth/forgotpassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return res.json();
    },

    async resetPassword(token: string, password: string) {
        const res = await fetch(`${API_URL}/auth/resetpassword/${token}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        return res.json();
    },

    async verifyEmail(email: string, code: string) {
        const res = await fetch(`${API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });
        return res.json();
    },

    async resendVerification(email: string) {
        const res = await fetch(`${API_URL}/auth/resend-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return res.json();
    },

    async getAnalytics(token: string) {
        const res = await fetch(`${API_URL}/analytics`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },

    // Settings endpoints
    async getSettings() {
        const res = await fetch(`${API_URL}/settings`);
        return res.json();
    },

    async updateSettings(settingsData: any, token: string) {
        const res = await fetch(`${API_URL}/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(settingsData)
        });
        return res.json();
    },

    async uploadImage(formData: FormData) {
        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        
        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Upload failed');
        }
        
        return data.url; // Returns the Cloudinary URL
    }
};
