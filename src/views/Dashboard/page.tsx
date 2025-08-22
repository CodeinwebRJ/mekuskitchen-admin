import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { AdminDashboardData, getAllTiffinOrders, getAllTiffinItems } from 'src/AxiosConfig/AxiosConfig';
import Loading from 'src/components/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState({
    normalProductCount: 0,
    skuProductCount: 0,
    todaysOrderCount: 0,
    todaysTiffinCount: 0,
    todaysContactCount: 0,
    itemMasterCount: 0, 
  });
  const [loading, setLoading] = useState(true);

  const date = new Date().toLocaleDateString();

const fetchAllData = async () => {
  setLoading(true);
  try {
    const [dashboardRes, tiffinOrdersRes, itemsRes] = await Promise.all([
      AdminDashboardData(),
      getAllTiffinOrders({ date }),
      getAllTiffinItems({ page: 1, limit: 1000 }), // <-- send some payload
    ]);

    const { normalProductCount, skuProductCount, todaysOrderCount, todaysContactCount } =
      dashboardRes.data.data;

    const todaysTiffinCount = tiffinOrdersRes.data.data.orders.length;
    const itemMasterCount = itemsRes.data.data?.length || 0; // <-- total items

    setStats({
      normalProductCount,
      skuProductCount,
      todaysOrderCount,
      todaysTiffinCount,
      todaysContactCount,
      itemMasterCount,
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchAllData();
  }, []);

  const cardData = [
    {
      title: 'Simple Products',
      value: stats.normalProductCount,
      icon: 'solar:box-linear',
      bg: 'bg-blue-100',
      textColor: 'text-blue-700',
      link: '/simple-product',
    },
    {
      title: 'Variation Products',
      value: stats.skuProductCount,
      icon: 'solar:box-linear',
      bg: 'bg-indigo-100',
      textColor: 'text-indigo-700',
      link: '/variations-product',
    },
    {
      title: 'New Orders',
      value: stats.todaysOrderCount,
      icon: 'solar:cart-large-2-linear',
      bg: 'bg-green-100',
      textColor: 'text-green-700',
      link: '/orders',
    },
    {
      title: 'Today Tiffin Orders',
      value: stats.todaysTiffinCount,
      icon: 'solar:layers-minimalistic-linear',
      bg: 'bg-orange-100',
      textColor: 'text-orange-700',
      link: '/daily-tiffin',
    },
    {
      title: 'Customers Query',
      value: stats.todaysContactCount,
      icon: 'solar:chat-line-linear',
      bg: 'bg-pink-100',
      textColor: 'text-yellow-700',
      link: '/query',
    },
     {
      title: 'Item Master',
      value: stats.itemMasterCount, 
      icon: 'solar:chat-line-linear',
      bg: 'bg-pink-100',
      textColor: 'text-yellow-700',
      link: '/manage-item-master',
    },
  ];

  return (
    <div className="p-6 relative min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <div className='col-span-full'>
            <Loading />
          </div>
        ) : (
          cardData.map((card, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-md p-6 flex flex-col justify-between h-full ${card.bg}`}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-white mr-4">
                  <Icon icon={card.icon} width={28} className={`${card.textColor}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${card.textColor}`}>{card.title}</p>
                  <h3 className="text-xl font-bold text-gray-800">{card.value}</h3>
                </div>
              </div>
              <div className="text-right mt-auto">
                <Link
                  to={card.link}
                  className={`inline-flex items-center text-sm font-medium hover:underline ${card.textColor}`}
                >
                  View All
                  <Icon icon="solar:arrow-right-linear" className="ml-1" width={16} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
