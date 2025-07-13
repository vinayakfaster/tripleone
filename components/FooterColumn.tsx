"use client";

type Props = {
  index: number;
  data: Array<string>;
};

function FooterColumn({ index, data }: Props) {
  const columnItems = data.map((item, index) =>
    index === 0 ? <h5 className="font-bold">{item}</h5> : <p>{item}</p>
  );

  return (
    <div className="space-y-4 text-xs text-gray-800">
      {columnItems}
    </div>
  );
}

export default FooterColumn;
