import { useEffect, useState } from 'react';
import { getAllQuarys } from 'src/AxiosConfig/AxiosConfig';

interface Quarries {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactPage = () => {
  const [data, setData] = useState<Quarries[]>([]);

  const fetchData = async () => {
    try {
      const response = await getAllQuarys();
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Quarries</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-md">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-blue-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 whitespace-nowrap">{item?.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item?.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item?.phone}</td>
                <td className="px-4 py-3 ">{item?.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactPage;
