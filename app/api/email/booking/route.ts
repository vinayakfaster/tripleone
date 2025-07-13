// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Your custom domain
const FROM_EMAIL = 'TripleOne <onboarding@resend.dev>';

// Main function to send any email
export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string | string[]; // string[] for multiple recipients
  subject: string;
  text: string;
}) => {
  try {
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      text,
    });

    return res;
  } catch (error) {
    console.error("❌ Email send error:", error);
  }
};

// Reservation confirmation wrapper
export const sendReservationConfirmation = async (reservation: any) => {
  const adminEmail = "hijeckerg@gmail.com"; // 👈 Replace with your real admin email

  const subject = `✅ Booking Confirmed - ${reservation.listingId}`;
  const text = `Reservation confirmed!

Guest: ${reservation.bookedName} (${reservation.bookedEmail}, 📞 ${reservation.bookedPhone})
Listing ID: ${reservation.listingId}
From: ${new Date(reservation.startDate).toLocaleDateString()}
To: ${new Date(reservation.endDate).toLocaleDateString()}
Guests: ${reservation.guestCount}
Amount: ₹${reservation.totalPrice}
Payment ID: ${reservation.paymentId || "N/A"}

- BookStay`;

  await sendEmail({
    to: [reservation.bookedEmail, adminEmail], // ✅ Both guest & admin get email
    subject,
    text,
  });
};
