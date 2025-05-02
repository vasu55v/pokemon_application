import React from 'react';

const SortingComponent = ({ sortOrder, setSortOrder }) => {
  return (
    <select
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
      className="p-2 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Sort</option>
      <option value="id-asc">ID ↑</option>
      <option value="id-desc">ID ↓</option>
      <option value="name-asc">Name A-Z</option>
      <option value="name-desc">Name Z-A</option>
    </select>
  );
};

export default SortingComponent;
