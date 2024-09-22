import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../components/useAuth"; // Import the useAuth hook
import { Navigate } from "react-router-dom";

const FlightSearch = () => {
  const { isAuthenticated, userRole, isLoading } = useAuth(); // Use the hook to get the user's authentication and role
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState([]);

  // Log role and authentication status
  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    console.log("User Role:", userRole);
  }, [isAuthenticated, userRole]); // This will run whenever isAuthenticated or userRole changes

  // Fetch the user's city from localStorage and set it as the default departure city
  useEffect(() => {
    const city = localStorage.getItem("city"); // Assuming city is stored in localStorage
    if (city) {
      setDeparture(city); // Set the default departure city
      searchFlights(city); // Automatically trigger the search based on the city
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // This runs only once when the component mounts

  const searchFlights = async (city = departure) => {
    try {
      const response = await axios.get("http://localhost:8080/api/flights/search", {
        params: { departure: city, destination, date },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"), // Include the token in the request
        },
      });
      setFlights(response.data);
    } catch (error) {
      console.error("Error searching flights", error);
    }
  };

  // If still loading authentication state, don't render anything or show a loading spinner
  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner, depending on your design
  }

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Uçuş Arama</h1>

      {/* Flight Search Form */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="departure">
            Kalkış Yeri
          </label>
          <input
            id="departure"
            type="text"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            placeholder="Kalkış Yeri"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="destination">
            Varış Yeri
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Varış Yeri"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="date">
            Tarih
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => searchFlights()} // Call searchFlights when manually triggered
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Uçuş Ara
        </button>
      </div>

      {/* Displaying Flight Results */}
      {flights.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sonuçlar</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            {flights.map((flight) => (
              <div key={flight.id} className="border-b border-gray-200 py-2">
                <p className="text-gray-700">
                  <span className="font-semibold">{flight.departureCity}</span> -{" "}
                  <span className="font-semibold">{flight.arrivalCity}</span> (
                  {new Date(flight.departureTime).toLocaleString()} -{" "}
                  {new Date(flight.arrivalTime).toLocaleString()})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
