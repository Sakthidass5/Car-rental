// import { useForm } from 'react-hook-form';
// import API from '../services/api';

// export default function Register() {
//   const { register, handleSubmit } = useForm();

//   const onSubmit = async (data) => {
//     await API.post('/auth/register', data);
//     alert('Registered successfully');
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
//       <input {...register('name')} placeholder="Name" className="input" />
//       <input {...register('email')} placeholder="Email" className="input" />
//       <input {...register('password')} type="password" placeholder="Password" className="input" />
//       <select {...register('role')} className="input">
//         <option value="user">User</option>
//         <option value="admin">Admin</option>
//       </select>
//       <button type="submit" className="btn">Register</button>
//     </form>
//   );
// }


import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import API from '../services/api';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['user', 'admin'], 'Invalid role').required('Role is required'),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await API.post('/auth/register', data);
    alert('Registered successfully');
  };

  return (
<form
  onSubmit={handleSubmit(onSubmit)}
  className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-6 border border-gray-200"
>
  <h2 className="text-2xl font-semibold text-gray-800 text-center">Create Account</h2>

  {/* Name Field */}
  <div>
    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
    <input
      id="name"
      {...register('name')}
      placeholder="Enter your name"
      className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
        errors.name ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
  </div>

  {/* Email Field */}
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

  {/* Password Field */}
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

  {/* Role Field */}
  <div>
    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
    <select
      id="role"
      {...register('role')}
      className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
        errors.role ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">Select role</option>
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
    {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150"
  >
    Register
  </button>
</form>

  );
}

