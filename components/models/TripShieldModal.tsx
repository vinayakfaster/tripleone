"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const TripShieldModal = ({ isOpen, onClose }: Props) => {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white w-full md:max-w-md md:rounded-xl md:mb-0 p-6 transform transition-all duration-300 ease-in-out ${
          show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            🛡️ TripShield Protection
          </h2>
          <button onClick={handleClose}>
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Your booking is protected by <strong>TripleOne’s TripShield</strong> coverage,
            offering:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>✅ Refund for host cancellations</li>
            <li>✅ Support for check-in issues</li>
            <li>✅ Rebooking help if listing is inaccurate</li>
            <li>✅ 24/7 guest support</li>
          </ul>
          <p className="text-neutral-500">
            This is automatically included for free in all reservations.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleClose}
          className="mt-6 w-full py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default TripShieldModal;
