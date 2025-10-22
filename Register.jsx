import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .matches(/^[A-Za-z\s]+$/, 'Name must contain only letters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: yup.string().oneOf(['user', 'admin'], 'Invalid role').required('Role is required'),
});

export default function Register() {
  const {
    register,
    handleSubmit,
      reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const navigate =useNavigate()
const onSubmit = async (data) => {
  if (loading) return;
  setLoading(true);
  try {
    const response = await API.post('/auth/register', data);
    console.log(response,'response')
    if (response.status === 201) {
      toast.success('Registered successfully');
      reset();
       navigate('/login')
      return
    }
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Registration failed';
    toast.error(errorMessage);
    reset();
  } finally {
    setLoading(false);
  }}

  

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-6 border border-gray-200 relative"
    >
      <ToastContainer position="top-center" autoClose={3000} />

      <h2 className="text-2xl font-semibold text-gray-800 text-center">Create Account</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          {...register('name')}
          placeholder="Enter your name"
          className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          {...register('email')}
          placeholder="Enter your email"
          className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="relative">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          placeholder="Enter your password"
          className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 cursor-pointer text-gray-600"
        >
          {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
        </span>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
        <select
          id="role"
          {...register('role')}
          className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm ${
            errors.role ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
      >
        Register
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login here
        </Link>
      </p>
    </form>
  );
}
