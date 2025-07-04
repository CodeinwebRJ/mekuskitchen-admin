import React, { useEffect, useState, Fragment } from 'react';
import { getAllOrders } from 'src/AxiosConfig/AxiosConfig';
import user1 from '/src/assets/images/profile/user-1.jpg';
import dayjs from 'dayjs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Button, TextInput } from 'flowbite-react';
import Loading from 'src/components/Loading';
import useDebounce from 'src/Hook/useDebounce';
import NoDataFound from 'src/components/NoDataFound';

interface Combination {
  [key: string]: string;
}

interface SKU {
  skuName?: string;
  color?: string;
  images?: string[];
}

interface ProductDetails {
  name: string;
  images: { url: string }[];
}

interface CartItem {
  sku?: SKU;
  productDetails: ProductDetails;
  combination?: Combination;
  quantity: number;
  price: number;
  name: string;
}

interface Order {
  _id: string;
  user: string;
  userImg: string;
  orderId: string;
  Orderdate: string;
  orderStatus: string;
  status: string;
  totalAmount: number;
  grandTotal: number;
  cartItems: CartItem[];
}

interface OrdersResponse {
  orders: Order[];
}

const Page: React.FC = () => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [data, setData] = useState<OrdersResponse>({ orders: [] });
  const [loading, setLoading] = useState<boolean>(false);

  const [filter, setFilter] = useState({
    search: '',
    startDate: '',
    endDate: '',
    dateRange: '',
    specificDate: '',
    orderStatus: '',
    orderId: '',
  });

  const filterData = useDebounce(filter, 500);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = {
        search: filterData.search,
        startDate: filterData.startDate,
        endDate: filterData.endDate,
        dateRange: filterData.dateRange,
        specificDate: filterData.specificDate,
        orderStatus: filterData.orderStatus,
        orderId: filterData.orderId,
      };

      const res = await getAllOrders(data);
      const orders = res?.data?.data?.orders || [];
      setData({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      setData({ orders: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterData]);

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleReset = () => {
    setFilter({
      search: '',
      startDate: '',
      endDate: '',
      dateRange: '',
      specificDate: '',
      orderStatus: '',
      orderId: '',
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3 text-primary">Orders</h1>

      <form
        onSubmit={handleFilterSubmit}
        className="flex flex-col lg:flex-row items-end flex-wrap gap-4 mb-3 justify-between"
      >
        <div className="w-full lg:w-1/4">
          <TextInput
            placeholder="Search"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full lg:w-2/3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={filter.startDate}
              onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={filter.endDate}
              onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <Button type="button" onClick={handleReset} color="gray" className="w-full sm:w-auto">
              Reset
            </Button>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded-md shadow-md">
        <table className="min-w-full text-sm text-left text-gray-800 border border-gray-200">
          <thead className="text-xs uppercase bg-gray-50 text-blue-800">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            ) : data.orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <NoDataFound />
                </td>
              </tr>
            ) : (
              data.orders.map((order) => {
                const isExpanded = expandedOrderId === order._id;
                return (
                  <Fragment key={order._id}>
                    <tr
                      className="cursor-pointer hover:bg-gray-50 transition"
                      onClick={() => toggleExpand(order._id)}
                    >
                      <td className="px-4 py-3 flex gap-2 items-center">
                        <img
                          src={user1}
                          alt={order.user}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="text-sm font-medium">{order.user}</span>
                      </td>
                      <td className="px-4 py-3">{order.orderId}</td>
                      <td className="px-4 py-3">
                        {dayjs(order.Orderdate).format('DD MMM YYYY, hh:mm A')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${
                            order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">₹{order.grandTotal.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="p-0 border-0">
                          <div className="bg-white px-4 py-3 border border-t-0 border-gray-200">
                            <table className="min-w-full text-sm text-left text-gray-700">
                              <thead className="text-blue-800 text-xs uppercase">
                                <tr>
                                  <th className="px-3 py-2">Image</th>
                                  <th className="px-3 py-2">Item</th>
                                  <th className="px-3 py-2">Color</th>
                                  <th className="px-3 py-2">SKU</th>
                                  <th className="px-3 py-2">Quantity</th>
                                  <th className="px-3 py-2">Price</th>
                                  <th className="px-3 py-2">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.cartItems.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                      <img
                                        src={
                                          item.sku?.images?.[0] ||
                                          item.productDetails.images?.[0]?.url ||
                                          item.productDetails.images?.[1]?.url ||
                                          ''
                                        }
                                        alt={item.productDetails.name}
                                        className="w-12 h-12 object-cover"
                                      />
                                    </td>
                                    <td className="px-3 py-2">
                                      {item.sku?.skuName || item.productDetails.name}
                                    </td>
                                    <td className="px-3 py-2">{item.sku?.color || '-'}</td>
                                    <td className="px-3 py-2">
                                      {item.combination ? (
                                        Object.entries(item.combination).map(
                                          ([key, value]) =>
                                            key.toLowerCase() !== 'stock' && (
                                              <div key={key}>
                                                <span className="font-medium capitalize">
                                                  {key}
                                                </span>
                                                : {value}
                                              </div>
                                            ),
                                        )
                                      ) : (
                                        <div>-</div>
                                      )}
                                    </td>
                                    <td className="px-3 py-2">{item.quantity}</td>
                                    <td className="px-3 py-2">₹{item.price.toFixed(2)}</td>
                                    <td className="px-3 py-2">
                                      ₹{(item.quantity * item.price).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
