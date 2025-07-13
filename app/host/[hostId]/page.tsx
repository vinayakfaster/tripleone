import getListingsByUserId from "@/actions/getListingsByUserId";
import getCurrentUser from "@/actions/getCurrentUser";
import getUserById from "@/actions/getUserById";
import getReviewsByHostId from "@/actions/getReviewsByHostId"; // ✅ Your review fetcher
import PropertiesClient from "@/components/properties/PropertiesClient";

type Props = {
  params: {
    hostId: string;
  };
};

const HostPage = async ({ params }: Props) => {
  const host = await getUserById(params.hostId);
  const currentUser = await getCurrentUser();
  const listings = await getListingsByUserId(params.hostId);
  const reviews = await getReviewsByHostId(params.hostId); // ✅ Get all reviews where listing belongs to this host

  return (
    <PropertiesClient
      listings={listings}
      currentUser={currentUser}
      host={host}
      reviews={reviews} // ✅ Pass to client component
    />
  );
};

export default HostPage;
