import { TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { getAllQuarys } from 'src/AxiosConfig/AxiosConfig';
import Loading from 'src/components/Loading';
import NoDataFound from 'src/components/NoDataFound';
import useDebounce from 'src/Hook/useDebounce';

interface Quarries {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactPage = () => {
  const [data, setData] = useState<Quarries[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const searchData = useDebounce(search, 500);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllQuarys({ search });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchData]);

  return (
    <div>
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-primary mb-3">Query</h1>
        <div>
          <TextInput
            placeholder="Search"
            className="w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

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
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  <NoDataFound />
                </td>
              </tr>
            ) : (
              data?.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 whitespace-nowrap">{item?.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item?.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item?.phone}</td>
                  <td className="px-4 py-3 ">{item?.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactPage;
