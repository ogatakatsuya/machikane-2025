"use client";

import type { ReactNode } from "react";
import CloseIcon from "/public/close.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-60 z-50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center w-full">
        <div className="bg-white rounded-lg w-4/5 max-w-md max-h-4/5 shadow-sm overflow-y-auto">
          <div className="flex justify-between items-center border-b border-gray-300 rounded-t text-white px-4 py-3">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg flex justify-center items-center"
            >
              <CloseIcon className="w-4" />
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
