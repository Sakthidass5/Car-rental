
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import API from '../services/api';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await API.post('/auth/login', data);
    console.log(res,'res')
    login(res.data.token, res.data.role);
    navigate(res.data.role === 'admin' ? '/dashboard' : '/cars');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-6 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Login to Your Account</h2>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          {...register('email')}
          placeholder="Enter your email"
          className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          placeholder="Enter your password"
          className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150"
      >
        Login
      </button>
    </form>
  );
}



