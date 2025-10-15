import api from './api';

/* ===========================
   ✅ HELP REQUEST SERVICE (Fully Correct)
   =========================== */

/**
 * ✅ Get all help requests
 * Backend: GET /help/all
 * Requires JWT in headers
 */
export async function getHelpRequests(jwt) {
  const headers = jwt ? { Authorization: `Bearer ${jwt.replace(/^Bearer /, '')}` } : {};
  const response = await api.get('/help/all', { headers });
  return response.data; // List<HelpResponseDto>
}

/**
 * ✅ Create a new help request
 * Backend: POST /help/create
 * Requires JWT + HelpRequestDto in body
 *
 * NOTE:
 * - Backend expects category as ENUM (UPPERCASE)
 * - issue is required
 * - userId comes automatically from JWT (backend handles it)
 * - priority/status are set by backend
 */
export async function createHelpRequest(jwt, requestDto) {
  const payload = {
    issue: requestDto.issue,
    category: (requestDto.category || '').toUpperCase(), // ✅ enum-safe
  };

  const headers = jwt ? { Authorization: `Bearer ${jwt.replace(/^Bearer /, '')}` } : {};
  const response = await api.post('/help/create', payload, { headers });
  return response.data; // HelpResponseDto with full user info
}