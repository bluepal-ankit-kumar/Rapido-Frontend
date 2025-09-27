const users = [
	{ id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
];

export function getUsers() {
	return users;
}

export function addUser(name, email) {
	const newUser = { id: users.length + 1, name, email, status: 'Active' };
	users.push(newUser);
	return newUser;
}

export function updateUserStatus(id, status) {
	const user = users.find(u => u.id === id);
	if (user) user.status = status;
	return user;
}
