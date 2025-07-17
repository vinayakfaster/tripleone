"use client";

import useSearchModal from "@/hook/useSearchModal";
import { formatISO } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";

import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import Modal from "./Modal";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

type LocationState = {
  latlng: [number, number];
  label: string;
  value: string;
};

function SearchModal() {
  const router = useRouter();
  const params = useSearchParams();
  const searchModel = useSearchModal();

  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [location, setLocation] = useState<LocationState | null>(null);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const Map = useMemo(
    () => dynamic(() => import("../Map"), { ssr: false }),
    []
  );

const onBack = useCallback(() => setStep((value) => value - 1), []);
const onNext = useCallback(() => setStep((value) => value + 1), []);


 const onSubmit = useCallback(async () => {
  if (step !== STEPS.INFO) {
    return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.label,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl({ url: "/", query: updatedQuery }, { skipNull: true });

    setStep(STEPS.LOCATION);
    searchModel.onClose();
    router.push(url);
  }, [
    step,
    searchModel,
    location,
    router,
    guestCount,
    roomCount,
    bathroomCount,
    dateRange,
    onNext,
    params,
  ]);

  const actionLabel = useMemo(() => (step === STEPS.INFO ? "Search" : "Next"), [step]);
  const secondActionLabel = useMemo(() => (step === STEPS.LOCATION ? undefined : "Back"), [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title="Where do you wanna go?" subtitle="Find the perfect location!" />
      <Map
        selectedLatLng={
          location?.latlng
            ? { lat: location.latlng[0], lng: location.latlng[1] }
            : { lat: 28.6139, lng: 77.209 } // Default to Delhi
        }
        onSelectLocation={({ lat, lng, address }) =>
          setLocation({
            latlng: [lat, lng],
            label: address,
            value: address,
          })
        }
      />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="When do you plan to go?" subtitle="Make sure everyone is free!" />
        <Calendar onChange={(value) => setDateRange(value.selection)} value={dateRange} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="More information" subtitle="Find your perfect place!" />
        <Counter
          onChange={(value) => setGuestCount(value)}
          value={guestCount}
          title="Guests"
          subtitle="How many guests are coming?"
        />
        <hr />
        <Counter
          onChange={(value) => setRoomCount(value)}
          value={roomCount}
          title="Rooms"
          subtitle="How many rooms do you need?"
        />
        <hr />
        <Counter
          onChange={(value) => setBathroomCount(value)}
          value={bathroomCount}
          title="Bathrooms"
          subtitle="How many bathrooms do you need?"
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModel.isOpen}
      onClose={searchModel.onClose}
      onSubmit={onSubmit}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      secondaryActionLabel={secondActionLabel}
      title="Filters"
      actionLabel={actionLabel}
      body={bodyContent}
    />
  );
}

export default SearchModal;