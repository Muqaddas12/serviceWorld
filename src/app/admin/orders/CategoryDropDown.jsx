"use client";
import { useState, useRef, useEffect } from "react";

export default function Dropdown({  onSelect, label = "Select" , options}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const ref = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const selectOption = (opt) => {
    setSelected(opt);
    setOpen(false);
    onSelect && onSelect(opt);
  };

  return (
    <div ref={ref} className="relative inline-block w-48">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-white border px-3 py-2 rounded-md shadow-sm text-left"
      >
        {selected ? selected.label : label}
      </button>

      {open && (
        <ul className="absolute w-full bg-white border rounded-md mt-1 shadow max-h-40 overflow-y-auto z-50">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => selectOption(opt)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}