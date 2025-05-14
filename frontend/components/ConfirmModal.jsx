'use client';

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const modalRoot = document.getElementById('modal');
  if (!modalRoot) return null;

  const content = (
    <div className='fixed inset-0 bg-black/30 z-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-sm'>
        <h2 className='text-lg font-semibold mb-2'>{title}</h2>
        <p className='text-sm text-gray-600 mb-4'>{description}</p>
        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='px-3 py-1 rounded bg-gray-200 text-gray-700'>
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className='px-3 py-1 rounded bg-red-600 text-white'>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, modalRoot);
}
