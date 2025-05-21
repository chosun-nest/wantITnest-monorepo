import History from "./history";

export default function HistoryTimeline() {
  const years = [2020, 2021, 2022, 2023, 2024];

  return (
    <div className="w-full py-4 px-2">
      <h2 className="text-xl font-bold mb-4">History</h2>
      <div className="relative w-full h-12 mb-8">
        <div className="absolute top-1/2 w-full border-t-4 border-blue-800"></div>
        <div className="flex justify-between items-center px-4">
          {years.map((year) => (
            <div key={year} className="flex flex-col items-center relative">
              <div className="w-1 h-6 bg-blue-800"></div>
              <span className="text-sm mt-1 text-blue-900">{year}</span>
            </div>
          ))}
        </div>
        <History />
      </div>
    </div>
  );
}
