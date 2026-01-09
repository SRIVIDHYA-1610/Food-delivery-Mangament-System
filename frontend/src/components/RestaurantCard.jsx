import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star, Clock, DollarSign, Heart } from 'lucide-react';

const RestaurantCard = ({ restaurant, onToggleFavorite, isFavorite }) => {
  return (
    <div className="relative">
      <button
        onClick={() => onToggleFavorite(restaurant._id)}
        className={`absolute right-4 top-4 z-10 p-2 rounded-full bg-white shadow-md hover:scale-105 transition-transform ${isFavorite ? 'text-primary-600' : 'text-gray-400'}`}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
      </button>
      <Link to={`/restaurant/${restaurant._id}`}>
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="relative h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden dark:bg-gray-700">
            {restaurant.image ? (
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🍽️
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 dark:text-gray-300">{restaurant.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {restaurant.cuisine.slice(0, 3).map((cuisine, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-200"
              >
                {cuisine}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <Star size={16} className="text-yellow-500 fill-current" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign size={16} />
              <span>${restaurant.minimumOrder} min</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RestaurantCard;
