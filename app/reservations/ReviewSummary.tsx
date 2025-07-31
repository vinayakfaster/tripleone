"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
// Pool of 100 realistic names (mostly Hindu, some foreign)
const dummyNames = [
  "Khushi", "Ananya", "Ishita", "Meera", "Saanvi", "Aaradhya", "Avni", "Diya", "Simran", "Priya",
  "Riya", "Trisha", "Aanya", "Jiya", "Tanya", "Tanvi", "Aditi", "Sneha", "Nitya", "Shruti",
  "Aarohi", "Krisha", "Navya", "Ira", "Vaishnavi", "Mira", "Esha", "Radhika", "Pooja", "Nandini",
  "Emily", "Sofia", "Isabella", "Emma", "Olivia", "Mia", "Lily", "Grace", "Chloe", "Zoe",
  "Sarah", "Anna", "Julia", "Lucy", "Ellie", "Nora", "Claire", "Ava", "Charlotte", "Ella",
  "Rohan", "Saurabh", "Aditya", "Aryan", "Vivaan", "Kunal", "Aayush", "Krish", "Rahul", "Amit",
  "Siddharth", "Varun", "Yash", "Nikhil", "Ankit", "Shrey", "Arjun", "Abhay", "Dhruv", "Raj",
  "Jay", "Kabir", "Dev", "Neil", "Reyansh", "Vikram", "Uday", "Zayn", "Omar", "Liam",
  "Noah", "Lucas", "Ethan", "Jacob", "Daniel", "Logan", "James", "Benjamin", "Mason", "Elijah"
];

// Shuffle and pick names
function getRandomName(i: number) {
  return dummyNames[i % dummyNames.length];
}

function getRandomRating() {
  // Skewed towards higher ratings
  const base = Math.random() * 2 + 3; // 3.0 to 5.0
  return Math.round(base * 10) / 10; // One decimal place
}


const generatedReviews = Array.from({ length: 80 }).map((_, i) => ({
  name: getRandomName(i),
  date: `2025-${(i % 12) + 1}`,
  ago: `${i + 1} months ago`,
  rating: getRandomRating(),
  text: `Really loved staying here! The environment was peaceful, everything matched the listing, and the host was incredibly responsive. Will return for sure.`,
  tags: i % 3 === 0 ? ["Clean", "Comfortable"] : ["Peaceful", "Great hospitality"],
}));


// Full reviews array
const fullReviews = [
  {
    name: "Khushi",
    date: "July 2025",
    ago: "1 week ago",rating: 1.7,
    text: "The home was beautiful and clean. The host made sure everything was ready before we arrived.",
    tags: ["Clean", "Responsive host"],
  },
  {
    name: "Meera",
    date: "June 2025",
    ago: "1 month ago",rating: 5.0,
    text: "Felt very peaceful during our stay. Loved the calm neighborhood and quick communication.",
    tags: ["Peaceful", "Great communication"],
  },
  {
    name: "Saurabh",
    date: "May 2025",rating: 2.7,
    ago: "2 months ago",
    text: "Great value for money! Would definitely recommend this place to friends.",
    tags: ["Value for money", "Clean"],
  },
  {
    name: "Ananya",
    date: "April 2025",
    ago: "3 months ago",rating: 4.9,
    text: "We had a great time. The rooms were tidy and the host was very friendly.",
    tags: ["Great hospitality", "Clean"],
  },
  {
    name: "Emily",
    date: "March 2025",
    ago: "4 months ago",rating: 4.7,
    text: "Fantastic location! Everything was walkable and the host gave great suggestions.",
    tags: ["Location", "Great communication"],
  },
  {
    name: "Rohan",
    date: "February 2025",
    ago: "5 months ago",
   rating: 4.7,
    text: "Very professional service and the place looked exactly like the photos.",
    tags: ["Accurate listing", "Responsive host"],
  },
    {
    name: "Pooja",
    date: "June 2025",
    ago: "10 weeks ago",
    rating: 4.0,
    text: "Threat street bar away. Possible budget organization upon national. Spring their quality eight. Story down city control blue someone. Sign education another why.",
    tags: ["Great communication", "Check-in", "Accurate listing", "Comfortable"],
  },
  {
    name: "Mia",
    date: "June 2025",
    ago: "31 weeks ago",
    rating: 4.4,
    text: "High week run much road. Our quickly always conference environment fight theory. Brother place help fill less. Bad condition of phone we raise.",
    tags: ["Quiet area", "Value for money", "Great hospitality", "Clean"],
  },
  {
    name: "Isabella",
    date: "May 2025",
    ago: "24 weeks ago",
    rating: 4.7,
    text: "Together reality executive about later before peace trade. Audience bit interview enjoy trouble election.",
    tags: ["Accurate listing", "Great communication"],
  },
  {
    name: "Neha",
      rating: 4.8, 
    date: "October 2024",
    ago: "9 months ago",
    text: "It was a last minute booking, but the host made sure everything went smoothly.",
    tags: ["Responsive host", "Great hospitality"],
  },
  {
    name: "Asfi",
    date: "April 2025",
      rating: 3, 
    ago: "9 months ago",
    text: "We had an amazing time at the bnb. The host was very professional and very friendly. Easy check in and check out. Clean and tidy.",
    tags: ["Great hospitality", "Clean", "Responsive host"],
  },
  {
    name: "Khushi",
    date: "2 weeks ago",
    ago: "5 years on Tripleone",
    text: "Good stay. Few things can be improved. Shresth is very nice and responsive. Took quick action for our issues.",
      rating: 4.2, 
    tags: ["Great communication", "Responsive host"],
  },
  {
    name: "Ankit",
    date: "May 2025",
      rating: 4.8, 
    ago: "11 months on Tripleone",
    text: "Place was clean and comfortable. Host was friendly. Would definitely stay again.",
    tags: ["Clean", "Comfortable"],
  },
  {
    name: "Meera",
    date: "Jan 2025",
      rating: 4.1, 
    ago: "1 year on Tripleone",
    text: "It was perfect. Check-in was smooth. Highly recommended for couples.",
    tags: ["Great hospitality", "Peaceful"],
  },
  {
    name: "Saurabh",
    date: "Feb 2025",
      rating: 4.8, 
    ago: "2 years on Tripleone",
    text: "Great value for money. Host is helpful. The place is as shown in photos.",
    tags: ["Value for money", "Great communication"],
  },
  ...generatedReviews,
];

