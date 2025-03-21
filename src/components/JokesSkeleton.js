export default function JokesSkeleton() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mt-12">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded my-4"></div>
            <div className="h-10 bg-gray-300 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }
  