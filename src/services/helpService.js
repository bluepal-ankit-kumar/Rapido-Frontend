const helpRequests = [
	{ id: 1, user: 'John Doe', issue: 'Payment failed', status: 'Open' },
	{ id: 2, user: 'Jane Smith', issue: 'Ride not found', status: 'Resolved' },
];

export function getHelpRequests() {
	return helpRequests;
}

export function submitHelpRequest(user, issue) {
	const newRequest = { id: helpRequests.length + 1, user, issue, status: 'Open' };
	helpRequests.push(newRequest);
	return newRequest;
}

export function resolveHelpRequest(id) {
	const req = helpRequests.find(r => r.id === id);
	if (req) req.status = 'Resolved';
	return req;
}
