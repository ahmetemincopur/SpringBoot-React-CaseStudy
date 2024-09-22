// src/components/base/Checkbox.js
import React from 'react';

const Checkbox = ({ checked, onChange, label, ...props }) => {
    return (
        <label>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                {...props}
            />
            {label}
        </label>
    );
};

export default Checkbox;
