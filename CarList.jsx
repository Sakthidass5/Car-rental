import { useNavigate } from 'react-router-dom';

export default function CarCard({ car }) {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate('/book', { state: { carId: car._id } });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 p-5 max-w-sm mx-auto">
      <div className="w-full h-48 overflow-hidden rounded-md">
        <img
          src={car?.imageUrl}
          alt={car?.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-4 space-y-1">
        <h2 className="text-xl font-semibold text-gray-800">{car?.name}</h2>
        <p className="text-sm text-gray-500">{car?.type}</p>
        <p className="text-green-600 font-bold text-lg">₹{car?.price}/day</p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleBooking}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Book Now
        </button>
        <span className="text-xs text-gray-400">ID: {car?._id}</span>
      </div>
    </div>
  );
}
