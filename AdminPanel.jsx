// import { useQuery } from '@tanstack/react-query';
// import API from '../services/api';

// export default function AdminPanel() {
//   const { data: cars = [] } = useQuery(['cars'], async () => {
//     const res = await API.get('/cars');
//     return res.data;
//   });

//   const deleteCar = async (id) => {
//     await API.delete(`/cars/${id}`);
//     alert('Car deleted');
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Manage Cars</h1>
//       {cars.map(car => (
//         <div key={car._id} className="flex justify-between items-center border p-2 mb-2">
//           <span>{car.name}</span>
//           <button onClick={() => deleteCar(car._id)} className="btn bg-red-500">Delete</button>
//         </div>
//       ))}
//     </div>
//   );
// }





import { useQuery } from '@tanstack/react-query';
import API from '../services/api';

export default function AdminPanel() {
  const { data: cars = [] } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const res = await API.get('/cars');
      return res.data;
    },
  });

  const deleteCar = async (id) => {
    await API.delete(`/cars/${id}`);
    alert('Car deleted');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Cars</h1>

      {cars.length === 0 ? (
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
              <button
                onClick={() => deleteCar(car._id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
