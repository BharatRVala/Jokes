export default function ProfileSkeleton() {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        {/* Skeleton for Profile Info */}
        <div className="mb-6 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-10 bg-gray-300 rounded w-1/4"></div>
        </div>
  
        {/* Skeleton for Jokes Section */}
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="p-4 mb-4 bg-yellow-100 rounded-lg shadow-md">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-8"></div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="h-8 w-16 bg-gray-300 rounded"></div>
                    <div className="h-8 w-16 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }