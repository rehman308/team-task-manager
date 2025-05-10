export default function Button({ label, color, hoverColor, ...props }) {
  return (
    <button
      {...props}
      className={`rounded px-4 py-2 text-md text-white ${color} hover:${hoverColor} duration-300 hover:cursor-pointer`}>
      {label}
    </button>
  );
}
