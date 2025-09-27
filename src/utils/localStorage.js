export function save(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

export function load(key) {
	const val = localStorage.getItem(key);
	try {
		return JSON.parse(val);
	} catch {
		return val;
	}
}

export function remove(key) {
	localStorage.removeItem(key);
}
