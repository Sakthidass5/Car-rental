import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocation } from 'react-router-dom';
import API from '../services/api';

const schema = yup.object().shape({
  startDate: yup
    .date()
    .required('Start date is required')
    .typeError('Invalid start date'),
  endDate: yup
    .date()
    .min(yup.ref('startDate'), 'End date must be after start date')
    .required('End date is required')
    .typeError('Invalid end date'),
});

export default function BookingForm() {
  const location = useLocation();
  const carId = location.state?.carId;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!carId) {
      alert('Car ID not found. Please go back and select a car.');
      return;
    }

    await API.post('/cars/book', { ...data, carId });
    alert('Booking confirmed');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-6 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Book This Car</h2>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          id="startDate"
          type="date"
          {...register('startDate')}
          className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.startDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          id="endDate"
          type="date"
          {...register('endDate')}
          className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.endDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150"
      >
        Book Now
      </button>
    </form>
  );
}
