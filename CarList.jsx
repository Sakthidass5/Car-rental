import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function CarListPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const carsQuery = useQuery({
    queryKey: ['cars'],
    queryFn: async ({ signal }) => {
      const res = await API.get('/cars', { signal });
      return res.data;
    },
  });

  const handleBooking = (car) => {
    navigate('/book', {
      state: {
        carId: car?._id,
        carDetails: {
          name: car?.name,
          type: car?.type,
          price: car?.price,
          imageUrl: car?.imageUrl,
        },
      },
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cars = carsQuery.data ?? [];
  const isLoading = carsQuery.isPending;
  const isError = carsQuery.isError;

  if (isLoading) return <p>Loading cars...</p>;
  if (isError) return <p>Failed to load cars.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car?._id} className="bg-white shadow-md rounded-lg p-4">
            <img
              src={`http://localhost:5000${car?.imageUrl}`}
              alt={car?.name}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">{car?.name}</h2>
            <p className="text-gray-600">{car?.type}</p>
            <p className="text-green-600 font-bold">₹{car?.price}</p>
            <button
              onClick={() => handleBooking(car)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
