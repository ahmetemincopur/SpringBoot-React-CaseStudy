// src/components/base/Button.js
import React from 'react';

const Button = ({ type = 'button', onClick, label, ...props }) => {
    return (
        <button type={type} onClick={onClick} {...props}>
            {label}
        </button>
    );
};

export default Button;
