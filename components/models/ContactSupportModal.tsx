"use client";

import { useCallback } from "react";
import Modal from "./Modal"; // Use your existing Modal component
import useContactModal from "@/hook/useContactModal";

const ContactSupportModal = () => {
  const contactModal = useContactModal();

  const onClose = useCallback(() => {
    contactModal.onClose();
  }, [contactModal]);

  return (
    <Modal
      isOpen={contactModal.isOpen}
      onClose={onClose}
      title="Want to Become a Host?"
      actionLabel="Contact Us"
      onSubmit={onClose}
      body={
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            To become a host, please contact our team.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              📱 WhatsApp us
            </a>
            <a
              href="mailto:host@tripleone.com"
              className="text-blue-600 underline"
            >
              📧 Email us at host@tripleone.com
            </a>
          </div>
        </div>
      }
    />
  );
};

export default ContactSupportModal;
