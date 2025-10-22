import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import API from '../services/api';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await API.post('/auth/login', data);
      const userInfo = {
        token: res.data.token,
        role: res.data.role,
      };
      login(userInfo.token, userInfo.role);
      localStorage.setItem('user', JSON.stringify(userInfo));
      toast.success(res.data.message || 'Login successful');
      reset();
      navigate(res.data.role === 'admin' ? '/dashboard' : '/cars');
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed. Please check your credentials.';
      toast.error(message);
      reset();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full bg-white shadow-md rounded-lg p-6 space-y-6 border border-gray-200"
      >
        <ToastContainer position="top-center" autoClose={3000} />

        <h2 className="text-2xl font-semibold text-gray-800 text-center">Login to Your Account</h2>

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

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition duration-150"
        >
          Login
        </button>
      </form>
    </div>
  );
}
