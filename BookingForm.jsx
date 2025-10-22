import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../services/api';
import useAuth from '../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const today = new Date();
today.setHours(0, 0, 0, 0);

const schema = yup.object().shape({
  startDate: yup
    .date()
    .required('Start date is required')
    .min(today, 'Start date cannot be earlier than today')
    .typeError('Invalid start date'),
  endDate: yup
    .date()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End date must be after start date')
    .typeError('Invalid end date'),
});

export default function BookingForm() {
  const location = useLocation();
  const carId = location.state?.carId;
  const carDetails = location.state?.carDetails;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [days, setDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        setDays(diffDays);
        setTotalPrice(diffDays * carDetails?.price || 0);
      } else {
        setDays(0);
        setTotalPrice(0);
      }
    } else {
      setDays(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, carDetails]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  const onSubmit = async (data) => {
    if (!carId) {
      toast.error('Car ID not found. Please go back and select a car.');
      return;
    }

    if (user?.role === 'admin') {
      toast.error('Only users are allowed to book cars.');
      return;
    }
    try {
      const res = await API.post('/cars/book', { ...data, carId });
      console.log(res, 'res')
      reset();
      setDays(0);
      setTotalPrice(0);
      toast.success('Booking confirmed');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-end gap-4 mb-6">
        <Link
          to="/cars"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Cars
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          {carDetails ? (
            <>
              <img
                src={`http://localhost:5000${carDetails.imageUrl}`}
                alt={carDetails.name}
                className="w-full h-48 object-cover rounded-md border"
              />
              <h3 className="text-xl font-bold mt-4">{carDetails.name}</h3>
              <p className="text-gray-600 mt-2">Type: {carDetails.type}</p>
              <p className="text-gray-600">Price per day: ₹{carDetails.price}</p>
              {days > 0 && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <p className="text-gray-700 font-medium">Booking Duration: {days} day(s)</p>
                  <p className="text-gray-700 font-medium">Total Price: ₹{totalPrice}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-red-600">Car details not available.</p>
          )}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded-lg p-6 space-y-6 border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Book This Car</h2>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              {...register('startDate')}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm ${errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              {...register('endDate')}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={user?.role === 'admin'}
            className={`w-full py-2 px-4 font-semibold rounded-md transition ${user?.role === 'admin'
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            Book Now
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
