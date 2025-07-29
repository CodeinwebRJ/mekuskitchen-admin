// components/DeleteDialog.tsx
import React from 'react';

interface DeleteDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item?",
  onDelete,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-md bg-primary text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
