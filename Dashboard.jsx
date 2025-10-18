import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import BookingForm from '../components/BookingForm';
import CarCard from '../components/CarCard';

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editCar, setEditCar] = useState(null);

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const res = await API.get('/cars');
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const imageFile = watch('image');

  const addMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('type', data.type);
      formData.append('price', data.price);
      formData.append('image', data.image[0]);
      return API.post('/cars', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cars']);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('type', data.type);
      formData.append('price', data.price);
      formData.append('image', data.image[0]);
      return API.put(`/cars/${editCar._id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cars']);
      reset();
      setEditCar(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/cars/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['cars']),
  });

  const onSubmit = (data) => {
    if (editCar) {
      updateMutation.mutate(data);
    } else {
      addMutation.mutate(data);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.role}</h1>

      {user?.role === 'admin' ? (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-center">Manage Cars</h2>

          {/* Add/Edit Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">Car Name</label>
              <input
                {...register('name', { required: 'Car name is required' })}
                className="input"
                placeholder="e.g. Toyota Innova"
                defaultValue={editCar?.name || ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <input
                {...register('type', { required: 'Car type is required' })}
                className="input"
                placeholder="e.g. SUV"
                defaultValue={editCar?.type || ''}
              />
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
            </div>

  <div>
  <label className="block text-sm font-medium text-gray-700">Price per day (₹)</label>
  <input
    type="text"
    {...register('price', {
      required: 'Price is required',
      validate: {
        isNumber: (value) =>
          !isNaN(value) || 'Only numeric values allowed',
        minValue: (value) =>
          Number(value) >= 100 || 'Minimum ₹100/day',
      },
    })}
    className="input"
    defaultValue={editCar?.price || ''}
    inputMode="numeric"
    pattern="[0-9]*"
  />
  {errors.price && (
    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
  )}
</div>


            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                {...register('image', {
                  required: 'Image file is required',
                  validate: {
                    fileType: (fileList) =>
                      fileList?.[0]?.type.startsWith('image/') || 'Only image files allowed',
                    fileSize: (fileList) =>
                      fileList?.[0]?.size < 2 * 1024 * 1024 || 'Max size 2MB',
                  },
                })}
                className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
              {imageFile?.[0] && (
                <img
                  src={URL.createObjectURL(imageFile[0])}
                  alt="Preview"
                  className="mt-4 w-full h-48 object-cover rounded border"
                />
              )}
            </div>

            <button type="submit" className="btn bg-blue-600 text-white w-full">
              {editCar ? 'Update Car' : 'Add Car'}
            </button>
          </form>

          {/* Car List */}
          {isLoading ? (
            <p>Loading cars...</p>
          ) : cars.length === 0 ? (
            <p className="text-gray-500 text-center">No cars available.</p>
          ) : (
            <ul className="space-y-4">
              {cars.map((car) => (
                <li
                  key={car._id}
                  className="flex justify-between items-center bg-gray-50 border border-gray-300 rounded-md p-4 hover:shadow-sm transition"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700">{car.name}</h2>
                    <p className="text-sm text-gray-500">{car.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditCar(car)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(car._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div key={car._id} className="border rounded shadow p-4">
              <CarCard car={car} />
              <BookingForm carId={car._id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
