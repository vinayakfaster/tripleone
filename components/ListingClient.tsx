"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Range } from "react-date-range";
import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { toast } from "react-toastify";

import Container from "./Container";
import ListingHead from "./listing/ListingHead";
import ListingInfo from "./listing/ListingInfo";
import ListingReservation from "./listing/ListingReservation";
import useLoginModel from "@/hook/useLoginModal";
import { SafeReservation, SafeUser, safeListing, Review } from "@/types";
import { categories } from "./navbar/Categories";
import ReviewSummary from "../components/review/ReviewSummary";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const initialDateRange: Range = {
  startDate: new Date(),
  endDate: tomorrow,
  key: "selection",
};

type Props = {
  reservations?: SafeReservation[];
  listing: safeListing & { user: SafeUser };
  currentUser?: SafeUser | null;
};

function ListingClient({ reservations = [], listing, currentUser }: Props) {
  const router = useRouter();
  const loginModal = useLoginModel();

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [reviews, setReviews] = useState<Review[]>([]);

  const disableDates = useMemo(() => {
    let dates: Date[] = [];
    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
      dates = [...dates, ...range];
    });
    return dates;
  }, [reservations]);

  useEffect(() => {
    axios.get(`/api/reviews?listingId=${listing.id}`).then((res) => {
      setReviews(res.data);
    });
  }, [listing.id]);

  const onCreateReservation = useCallback(
    (guestCount: number) => {
      if (!currentUser) return loginModal.onOpen();

      setIsLoading(true);
      axios
        .post("/api/reservations", {
          totalPrice,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          listingId: listing?.id,
          guestCount,
        })
        .then(() => {
          toast.success("Reservation successful!");
          setDateRange(initialDateRange);
          router.push("/trips");
        })
        .catch(() => toast.error("Something went wrong"))
        .finally(() => setIsLoading(false));
    },
    [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]
  );

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );
      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  return (
    <Container>
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6 px-4 md:px-10">
        {/* Top image section */}
        <div className="relative">
          <ListingHead
            title={listing.locationValue}
            imageSrc={listing.imageSrc}
            id={listing.id}
            currentUser={currentUser}
            showBack
            showShare
            showHeart
          />
        </div>

        {/* Content section with reservation */}
        <div className="md:grid md:grid-cols-7 md:gap-12 mt-6">
          {/* Left main content */}
          <div className="md:col-span-5 bg-white rounded-2xl shadow-sm p-4 md:p-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {listing.title}
            </h1>

            <p className="text-base text-neutral-500 mb-4">
              Entire rental unit in {listing.locationValue}, India ·{" "}
              {listing.guestCount} guests · {listing.roomCount} bedroom ·{" "}
              {listing.bathroomCount} bathroom
            </p>

            <div className="flex items-center gap-4 mt-2 mb-4">
              <div className="text-lg font-bold">4.95</div>
              <div className="text-sm text-gray-500">Guest favourite</div>
              <div className="text-sm text-gray-500">
                {reviews.length} reviews
              </div>
            </div>

            <hr className="my-4" />

            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
              imageSrc={listing.imageSrc}
              hideMap={true}
            />

            <div className="bg-pink-50 border border-pink-200 text-pink-800 rounded-xl px-4 py-2 mt-6 text-sm flex items-center gap-2">
              💎 Rare Find! This place is usually booked.
            </div>
          </div>

          {/* Right reservation box */}
          <div className="md:col-span-2">
            <div className="sticky top-20 md:top-24">
              <ListingReservation 
                currentUser={currentUser}
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disableDates}
                listingId={listing.id}
              />
            </div>
          </div>
        </div>

        {/* ✅ Reviews moved to bottom like Airbnb */}
        <hr className="my-8" />
        <div className="mt-6 md:mt-12">
          <ReviewSummary reviews={reviews} />
        </div>
      </div>
    </Container>
  );
}

export default ListingClient;
