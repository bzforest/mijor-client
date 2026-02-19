const baseColors = [
  { name: "Gray 0", hex: "#070C1B", className: "bg-brand-gray-0" },
  { name: "Gray 100", hex: "#21263F", className: "bg-brand-gray-100" },
  { name: "Gray 200", hex: "#565F7E", className: "bg-brand-gray-200" },
  { name: "Gray 300", hex: "#8B93B0", className: "bg-brand-gray-300" },
  { name: "Gray 400", hex: "#C8CEDD", className: "bg-brand-gray-400" },
  { name: "White", hex: "#FFFFFF", className: "bg-white" },
];

const brandColors = [
  { name: "Blue 100", hex: "#4E7BEE", className: "bg-brand-blue-100" },
  { name: "Blue 200", hex: "#1E29A8", className: "bg-brand-blue-200" },
  { name: "Blue 300", hex: "#0C1580", className: "bg-brand-blue-300" },
  { name: "Green", hex: "#00A372", className: "bg-brand-green" },
  { name: "Red", hex: "#E5364B", className: "bg-brand-red" },
];

export default function Home() {

  return (
    <div className="flex flex-col items-center min-h-screen bg-brand-gray-0 px-6 py-8 text-white">
      <div className="w-fit">
        <section className="mb-10 grid gap-40 rounded-lg border border-brand-gray-100 p-6 lg:grid-cols-2">
          <div>
            <p className="text-body-2 text-brand-gray-300">Color</p>
            <h1 className="mt-1 text-headline-2">Colors</h1>

            <h2 className="mt-6 text-headline-4 text-white">Base</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {baseColors.map((color) => (
                <div key={color.name}>
                  <div className={`h-14 w-full ${color.className}`} />
                  <p className="mt-2 text-body-2 text-white">{color.name}</p>
                  <p className="text-body-3 text-brand-gray-300">{color.hex}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-6 text-headline-4 text-white">Brand</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {brandColors.map((color) => (
                <div key={color.name}>
                  <div className={`h-14 w-full ${color.className}`} />
                  <p className="mt-2 text-body-2 text-white">{color.name}</p>
                  <p className="text-body-3 text-brand-gray-300">{color.hex}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-body-2 text-brand-gray-300">Font</p>
            <h1 className="mt-1 text-headline-2">Fonts</h1>

            <h2 className="mt-6 text-headline-4 text-white">Headline</h2>
            <div className="mt-3 space-y-2 text-brand-gray-300">
              <p className="text-headline-1">Headline1</p>
              <p className="text-headline-2">Headline 2</p>
              <p className="text-headline-3">Headline 3</p>
              <p className="text-headline-4">Headline 4</p>
            </div>

            <h2 className="mt-6 text-headline-4 text-white">Body</h2>
            <div className="mt-3 space-y-2 text-brand-gray-300">
              <p className="text-body-1-bold">Body 1 - Medium</p>
              <p className="text-body-1">Body 1 - Regular</p>
              <p className="text-body-2-bold">Body 2 - Medium</p>
              <p className="text-body-2">Body 2 - Regular</p>
              <p className="text-body-3">Body 3</p>
            </div>
          </div>
        </section>
        <section className="lg:col-span-6" />
      </div>
    </div>
  );
}
