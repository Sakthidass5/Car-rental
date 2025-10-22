import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [editCar, setEditCar] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const imageFile = watch('image');

  const carsQuery = useQuery({
    queryKey: ['cars'],
    queryFn: async ({ signal }) => {
      const res = await API.get('/cars', { signal });
      return res.data;
    },
  });

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
      toast.success('Car added successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to add car');
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
      toast.success('Car updated successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update car');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/cars/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['cars']);
      toast.success('Car deleted');
    },
    onError: () => {
      toast.error('Failed to delete car');
    },
  });

  const resetForm = () => {
    reset({
      name: '',
      type: '',
      price: '',
      image: null,
    });
    setEditCar(null);
  };

  const onSubmit = (data) => {
    if (editCar) {
      updateMutation.mutate(data);
    } else {
      addMutation.mutate(data);
    }
  };

  const handleEdit = (car) => {
    setEditCar(car);
    reset({
      name: car.name,
      type: car.type,
      price: car.price,
      image: null,
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.role}</h1>
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
      {user?.role === 'admin' ? (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-center">Manage Cars</h2>

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
              {imageFile?.[0] ? (
                <img
                  src={URL.createObjectURL(imageFile[0])}
                  alt="Preview"
                  className="mt-4 w-full h-48 object-cover rounded border"
                />
              ) : editCar?.imageUrl ? (
                <img
                  src={`http://localhost:5000${editCar.imageUrl}`}
                  alt="Current"
                  className="mt-4 w-full h-48 object-cover rounded border"
                />
              ) : null}

            </div>

            <button type="submit" className="btn bg-blue-600 text-white w-full">
              {editCar ? 'Update Car' : 'Add Car'}
            </button>
          </form>

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
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg">
                    <img
                      src={`http://localhost:5000${car?.imageUrl}`}
                      alt={car?.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 space-y-1">
                      <h2 className="text-xl font-semibold text-gray-800 tracking-tight">{car.name}</h2>
                      <p className="text-base text-gray-600">{car.type}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => { handleEdit(car) }}
                      className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded-md shadow-sm transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(car._id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md shadow-sm transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div >

        </div>
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
