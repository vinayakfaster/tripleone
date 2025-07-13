"use client";

import React, { useState, useEffect } from "react";

// Full reviews array (can be longer)
const fullReviews = [
  {
    name: "Asfi",
    date: "April 2025",
    ago: "9 months ago",
    text: "We had an amazing time at the bnb. The host was very professional and very friendly. Easy check in and check out. Clean and tidy.",
  },
  {
    name: "Khushi",
    date: "2 weeks ago",
    ago: "5 years on Tripleone",
    text: "Good stay. Few things can be improved. Shresth is very nice and responsive. Took quick action for our issues.",
  },
  {
    name: "Ankit",
    date: "May 2025",
    ago: "11 months on Tripleone",
    text: "Place was clean and comfortable. Host was friendly. Would definitely stay again.",
  },
  {
    name: "Ravi",
    date: "March 2025",
    ago: "2 years on Tripleone",
    text: "A pleasant experience overall. Cozy and clean place. Good location too.",
  },
  {
    name: "Meera",
    date: "Jan 2025",
    ago: "1 year on Tripleone",
    text: "It was perfect. Check-in was smooth. Highly recommended for couples.",
  },
  {
    name: "Saurabh",
    date: "Feb 2025",
    ago: "2 years on Tripleone",
    text: "Great value for money. Host is helpful. The place is as shown in photos.",
  },
  {
    name: "Tanya",
    date: "June 2024",
    ago: "1 years on Tripleone",
    text: "Quiet neighborhood. Loved the decor and comfy bed. Would stay again.",
  },
  {
    name: "Dev",
    date: "July 2024",
    ago: "6 months ago",
    text: "Everything was just like the pictures. Very clean and peaceful. 10/10.",
  },
];

const scores = [
  { label: "Cleanliness", value: 4.8 },
  { label: "Accuracy", value: 4.9 },
  { label: "Check-in", value: 4.9 },
  { label: "Communication", value: 5.0 },
  { label: "Location", value: 4.6 },
  { label: "Value", value: 4.9 },
];

const tags = [
  "Clean - 4",
  "Great hospitality - 3",
  "Communication - 1",
  "Value for money - 1",
  "Helper on-site - 1",
  "Smooth checkout - 1",
];

export default function ReviewSummary() {
  const [showAll, setShowAll] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [visibleReviews, setVisibleReviews] = useState<typeof fullReviews>([]);

  useEffect(() => {
    const shuffled = [...fullReviews].sort(() => 0.5 - Math.random());
    setVisibleReviews(shuffled.slice(0, 4));
  }, []);

  const toggleShowMore = (index: number) => {
    setExpandedIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-6 mt-10">
      {/* Overall */}
      <div className="text-center space-y-1">
        <div className="text-5xl font-bold flex justify-center items-center gap-2">
          <span>🏅</span> <span>4.88</span>
        </div>
        <p className="text-sm text-neutral-600">
          Guest favourite — based on reviews, ratings & reliability
        </p>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {scores.map((score) => (
          <div
            key={score.label}
            className="flex justify-between border p-3 rounded-lg text-sm"
          >
            <span>{score.label}</span>
            <span className="font-semibold">{score.value}</span>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-neutral-100 px-3 py-1 rounded-full border text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Reviews */}
      <div className="grid md:grid-cols-2 gap-5">
        {(showAll ? fullReviews : visibleReviews).map((r, i) => (
          <div key={i} className="space-y-2 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                {r.name[0]}
              </div>
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-xs text-neutral-500">
                  {r.ago} · {r.date}
                </p>
              </div>
            </div>
            <p className="text-sm text-neutral-700 line-clamp-3">
              {expandedIndexes.includes(i) || r.text.length < 100
                ? r.text
                : `${r.text.slice(0, 100)}...`}
            </p>
            {r.text.length > 100 && (
              <button
                className="text-sm underline font-medium"
                onClick={() => toggleShowMore(i)}
              >
                {expandedIndexes.includes(i) ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Show All Reviews Button */}
      {!showAll && (
        <div className="text-center pt-4">
          <button
            className="text-sm font-semibold underline"
            onClick={() => setShowAll(true)}
          >
            Show all {fullReviews.length} reviews
          </button>
        </div>
      )}
    </div>
  );
}
