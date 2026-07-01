const getCellColor = (index: number) => {
  const row = Math.floor(index / 15);
  const col = index % 15;

  // Top Left (Red)
  if (row < 6 && col < 6) return "bg-red-100";

  // Top Right (Green)
  if (row < 6 && col > 8) return "bg-green-100";

  // Bottom Left (Blue)
  if (row > 8 && col < 6) return "bg-blue-100";

  // Bottom Right (Yellow)
  if (row > 8 && col > 8) return "bg-yellow-100";

  // Remaining path
  return "bg-gray-200";
};

const BoardSkeleton = () => {
  return (
    <section className="flex justify-center items-center h-screen opacity-50">
      <div className="grid grid-cols-15 w-fit animate-pulse">
        {Array.from({ length: 225 }).map((_, i) => (
          <div
            key={i}
            className={`
              ${getCellColor(i)}
              w-6 h-6
              sm:w-8 sm:h-8
              md:w-10 md:h-10
              lg:w-12 lg:h-12
              border border-gray-300
            `}
          />
        ))}
      </div>
    </section>
  );
};

export default BoardSkeleton;