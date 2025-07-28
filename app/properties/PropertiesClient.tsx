"use client";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ListingCard from "@/components/listing/ListingCard";
import { SafeUser, SafeListing } from "@/app/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/models/Modal"; // your existing working Modal

type Props = {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
};

export default function PropertiesClient({ listings, currentUser }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<SafeListing | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPrice, setEditedPrice] = useState<number>(0);

  const onDelete = useCallback(
    (id: string) => {
      setDeletingId(id);
      axios
        .delete(`/api/listings/${id}`)
        .then(() => {
          toast.info("Listing deleted");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || "Delete failed");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  const openEditModal = (listing: SafeListing) => {
    setEditingListing(listing);
    setEditedTitle(listing.title);
    setEditedPrice(listing.price);
    setEditModalOpen(true);
  };

const handleEditSubmit = async () => {
  if (!editingListing) return;

  if (!editedTitle || isNaN(editedPrice)) {
    toast.error("Please enter a valid title and price");
    return;
  }

  try {
    await axios.patch(`/api/listings/${editingListing.id}/edit`, {
      newPrice: editedPrice,
      newTitle: editedTitle,
    });
    toast.success("Listing updated!");
    setEditModalOpen(false);
    router.refresh();
  } catch (err) {
    toast.error("Failed to update listing");
  }
};


  return (
    <Container>
      <Heading title="Properties" subtitle="List of your properties" />

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        title="Edit Listing"
        actionLabel="Save Changes"
        body={
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (per night)</label>
              <input
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm"
              />
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6 px-4 sm:px-8">
        {listings.map((listing) => (
          <div key={listing.id} className="flex flex-col gap-2">
            <ListingCard
              data={listing}
              actionId={listing.id}
              onAction={onDelete}
              disabled={deletingId === listing.id}
              actionLabel="Delete property"
              currentUser={currentUser}
            />

            {currentUser?.id === listing.userId && (
              <div className="flex justify-end px-2">
              <button
  onClick={() => openEditModal(listing)}
  className="group flex items-center gap-1 text-neutral-600 text-sm hover:text-black font-medium transition"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 transform transition-transform duration-200 group-hover:rotate-12"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l2.65 2.65m-1.768-4.418a2.121 2.121 0 113 3L7.5 21H3v-4.5L17.744 2.719z"
    />
  </svg>
  Edit
</button>

              </div>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}
