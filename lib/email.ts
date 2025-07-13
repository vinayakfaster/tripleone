// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

// ✅ General-purpose function
export const sendBookingEmail = async ({
  to,
  subject,
  text,
}: {
  to: string | string[]; // Can send to one or many
  subject: string;
  text: string;
}) => {
  try {
    const res = await resend.emails.send({
      from: 'BookStay <noreply@bookstay.onresend.com>', // ✅ Make sure this sender is verified in Resend
      to,
      subject,
      text,
    });

    return res;
  } catch (error) {
    console.error("❌ Email send error:", error);
  }
};

// ✅ Booking confirmation helper
export const sendReservationConfirmation = async (reservation: any) => {
  const { bookedEmail, bookedName, totalPrice, guestCount, startDate, endDate, listing } = reservation;

  const subject = `✅ Reservation Confirmed - ${listing?.title || "Your Stay"}`;
  const text = `
Hi ${bookedName},

Your reservation is confirmed!

Listing: ${listing?.title}
Dates: ${new Date(startDate).toDateString()} – ${new Date(endDate).toDateString()}
Guests: ${guestCount}
Total Paid: ₹${totalPrice}

Thank you for booking with BookStay!
`.trim();

  const html = `
    <div style="font-family:sans-serif">
      <h2>🎉 Reservation Confirmed!</h2>
      <p><strong>Listing:</strong> ${listing?.title}</p>
      <p><strong>Dates:</strong> ${new Date(startDate).toDateString()} – ${new Date(endDate).toDateString()}</p>
      <p><strong>Guests:</strong> ${guestCount}</p>
      <p><strong>Total Paid:</strong> ₹${totalPrice}</p>
      <hr />
      <p>Thank you for booking with <strong>BookStay</strong>.</p>
    </div>
  `;

  // Send to guest and admin
  return sendEmail({
    to: [bookedEmail, "hijeckerg@yourdomain.com"], // ✅ update with real admin email
    subject,
    text,
    html,
  });
};
