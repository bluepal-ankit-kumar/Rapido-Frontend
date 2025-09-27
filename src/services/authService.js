export function login(email, password) {
	// Simulate login
	if (email && password) {
		return { user: { email, name: 'Demo User', role: 'customer' } };
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
