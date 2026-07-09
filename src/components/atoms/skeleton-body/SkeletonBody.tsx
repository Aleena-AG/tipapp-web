
const SkeletonBody = () => {
  return (
    <div>
      <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-8"></div>
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse mt-8"></div>
    </div>
  );
}

export default SkeletonBody
