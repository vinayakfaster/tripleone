"use client";

import React, { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
};

function Modal({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}: Props) {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) return;
    setShowModal(false);
    setTimeout(onClose, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (!disabled) onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (!disabled && secondaryAction) secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center px-2 sm:px-0">
      <div
        className={`w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-all duration-300 ${
          showModal ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center p-4 border-b">
          <button
            onClick={handleClose}
            className="absolute left-4 text-gray-500 hover:text-gray-700"
          >
            <IoMdClose size={20} />
          </button>
          <h3 className="text-lg font-semibold text-center">{title}</h3>
        </div>

        {/* Body */}
        <div className="px-4 pt-4 pb-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {body}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex flex-col gap-3">
          <div className="flex gap-3">
            {secondaryAction && secondaryActionLabel && (
              <Button
                outline
                disabled={disabled}
                label={secondaryActionLabel}
                onClick={handleSecondaryAction}
              />
            )}
            <Button
              disabled={disabled}
              label={actionLabel}
              onClick={handleSubmit}
            />
          </div>
          {footer}
        </div>
      </div>
    </div>
  );
}

export default Modal;