const tags = [
  "Great hospitality",
  "Clean",
  "Great communication",
  "Responsive host",
  "Peaceful",
  "Comfortable",
  "Value for money",
];

const categoryRatings = [
  { label: "Cleanliness", value: getRandomRating() },
  { label: "Communication", value: getRandomRating() },
  { label: "Check-in", value: getRandomRating() },
  { label: "Accuracy", value: getRandomRating() },
  { label: "Location", value: getRandomRating() },
  { label: "Value", value: getRandomRating() },
];

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    else stars.push(<FaRegStar key={i} className="text-yellow-500" />);
  }
  return stars;
};


export default function ReviewSummary() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sliderOpen, setSliderOpen] = useState(false);

  const filteredReviews = selectedTag
    ? fullReviews.filter((r) => r.tags.includes(selectedTag))
    : fullReviews;

  const handleTagClick = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <>
      <div className="mt-0 px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-5xl font-semibold flex justify-center items-center gap-2">
            <span>🏅</span> <span>4.94</span>
          </div>
          <p className="text-base font-medium">Guest favourite</p>
          <p className="text-sm text-neutral-600">
            This home is a guest favourite based on ratings, reviews and reliability
          </p>
        </div>

        {/* Tags */}
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 w-max pr-4">
            {tags.map((tag, i) => (
              <button
                key={i}
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all duration-200 ${
                  selectedTag === tag
                    ? "bg-black text-white border-black"
                    : "bg-neutral-100 text-black border-neutral-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 hide-scrollbar sm:hidden">
          {filteredReviews.slice(0, 3).map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden sm:grid grid-cols-2 gap-4">
          {filteredReviews.slice(0, 6).map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>

        {/* Show All Button */}
        <div className="text-center">
          <button
            onClick={() => setSliderOpen(true)}
            className="w-full max-w-md mx-auto bg-neutral-100 rounded-lg py-3 font-medium text-sm"
          >
            Show all {filteredReviews.length} reviews
          </button>
        </div>
      </div>

      {sliderOpen && (
     <ReviewSliderModal
  reviews={fullReviews}
  selectedTag={selectedTag}
  setSelectedTag={setSelectedTag}
  onClose={() => setSliderOpen(false)}
/>

      )}
    </>
  );
}

function ReviewCard({ review }: { review: typeof fullReviews[0] }) {
  return (
    <div className="snap-start flex-shrink-0 w-[90%] sm:w-full bg-white border rounded-xl p-4 shadow-sm">
      <div className="text-sm font-medium flex items-center gap-2 mb-1">
        <span>★★★★★</span>
        <span className="text-neutral-500">{review.date}</span>
      </div>
      <p className="text-sm text-neutral-800 line-clamp-4 mb-4">{review.text}</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
          {review.name
  .split(" ")
  .map((n) => n[0])
  .join("")
  .slice(0, 2)
  .toUpperCase()}

        </div>
        <div>
          <p className="text-sm font-semibold">{review.name}</p>
          <p className="text-xs text-neutral-500">{review.ago}</p>
        </div>
      </div>
    </div>
  );
}

function ReviewSliderModal({
  onClose,
  reviews,
  selectedTag,
  setSelectedTag,
}: {
  onClose: () => void;
  reviews: typeof fullReviews;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!mounted) return null;

  const filtered = selectedTag
    ? reviews.filter((r) => r.tags.includes(selectedTag))
    : reviews;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

      <div
  ref={modalRef}
    className="bg-white max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6"
  >


        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            Reviews ({filtered.length})
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-black text-xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {categoryRatings.map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <p className="text-sm font-medium">{item.label}</p>
              <div className="flex-1 mx-4 h-2 bg-neutral-200 rounded">
                <div
                  className="h-2 bg-black rounded"
                  style={{ width: `${(item.value / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm font-semibold">{item.value.toFixed(1)}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="overflow-x-auto hide-scrollbar mb-6">
          <div className="flex gap-2 w-max pr-4">
            {tags.map((tag, i) => (
              <button
                key={i}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all duration-200 ${
                  selectedTag === tag
                    ? "bg-black text-white border-black"
                    : "bg-neutral-100 text-black border-neutral-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* All Reviews */}
        <div className="grid sm:grid-cols-2 gap-6">
          {filtered.map((r, i) => (
            <div key={i} className="bg-white border rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-1 mb-1">
  {renderStars(r.rating)}
  <span className="text-neutral-500 text-sm">{r.date}</span>
</div>

              <p className="text-sm text-neutral-800 mb-4">{r.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-neutral-500">{r.ago}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
