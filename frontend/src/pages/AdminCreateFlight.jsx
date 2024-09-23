import React, { useState, useEffect } from 'react';
import { getFlights, createFlight, updateFlight, deleteFlight, checkForConflicts } from '../api/flightService';
import { Navigate } from 'react-router-dom';
import useAuth from '../components/useAuth';
import Button from "../components/base/Button";
import Input from "../components/base/Input";
import DatePicker from "../components/base/DatePicker";

const AdminCreateFlight = () => {
    const { isAuthenticated, userRole } = useAuth();
    const [flights, setFlights] = useState([]);
    const [flightForm, setFlightForm] = useState({
        id: null,
        departureCity: '',
        arrivalCity: '',
        departureTime: '',
        arrivalTime: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (isAuthenticated && userRole === 'ROLE_ADMIN') {
            fetchFlights();
        }
    }, [isAuthenticated, userRole]);

    const fetchFlights = async () => {
        try {
            const data = await getFlights();
            setFlights(data);
        } catch (error) {
            console.error('Error fetching flights:', error);
        }
    };

    const handleInputChange = (e) => {
        setFlightForm({
            ...flightForm,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateOrUpdate = async () => {
        try {
            const response = await checkForConflicts(flightForm);
            if (response.hasConflicts) {
                alert('Conflict detected: Another flight is scheduled within the same airspace during this time.');
                return;
            }
            if (isEditing) {
                await updateFlight(flightForm.id, flightForm);
                alert('Flight updated!');
            } else {
                await createFlight(flightForm);
                alert('Flight created!');
            }
            setFlightForm({
                id: null,
                departureCity: '',
                arrivalCity: '',
                departureTime: '',
                arrivalTime: ''
            });
            setIsEditing(false);
            fetchFlights();
        } catch (error) {
            console.error('Error saving flight:', error);
            alert('An error occurred while saving the flight.');
        }
    };

    const handleEdit = (flight) => {
        setFlightForm({
            id: flight.id,
            departureCity: flight.departureCity,
            arrivalCity: flight.arrivalCity,
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this flight?')) {
            try {
                await deleteFlight(id);
                alert('Flight deleted!');
                fetchFlights();
            } catch (error) {
                console.error('Error deleting flight:', error);
                alert('An error occurred while deleting the flight.');
            }
        }
    };

    if (!isAuthenticated || userRole === null) {
        return null;
    }

    if (userRole !== 'ROLE_ADMIN') {
        return <Navigate to="/flight-search" />;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Update Flight' : 'Create a New Flight'}</h2>
            <div className="space-y-4">
                <Input type={"text"}
                    name={"departureCity"}
                    placeholder={"Departure City"}
                    value={flightForm.departureCity}
                    onChange={handleInputChange}
                    className={"w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"} />
                <Input type="text"
                    name="arrivalCity"
                    placeholder="Arrival City"
                    value={flightForm.arrivalCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                <div>
                    <label className="block mb-2">Departure Time:</label>
                    <DatePicker type={"datetime-local"}
                        name={"departureTime"}
                        value={flightForm.departureTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                    <label className="block mb-2">Arrival Time:</label>
                    <DatePicker type={"datetime-local"}
                        name={"arrivalTime"}
                        value={flightForm.arrivalTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div className="space-x-2">
                    <Button onClick={handleCreateOrUpdate}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
                        label={isEditing ? 'Update Flight' : 'Create Flight'} />
                    {isEditing && (

                        <Button onClick={() => {
                            setIsEditing(false);
                            setFlightForm({
                                id: null,
                                departureCity: '',
                                arrivalCity: '',
                                departureTime: '',
                                arrivalTime: ''
                            });
                        }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
                            label={"Cancel"} />
                    )}
                </div>
            </div>
            <hr className="my-6" />
            <h2 className="text-xl font-semibold mb-4">Flight List</h2>
            <table className="min-w-full bg-white border rounded-lg shadow-md">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">ID</th>
                        <th className="px-4 py-2 border-b">Departure City</th>
                        <th className="px-4 py-2 border-b">Arrival City</th>
                        <th className="px-4 py-2 border-b">Departure Time</th>
                        <th className="px-4 py-2 border-b">Arrival Time</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {flights.map((flight) => (
                        <tr key={flight.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b">{flight.id}</td>
                            <td className="px-4 py-2 border-b">{flight.departureCity}</td>
                            <td className="px-4 py-2 border-b">{flight.arrivalCity}</td>
                            <td className="px-4 py-2 border-b">
                                {new Date(flight.departureTime).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {new Date(flight.arrivalTime).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 border-b space-x-2 flex">
                                <Button onClick={() => handleEdit(flight)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-400"
                                    label={"Edit"} />
                                <Button onClick={() => handleDelete(flight.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500"
                                    label={"Delete"} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCreateFlight;
