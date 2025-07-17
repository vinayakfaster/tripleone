import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/listing/ListingCard";
import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import HorizontalListingRow from "@/components/listing/HorizontalListingRow";
import Script from 'next/script';

interface HomeProps {
  searchParams: IListingsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  if (!listings.length) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }
<script src="https://checkout.razorpay.com/v1/checkout.js"  strategy="lazyOnload" ></script>

  const recentlyViewed = listings.slice(0, 6).map((item, idx) => ({
    ...item,
    isFavorite: idx % 2 === 0 // randomly flag guest favorite for demo
  }));

  const chandniChowkListings = listings
    .filter((l) => l.locationValue?.toLowerCase().includes("chandni"))
    .map((item, idx) => ({
      ...item,
      isFavorite: idx % 2 !== 0 // randomly flag guest favorite for demo
    }));

  const shownIds = new Set([...recentlyViewed, ...chandniChowkListings].map((l) => l.id));
  const remainingListings = listings
    .filter((l) => !shownIds.has(l.id))
    .map((item, idx) => ({
      ...item,
      isFavorite: idx % 3 === 0
    }));

  return (
    <ClientOnly>
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
          {remainingListings.map((list) => (
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
