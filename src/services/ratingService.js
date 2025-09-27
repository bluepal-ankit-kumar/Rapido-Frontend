const ratings = [
	{ id: 1, user: 'John Doe', rating: 5, comment: 'Great ride!' },
	{ id: 2, user: 'Jane Smith', rating: 4, comment: 'Smooth experience.' },
];

export function getRatings() {
	return ratings;
}

export function submitRating(user, rating, comment) {
	const newRating = { id: ratings.length + 1, user, rating, comment };
	ratings.push(newRating);
	return newRating;
}
