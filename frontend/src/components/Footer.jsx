export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='mt-14'>
      <div className='fixed bottom-0 left-0 right-0 mx-auto max-w-7xl text-center p-4 text-sm text-white bg-gray-600'>
        <p>&copy; {currentYear} Team Task Manager</p>
      </div>
    </footer>
  );
}
