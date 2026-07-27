import React, { useState } from 'react';

export interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export const Search: React.FC<SearchProps> = ({ placeholder = 'Search...', onSearch }) => {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    onSearch(val);
  };

  return (
    <div className="search-input">
      <input
        type="text"
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
