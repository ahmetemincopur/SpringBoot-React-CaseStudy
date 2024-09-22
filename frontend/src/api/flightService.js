// src/api/flightService.js

import axios from "axios";

const API_URL = "http://localhost:8080/api/flights";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };
};

export const getFlights = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const checkForConflicts = async (flightData) => {
  const response = await axios.post(API_URL + "/check-conflicts", flightData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const createFlight = async (flightData) => {
  const response = await axios.post(API_URL, flightData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateFlight = async (id, flightData) => {
  const response = await axios.put(`${API_URL}/${id}`, flightData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteFlight = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
