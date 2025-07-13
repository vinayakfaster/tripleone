"use client";

import { BiSearch } from "react-icons/bi";
import useSearchModal from "@/hook/useSearchModal";

const CompactSearch = () => {
  const searchModal = useSearchModal();

  return (
    <div
      onClick={searchModal.onOpen}
      className="w-full md:w-auto px-4 py-2 border rounded-full shadow-sm flex items-center gap-3 transition-all hover:shadow-md cursor-pointer"
    >
      <BiSearch size={18} className="text-rose-500" />
      <div className="text-sm font-medium text-gray-600">Search destinations</div>
    </div>
  );
};

export default CompactSearch;
