import axios from 'axios';

export const sendMessage = async (message: string) => {
  try {
    const response = await axios.post('http://localhost:5000/api/chat', {
      message,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Please log in to use the chatbot');
      } else if (error.response?.status === 500) {
        throw new Error('The chatbot is currently unavailable. Please try again later.');
      }
    }
    throw new Error('An unexpected error occurred. Please try again later.');
  }
}; 