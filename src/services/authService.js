
import { mockUsers } from '../data/mockData.js';

export function login(email, password) {
	// Check credentials against mockUsers
	const user = mockUsers.find(u => u.email === email && u.password === password);
	if (user) {
		return { user };
	}
	return { user: null };
}

export function register(name, email, password) {
	// Simulate registration
	if (name && email && password) {
		return { user: { name, email, role: 'customer' } };
	}
	return { user: null };
}

export function logout() {
	// Simulate logout
	return { success: true };
}
