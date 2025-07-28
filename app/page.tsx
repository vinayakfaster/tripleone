import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/listing/ListingCard";
import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import HorizontalListingRow from "@/components/listing/HorizontalListingRow";
import Script from "next/script";
import { SafeListing, SafeUser } from "../app/types";

interface HomeProps {
  searchParams: IListingsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const listings: SafeListing[] = await getListings(searchParams);
  const currentUser: SafeUser | null = await getCurrentUser();

  if (!listings.length) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  // Helper to mark favorites and keep type
  const markFavorite = (item: SafeListing, isFavorite: boolean): SafeListing => ({
    ...item,
    isFavorite,
  });

  const recentlyViewed: SafeListing[] = listings
    .slice(0, 6)
    .map((item, idx) => markFavorite(item, idx % 2 === 0));

  const chandniChowkListings: SafeListing[] = listings
    .filter((l) => l.locationValue?.toLowerCase().includes("chandni"))
    .map((item, idx) => markFavorite(item, idx % 2 !== 0));

  const shownIds = new Set([...recentlyViewed, ...chandniChowkListings].map((l) => l.id));

  const remainingListings: SafeListing[] = listings
    .filter((l) => !shownIds.has(l.id))
    .map((item, idx) => markFavorite(item, idx % 3 === 0));

  return (
    <ClientOnly>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Container>
        <HorizontalListingRow
          title="Recently viewed homes"
          listings={recentlyViewed}
          currentUser={currentUser}
        />

        {chandniChowkListings.length > 0 && (
          <HorizontalListingRow
            title="Stay near Chandni Chowk"
            listings={chandniChowkListings}
            currentUser={currentUser}
          />
        )}

        <div className="pt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 px-4 sm:px-8">
          {remainingListings.map((list: SafeListing) => (
            <ListingCard
              key={list.id}
              data={list}
              currentUser={currentUser}
              layout="grid"
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
}
