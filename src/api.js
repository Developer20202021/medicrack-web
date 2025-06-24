// frontend/src/api.js
const API_BASE_URL = 'https://medicrack-web-exam-496984660515.asia-south1.run.app/api'; // আপনার Flask API এর URL



export const registerUser = async (name, email, phone, password, college) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone, password, college }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
    }
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userId', data.user_id);
    return data;
  } catch (error) {
    console.error("রেজিস্ট্রেশন এরর:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'লগইন ব্যর্থ হয়েছে');
    }
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userId', data.user_id);
    return data;
  } catch (error) {
    console.error("লগইন এরর:", error);
    throw error;
  }
};

// --- নতুন API কল: অনন্য SubjectName গুলো আনার জন্য ---
export const getUniqueSubjects = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('কোনো অথেন্টিকেশন টোকেন পাওয়া যায়নি।');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'বিষয় তালিকা আনতে ব্যর্থ হয়েছে');
    }
    return data;
  } catch (error) {
    console.error("বিষয় তালিকা আনতে এরর:", error);
    throw error;
  }
};

// --- getExams ফাংশন আপডেট করা হয়েছে ফিল্টার এবং পেজিনেশন প্যারামিটার সহ ---
export const getExams = async (subjectFilter = null, page = 1, perPage = 10) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('কোনো অথেন্টিকেশন টোকেন পাওয়া যায়নি।');
  }
  let url = `${API_BASE_URL}/exams?page=${page}&per_page=${perPage}`;
  if (subjectFilter) {
    url += `&subject=${encodeURIComponent(subjectFilter)}`;
  }
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'পরীক্ষা আনতে ব্যর্থ হয়েছে');
    }
    return data; // এতে exams, totalExams, currentPage, perPage, totalPages থাকবে
  } catch (error) {
    console.error("পরীক্ষা আনতে এরর:", error);
    throw error;
  }
};

export const getExamMcqs = async (examId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('কোনো অথেন্টিকেশন টোকেন পাওয়া যায়নি।');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/exams/${examId}/mcqs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'MCQ আনতে ব্যর্থ হয়েছে');
    }
    return { examDetails: data.examDetails, mcqs: data.mcqs };
  } catch (error) {
    console.error("MCQ আনতে এরর:", error);
    throw error;
  }
};

export const submitExamResult = async (examId, resultData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('কোনো অথেন্টিকেশন টোকেন পাওয়া যায়নি।');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/exams/${examId}/submit_result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(resultData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'ফলাফল জমা দিতে ব্যর্থ হয়েছে');
    }
    return data;
  } catch (error) {
    console.error("ফলাফল জমা দিতে এরর:", error);
    throw error;
  }
};

export const getExamResult = async (examId, userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('কোনো অথেন্টিকেশন টোকেন পাওয়া যায়নি।');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/exams/${examId}/result/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'ফলাফল আনতে ব্যর্থ হয়েছে');
    }
    return data;
  } catch (error) {
    console.error("ফলাফল আনতে এরর:", error);
    throw error;
  }
};



// frontend/src/api.js (আপনার বিদ্যমান কোডের সাথে যোগ করুন)

// ... আপনার বিদ্যমান registerUser, loginUser, getExams, getExamMcqs, submitExamResult, getExamResult ফাংশনগুলো এখানে থাকবে ...

export const getTeachers = async () => {
  // const token = localStorage.getItem('token');
  // if (!token) {
  //   throw new Error('কোনো অথেন্টিকেশন টোকেন পাওয়া যায়নি।');
  // }
  try {
    const response = await fetch(`${API_BASE_URL}/teachers`, {
      // headers: {
      //   'Authorization': `Bearer ${token}`,
      // },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'শিক্ষকদের তথ্য আনতে ব্যর্থ হয়েছে');
    }
    return data;
  } catch (error) {
    console.error("শিক্ষকদের তথ্য আনতে এরর:", error);
    throw error;
  }
};

export const getCourses = async () => {
  // const token = localStorage.getItem('token');
  // if (!token) {
  //   throw new Error('কোনো অথেন্টিকেশন টোকেন পাওয়া যায়নি।');
  // }
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      // headers: {
      //   'Authorization': `Bearer ${token}`,
      // },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'কোর্সের তথ্য আনতে ব্যর্থ হয়েছে');
    }
    return data;
  } catch (error) {
    console.error("কোর্সের তথ্য আনতে এরর:", error);
    throw error;
  }
};







// JWT টোকেন পাওয়ার জন্য একটি হেল্পার ফাংশন
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // টোকেনটি localStorage থেকে আনুন
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// --- QBanks API ফাংশন ---
export const getQBanks = async (page = 1, per_page = 10) => {
  try {
    const params = new URLSearchParams({ page, per_page });
    const response = await fetch(`${API_BASE_URL}/qbanks?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'QBanks আনতে সমস্যা');
    }
    return data;
  } catch (error) {
    console.error('Error fetching QBanks:', error);
    throw error;
  }
};

export const getQBankSubjects = async (qbankId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/qbanks/${qbankId}/subjects`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || `QBank ${qbankId} এর Subjects আনতে সমস্যা`);
    }
    return data;
  } catch (error) {
    console.error(`Error fetching subjects for QBank ${qbankId}:`, error);
    throw error;
  }
};

export const getQBankSubjectExams = async (qbankId, subjectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/qbanks/${qbankId}/subjects/${subjectId}/exams`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || `QBank ${qbankId}, Subject ${subjectId} এর Exams আনতে সমস্যা`);
    }
    return data;
  } catch (error) {
    console.error(`Error fetching exams for QBank ${qbankId}, Subject ${subjectId}:`, error);
    throw error;
  }
};

export const getMainExamDetails = async (examId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/main_exams/${examId}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || `Main Exam ${examId} এর বিস্তারিত তথ্য আনতে সমস্যা`);
    }
    return data;
  } catch (error) {
    console.error(`Error fetching main exam details for ${examId}:`, error);
    throw error;
  }
};

export const getMainExamMCQs = async (examId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/main_exams/${examId}/mcqs`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || `Main Exam ${examId} এর MCQ আনতে সমস্যা`);
    }
    return data;
  } catch (error) {
    console.error(`Error fetching MCQs for main exam ${examId}:`, error);
    throw error;
  }
};