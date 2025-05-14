'use client';

export default function Button({ label, color = 'bg-blue-500', hoverColor = 'bg-blue-700', className = '', ...props }) {
  return (
    <button
      {...props}
      className={`rounded px-4 py-2 text-md text-white ${color} duration-300 hover:cursor-pointer ${className} ${
        hoverColor && `hover:${hoverColor}`
      }`}>
      {label}
    </button>
  );
}
