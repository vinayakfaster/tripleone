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
import { SafeReservation, SafeUser, SafeListing, Review } from "@/app/types";
import { categories } from "./navbar/Categories";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const initialDateRange: Range = {
  startDate: new Date(),
  endDate: tomorrow,
  key: "selection",
};

type Props = {
  reservations?: SafeReservation[];
  listing: SafeListing & { user: SafeUser };
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
    (guestData: {
      adults: number;
      children: number;
      infants: number;
      pets: number;
    }) => {
      if (!currentUser) return loginModal.onOpen();

      const guestCount =
        guestData.adults +
        guestData.children +
        guestData.infants +
        guestData.pets;

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
        {/* Listing Head */}
        <ListingHead
          title={listing.title}
          locationValue={listing.locationValue}
          imageSrc={listing.imageSrc}
          id={listing.id}
          currentUser={currentUser}
        />

        {/* Main Grid */}
        <div className="md:grid md:grid-cols-7 md:gap-12 mt-4">
          {/* Left/Main content */}
          <div className="md:col-span-5 bg-white  shadow-sm p-4 md:p-0">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
              images={listing.imageSrc.map((url, index) => ({
                url,
                label: `Image ${index + 1}`,
              }))}
            />

            {/* Rare Find */}
            <div className="bg-pink-50  -pink-200 text-pink-800 rounded-xl px-4 py-2 mt-6 text-sm flex items-center gap-2">
              💎 Rare Find! This place is usually booked.
            </div>

            {/* Mobile-only Reservation Card */}
            <div className="block md:hidden mt-6">
              <div className="  shadow-lg p-4">
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

          {/* Desktop Sidebar */}
          <div className="hidden md:block md:col-span-2">
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
      </div>
    </Container>
  );
}

export default ListingClient;
