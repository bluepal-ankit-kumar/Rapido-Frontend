// import api from './api';

// /* ===========================
//    ✅ HELP REQUEST APIS
//    =========================== */

// // Get all help requests with filters + pagination
// export async function getHelpRequests(token) {
//   console.log("token: ",token)

//   const response = await api.get("/help/all");
//       console.log("response from help all endpoint:- ",response)

  

//   // const response = await api.get('/help/all');
//   return response.data; // Page<HelpResponseDto>
// }

// // Create a help request
// export async function createHelpRequest(requestDto) {
//   console.log("requestDto:- ",requestDto);
//   console.log("category:- ",requestDto.category);
//   const payload={
//     "category":requestDto.category.toUpperCase(),
//     "issue":requestDto.issue
//   }
//   console.log("payload:- ",payload)
  
  
//   const response = await api.post('/help/create', payload);
//   console.log("response:- ",response);
//   return response.data; // HelpResponseDto
// }

// // Update help request

// export async function updateHelpRequest(id, requestDto) {
//   try {
//     const token = localStorage.getItem('jwtToken');
//     const response = await api.put(`/help/update/${id}`, requestDto, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating help request:", error);
//     throw error;
//   }
// }

// // Delete help request
// export async function deleteHelpRequest(id) {
//   await api.delete(`/help/delete/${id}`);
// }

// // Get help request by ID
// export async function getHelpRequestById(id) {
//   const response = await api.get(`/help/requests/${id}`,{
//     headers:{
//       Authorization:`Bearer ${localStorage.getItem('jwtToken')}`
//     }
//   });
//   return response.data;
// }


// /* ===========================
//    ✅ FAQ APIS
//    =========================== */

// // Create FAQ
// export async function createFaq(requestDto) {
//   const response = await api.post('/faqs/create', requestDto);
//   return response.data;
// }

// // Update FAQ
// export async function updateFaq(id, requestDto) {
//   const response = await api.put(`/faqs/update/${id}`, requestDto);
//   return response.data;
// }

// // Delete FAQ
// export async function deleteFaq(id) {
//   await api.delete(`/faqs/delete/${id}`);
// }

// // Get FAQ by ID
// export async function getFaqById(id) {
//   const response = await api.get(`/faqs/${id}`);
//   return response.data;
// }

// // Get all FAQs with pagination
// export async function getAllFaqs(page = 0, size = 10) {
//   const response = await api.get('/faqs/all', { params: { page, size } });
//   return response.data;
// }

// // Set FAQ active/inactive
// export async function setFaqStatus(id, active) {
//   const response = await api.patch(`/faqs/status/${id}`, null, {
//     params: { active }
//   });
//   return response.data;
// }




import api from './api';

/* ===========================
   ✅ HELP REQUEST APIS
   =========================== */

// Get all help requests
export async function getHelpRequests(token) {
  try {
    const response = await api.get("/help/all", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("response from help all endpoint:- ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching help requests:", error);
    throw error;
  }
}

// Create a help request
export async function createHelpRequest(requestDto) {
  console.log("requestDto:- ", requestDto);
  console.log("category:- ", requestDto.category);
  const payload = {
    "category": requestDto.category.toUpperCase(),
    "issue": requestDto.issue
  };
  console.log("payload:- ", payload);
  
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await api.post('/help/create', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("response:- ", response);
    return response.data;
  } catch (error) {
    console.error("Error creating help request:", error);
    throw error;
  }
}

// Update help request
export async function updateHelpRequest(id, requestDto, token) {
  try {
    console.log("token: ", token);
    console.log("update payload: ", requestDto);
    const response = await api.put(`/help/update/${id}`, requestDto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("update response: ", response);
    return response.data;
  } catch (error) {
    console.error("Error updating help request:", error);
    console.error("Error response:", error.response);
    throw error;
  }
}

// Delete help request
export async function deleteHelpRequest(id) {
  try {
    const token = localStorage.getItem('jwtToken');
    await api.delete(`/help/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error("Error deleting help request:", error);
    throw error;
  }
}

// Get help request by ID
export async function getHelpRequestById(id) {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await api.get(`/help/requests/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching help request by ID:", error);
    throw error;
  }
}

/* ===========================
   ✅ FAQ APIS
   =========================== */

// Create FAQ
export async function createFaq(requestDto) {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await api.post('/faqs/create', requestDto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating FAQ:", error);
    throw error;
  }
}

// Update FAQ
export async function updateFaq(id, requestDto) {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await api.put(`/faqs/update/${id}`, requestDto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw error;
  }
}

// Delete FAQ
export async function deleteFaq(id) {
  try {
    const token = localStorage.getItem('jwtToken');
    await api.delete(`/faqs/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw error;
  }
}

// Get FAQ by ID
export async function getFaqById(id) {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await api.get(`/faqs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQ by ID:", error);
    throw error;
  }
}

// Get all FAQs with pagination
export async function getAllFaqs(page = 0, size = 10) {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await api.get('/faqs/all', { 
      params: { page, size },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all FAQs:", error);
    throw error;
  }
}

// Set FAQ active/inactive
export async function setFaqStatus(id, active) {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await api.patch(`/faqs/status/${id}`, null, {
      params: { active },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error setting FAQ status:", error);
    throw error;
  }
}