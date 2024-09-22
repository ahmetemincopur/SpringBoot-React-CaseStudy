import React from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);  // Navigate to the selected page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Welcome to OdeonTech Airlines</h1>
        <p className="text-center text-gray-600 mb-4">Choose an option to proceed:</p>

        <div className="flex justify-around">
          {/* Navigate to Login */}
          <button
            onClick={() => handleNavigation('/login')}
            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
          >
            Login
          </button>

          {/* Navigate to Register */}
          <button
            onClick={() => handleNavigation('/register')}
            className="bg-green-500 text-white font-semibold px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
