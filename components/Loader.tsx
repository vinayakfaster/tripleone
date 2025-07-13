"use client";

import { motion } from "framer-motion";
import React from "react";

const SkeletonCard = () => (
  <div className="w-full sm:w-[260px] rounded-2xl border border-neutral-200 bg-white p-3 animate-pulse">
    <div className="bg-gray-300 h-[180px] w-full rounded-xl" />
    <div className="mt-3 h-4 bg-gray-300 rounded w-3/4" />
    <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
    <div className="mt-2 h-4 bg-gray-200 rounded w-1/3" />
  </div>
);

function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[70vh] flex flex-col items-center px-4 py-8"
    >
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(6)
          .fill(null)
          .map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
      </div>
    </motion.div>
  );
}

export default Loader;
