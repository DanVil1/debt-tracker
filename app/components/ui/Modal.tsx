'use client';

import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function Modal({ isOpen, title, description, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        {description && (
          <p className="text-neutral-400 text-sm mb-6">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}

type ModalActionsProps = {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: 'danger' | 'primary';
};

export function ModalActions({
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  confirmVariant = 'primary',
}: ModalActionsProps) {
  const confirmClass =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-500 text-white'
      : 'bg-indigo-600 hover:bg-indigo-500 text-white';

  return (
    <div className="flex gap-3">
      <button
        onClick={onCancel}
        className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors"
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        className={`flex-1 px-4 py-2 rounded-lg transition-colors ${confirmClass}`}
      >
        {confirmText}
      </button>
    </div>
  );
}
