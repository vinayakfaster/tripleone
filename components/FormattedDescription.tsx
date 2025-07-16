"use client";

interface Props {
  description: string;
}

const FormattedDescription = ({ description }: Props) => {
  const lines = description.split("\n").filter((line) => line.trim() !== "");

  return (
    <div className="text-neutral-800 text-[15px] leading-[1.8] space-y-3">
      <h2 className="text-2xl font-semibold mb-2 text-black">About this space</h2>

      {lines.map((line, idx) => {
        const isHeading = /^(The space|About Parking|Other things to know|About this space|Amenities)/i.test(line);
        const isBullet = /^[✔✓•\-]/.test(line.trim());
        const isEmojiLine = /^[🔹🔸✔✓📌📍⭐🧹📸🚫]/.test(line.trim());

        return (
          <p
            key={idx}
            className={
              isHeading
                ? "font-semibold text-[16px] text-black mt-4"
                : isBullet || isEmojiLine
                ? "pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-neutral-500"
                : ""
            }
          >
            {line.trim()}
          </p>
        );
      })}
    </div>
  );
};

export default FormattedDescription;
