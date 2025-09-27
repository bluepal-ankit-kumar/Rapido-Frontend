export function formatCurrency(val) {
	return `₹${Number(val).toLocaleString('en-IN')}`;
}

export function formatDate(dateStr) {
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function sum(arr) {
	return arr.reduce((a, b) => a + b, 0);
}
