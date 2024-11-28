import React from "react";

const CardSkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="w-full bg-gray-800 p-4 rounded-lg animate-pulse"
          >
            {/* Profile Header */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-24"></div>
              </div>
            </div>

            {/* Card Image */}
            <div className="h-40 bg-gray-700 rounded-lg mb-4"></div>

            {/* Title */}
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>

            {/* Description */}
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
    </div>
  );
};

export default CardSkeletonLoader;
