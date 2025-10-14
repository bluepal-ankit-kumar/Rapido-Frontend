import api from './api';

/* ===========================
   ✅ HELP REQUEST APIS
   =========================== */

// Get all help requests with filters + pagination
export async function getHelpRequests({ search, status, category, priority, page = 0, size = 10 }) {
  const params = {};

  if (search) params.search = search;
  if (status) params.status = status;
  if (category) params.category = category;
  if (priority) params.priority = priority;
  params.page = page;
  params.size = size;

  const response = await api.get('/help/all', { params });
  return response.data; // Page<HelpResponseDto>
}

// Create a help request
export async function createHelpRequest(requestDto) {
  const response = await api.post('/help/create', requestDto);
  return response.data; // HelpResponseDto
}

// Update help request
export async function updateHelpRequest(id, requestDto) {
  const response = await api.put(`/help/update/${id}`, requestDto);
  return response.data;
}

// Delete help request
export async function deleteHelpRequest(id) {
  await api.delete(`/help/delete/${id}`);
}

// Get help request by ID
export async function getHelpRequestById(id) {
  const response = await api.get(`/help/${id}`);
  return response.data;
}


/* ===========================
   ✅ FAQ APIS
   =========================== */

// Create FAQ
export async function createFaq(requestDto) {
  const response = await api.post('/faqs/create', requestDto);
  return response.data;
}

// Update FAQ
export async function updateFaq(id, requestDto) {
  const response = await api.put(`/faqs/update/${id}`, requestDto);
  return response.data;
}

// Delete FAQ
export async function deleteFaq(id) {
  await api.delete(`/faqs/delete/${id}`);
}

// Get FAQ by ID
export async function getFaqById(id) {
  const response = await api.get(`/faqs/${id}`);
  return response.data;
}

// Get all FAQs with pagination
export async function getAllFaqs(page = 0, size = 10) {
  const response = await api.get('/faqs/all', { params: { page, size } });
  return response.data;
}

// Set FAQ active/inactive
export async function setFaqStatus(id, active) {
  const response = await api.patch(`/faqs/status/${id}`, null, {
    params: { active }
  });
  return response.data;
}