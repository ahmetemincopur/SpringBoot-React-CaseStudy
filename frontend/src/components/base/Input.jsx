// src/components/base/Input.js
import React from 'react';

const Input = ({ type, value, onChange, placeholder, ...props }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...props} // Ekstra props (örneğin className)
        />
    );
};

export default Input;
