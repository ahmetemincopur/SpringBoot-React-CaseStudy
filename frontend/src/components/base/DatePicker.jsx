// src/components/base/DatePicker.jsx

import React from "react";

const DatePicker = ({ id, value = '', onChange, className, label, type, name }) => {
    return (
        <div className="w-full">
            {label && <label htmlFor={id} className="block text-gray-700 mb-2">{label}</label>}
            <input
                name={name}
                id={id}
                type={type} // Can change this to "datetime-local" for time as well
                value={value || ''} // Ensure that the value is never undefined
                onChange={onChange}
                className={className}
            />
        </div>
    );
};

export default DatePicker;
