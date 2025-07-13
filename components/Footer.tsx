"use client";

import { useEffect, useState } from "react";
import ClientOnly from "./ClientOnly";
import FooterColumn from "@/components/FooterColumn";

function Footer() {
  const [country, setCountry] = useState("United States");

  const itemData = [
    ["ABOUT", "Newsroom", "Learn about new features", "Letter from our founders", "Careers", "Investors"],
    ["Support", "Help Center", "Triplecover", "Cancellation options", "Safety information", "Report a neighborhood concern"],
    ["Community", "Newsroom", "Learn about new features", "Letter from our founders", "Careers", "Investors"],
    ["Hosting", "Try hosting", "Triplecover for Hosts", "Explore hosting resources", "Safety information", "How to host responsibly"],
  ];

  useEffect(() => {
    fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => setCountry(data.country))
      .catch((err) => console.error("IP lookup #00C4FF:", err));
  }, []);

  const footerColumns = itemData.map((item, index) => (
    <FooterColumn key={index} index={index} data={item} />
  ));

 return (
  <ClientOnly>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-10 px-6 sm:px-12 md:px-20 lg:px-32 py-14 bg-gray-100 text-gray-600">
      {footerColumns}

      {/* Contact Info (full-width on small screens) */}
      <div className="col-span-full flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 border-t pt-6 mt-6">
        <p>{country}</p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-center sm:text-left">
          <a
            href="https://www.instagram.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Instagram
          </a>
          <a href="tel:+918448811165" className="hover:underline">
            📞 8448811165
          </a>
          <a
            href="https://wa.me/918448811165"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  </ClientOnly>
);

}

export default Footer;
