import axios from 'axios';

const API_URL = 'http://localhost:8001/api';

export const getStats = async () => {
  const res = await axios.get(`${API_URL}/stats`);
  return res.data;
};

export const getChallenges = async () => {
  const res = await axios.get(`${API_URL}/challenges`);
  return res.data;
};

export const getChallenge = async (id: number) => {
  const res = await axios.get(`${API_URL}/challenges/${id}`);
  return res.data;
};

export const getStartups = async () => {
  const res = await axios.get(`${API_URL}/startups`);
  return res.data;
};

export const getPilots = async () => {
  const res = await axios.get(`${API_URL}/pilots`);
  return res.data;
};

export const getPilot = async (id: number) => {
  const res = await axios.get(`${API_URL}/pilots/${id}`);
  return res.data;
};

export const structureChallenge = async (raw_text: string) => {
  const res = await axios.post(`${API_URL}/ai/structure-challenge`, { raw_text });
  return res.data;
};

export const getAiAssistantResponse = async (context: string, question: string) => {
  const res = await axios.post(`${API_URL}/ai/assistant`, { context, question });
  return res.data.response;
};

export const validatePilot = async (id: number) => {
  const res = await axios.post(`${API_URL}/pilots/${id}/validate`);
  return res.data;
};
