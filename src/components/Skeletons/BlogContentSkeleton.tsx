import React from "react";

const BlogSkeletonLoader = () => {
  return (
    <div className="p-4 space-y-8">
      {/* Main Content Skeleton */}
      <div>
        {/* Title */}
        <div className="h-8 bg-gray-700 rounded w-3/4 mb-4 animate-pulse"></div>

        {/* Share Section */}
        <div className="flex space-x-4 mb-4">
          <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
        </div>

        {/* Author Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
        </div>

        {/* Tags */}
        <div className="flex space-x-2 mb-4">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="h-6 w-20 bg-gray-700 rounded-full animate-pulse"></div>
            ))}
        </div>

        {/* Main Image */}
        <div className="h-64 bg-gray-700 rounded-lg animate-pulse"></div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="space-y-6">
        {Array(2)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex space-x-4">
              {/* Image */}
              <div className="h-24 w-24 bg-gray-700 rounded-lg animate-pulse"></div>
              <div>
                {/* Title */}
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                {/* Tags */}
                <div className="flex space-x-2">
                  {Array(3)
                    .fill(null)
                    .map((_, tagIndex) => (
                      <div
                        key={tagIndex}
                        className="h-6 w-16 bg-gray-700 rounded-full animate-pulse"
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

export default BlogSkeletonLoader;
