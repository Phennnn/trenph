import React from 'react';
import Select from 'react-select';

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '46px',
      border: '1px solid #d1d5db',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 20, // Ensure dropdown appears over other elements
    }),
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(selected) => onChange(selected.value)}
      styles={customStyles}
      placeholder={placeholder || 'Select...'}
    />
  );
};

export default SearchableSelect;