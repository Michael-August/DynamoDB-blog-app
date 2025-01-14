const CardSkeletonLoader = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6) // Display 6 skeleton cards
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              {/* Skeleton Image */}
              <div className="w-full h-40 bg-gray-300"></div>

              <div className="p-4">
                {/* Skeleton Title */}
                <div className="w-3/4 h-6 bg-gray-300 mb-4 rounded"></div>

                {/* Skeleton Date */}
                <div className="w-1/2 h-4 bg-gray-300 mb-4 rounded"></div>

                {/* Skeleton Description */}
                <div className="w-full h-4 bg-gray-300 mb-2 rounded"></div>
                <div className="w-5/6 h-4 bg-gray-300 mb-4 rounded"></div>

                {/* Skeleton Tags */}
                <div className="flex flex-wrap gap-2">
                  {Array(3)
                    .fill(0)
                    .map((_, tagIndex) => (
                      <div
                        key={tagIndex}
                        className="w-16 h-6 bg-gray-300 rounded"
                      ></div>
                    ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CardSkeletonLoader;
