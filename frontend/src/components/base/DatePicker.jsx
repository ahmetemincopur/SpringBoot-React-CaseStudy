// src/components/base/DatePicker.js
import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ selected, onChange, ...props }) => {
    return (
        <ReactDatePicker
            selected={selected}
            onChange={onChange}
            {...props} // Ekstra props (örneğin dateFormat)
        />
    );
};

export default DatePicker;
