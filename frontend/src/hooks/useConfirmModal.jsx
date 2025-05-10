import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

export default function useConfirmModal({
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const openModal = (targetId, confirmCallback) => {
    setTarget(targetId);
    setOnConfirm(() => () => confirmCallback(targetId));
    setIsOpen(true);
  };

  const Modal = (
    <ConfirmModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onConfirm={() => {
        onConfirm();
        setIsOpen(false);
        setTarget(null);
      }}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
    />
  );

  return { openModal, Modal, target };
}
