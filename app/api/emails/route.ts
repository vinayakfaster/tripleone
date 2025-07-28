import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, name, listingTitle, checkIn, checkOut } = body;

    if (!to || !listingTitle || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const subject = `Booking Confirmed: ${listingTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Thank you for your booking, ${name || "Guest"}!</h2>
        <p>Your reservation at <strong>${listingTitle}</strong> is confirmed.</p>
        <p><strong>Check-in:</strong> ${checkIn}</p>
        <p><strong>Check-out:</strong> ${checkOut}</p>
        <br/>
        <p style="font-size: 14px; color: #888;">BookStay Team</p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "tripleone bookings <noreply@tripleonebookings.com>", // make sure it's verified
      to,
      subject,
      html,
    });

    if (error || !data) {
      console.error("Resend send error:", error || "No data returned");
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "Email sent", id: data.id });
  } catch (err) {
    console.error("Email route error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
