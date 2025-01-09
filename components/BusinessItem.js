import React from 'react';

function BusinessItem({ business }) {
  return (
    <div className="flex items-center space-x-4 p-4">
      {/* Business Icon */}
      <img
        src={business.icon}
        alt={business.name}
        className="w-12 h-12 rounded-full"
      />
      <div className="flex flex-col">
        {/* Business Name */}
        <h3 className="font-semibold text-lg">{business.name}</h3>

        {/* Business Vicinity (Address) */}
        <p className="text-sm text-gray-600">{business.vicinity}</p>

        {/* Business Rating and Total Ratings */}
        <div className="flex items-center text-yellow-500 mt-1">
          <span className="font-semibold">{business.rating}</span>
          <span className="ml-1 text-gray-500">
            ({business.user_ratings_total} ratings)
          </span>
        </div>
      </div>
    </div>
  );
}

export default BusinessItem;
