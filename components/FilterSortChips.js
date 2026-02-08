import React, { useState } from 'react';

/**
 * FilterSortChips
 *
 * Provides UI chips for sorting and filtering products. Sorting options
 * include price ascending/descending. Filters include status and size.
 * Selected chips toggle on/off. The component notifies the parent via
 * callbacks when criteria change.
 */
const FilterSortChips = ({ onSortChange, onStatusFilter, onSizeFilter }) => {
  const [sort, setSort] = useState(null);
  const [status, setStatus] = useState(null);
  const [size, setSize] = useState(null);
  const toggleSort = (key) => {
    const val = sort === key ? null : key;
    setSort(val);
    onSortChange?.(val);
  };
  const toggleStatus = (key) => {
    const val = status === key ? null : key;
    setStatus(val);
    onStatusFilter?.(val);
  };
  const toggleSize = (key) => {
    const val = size === key ? null : key;
    setSize(val);
    onSizeFilter?.(val);
  };
  return (
    <div className="filterChips">
      <div className="chipGroup">
        <span>Sort:</span>
        <button className={`chip ${sort==='asc'? 'active':''}`} onClick={() => toggleSort('asc')}>Price ↑</button>
        <button className={`chip ${sort==='desc'? 'active':''}`} onClick={() => toggleSort('desc')}>Price ↓</button>
      </div>
      <div className="chipGroup">
        <span>Status:</span>
        {['READY','PO','SOLD OUT'].map((k) => (
          <button key={k} className={`chip ${status===k? 'active':''}`} onClick={() => toggleStatus(k)}>{k}</button>
        ))}
      </div>
      <div className="chipGroup">
        <span>Size:</span>
        {['S','M','L','XL','XXL'].map((k) => (
          <button key={k} className={`chip ${size===k? 'active':''}`} onClick={() => toggleSize(k)}>{k}</button>
        ))}
      </div>
    </div>
  );
};

export default FilterSortChips;