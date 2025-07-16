// /app/properties/[userId]/page.tsx
import getListings from "@/app/actions/getListings";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import PropertiesClient from "@/app/properties/PropertiesClient";

type Props = {
  params: { userId: string };
};

const HostPropertiesPage = async ({ params }: Props) => {
  const listings = await getListings({ userId: params.userId });
  const currentUser = await getCurrentUser();



  if (!listings || listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No Properties found"
          subtitle="This host has not listed any properties yet."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PropertiesClient listings={listings} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default HostPropertiesPage;
