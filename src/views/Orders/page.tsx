import React, { useEffect, useState, Fragment } from 'react';
import { getAllOrders } from 'src/AxiosConfig/AxiosConfig';
import user1 from '/src/assets/images/profile/user-1.jpg';
import dayjs from 'dayjs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Button, TextInput } from 'flowbite-react';

// Define interfaces
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
  id?: string;
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
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const fetchOrders = async (filters: { startDate?: string; endDate?: string } = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      queryParams.append('page', '1');
      queryParams.append('limit', '20');

      const res = await getAllOrders();
      setData(res.data.data as OrdersResponse);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchOrders({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Orders</h1>
      <form
        onSubmit={handleFilterSubmit}
        className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-end"
      >
        <div className="w-full lg:w-1/3">
          <TextInput placeholder="Search" />
        </div>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <Button type="submit" color="blue">
            Filter
          </Button>
          <Button
            type="button"
            onClick={() => {
              setStartDate('');
              setEndDate('');
              fetchOrders();
            }}
            color="gray"
          >
            Reset
          </Button>
        </div>
      </form>

      <div className="overflow-x-auto bg-white">
        <table className="w-full text-sm text-left bg-white text-gray-800 border border-gray-200">
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
            {data.orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              return (
                <Fragment key={order._id}>
                  <tr
                    className="cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => toggleExpand(order._id)}
                  >
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={user1}
                        alt={order.user}
                        className="w-14 h-14 rounded object-cover"
                      />
                      <span>{order.user}</span>
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

                  <tr>
                    <td colSpan={6} className="p-0 border-0">
                      <div
                        style={{
                          maxHeight: isExpanded ? '1000px' : '0px',
                          overflow: 'hidden',
                          transition: 'max-height 0.35s ease',
                        }}
                      >
                        {isExpanded && (
                          <div className="bg-white px-4 py-3 border border-t-0 border-gray-200">
                            <table className="w-full text-sm text-left text-gray-700">
                              <thead className="text-blue-800 text-xs uppercase">
                                <tr>
                                  <th className="px-3 py-2">Image</th>
                                  <th className="px-3 py-2">Item</th>
                                  <th className="px-3 py-2">Color</th>
                                  <th className="px-3 py-2">SKU</th>
                                  <th className="px-3 py-2">Quantity</th>
                                  <th className="px-3 py-2">Price</th>
                                  <th className="px-3 py-2">Total Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.cartItems.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                      <img
                                        src={
                                          item.sku?.images?.[0] ||
                                          item.productDetails.images[0]?.url ||
                                          item.productDetails.images[1]?.url ||
                                          ''
                                        }
                                        alt={item.productDetails.name}
                                        className="w-14 h-14 object-cover"
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
                        )}
                      </div>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
