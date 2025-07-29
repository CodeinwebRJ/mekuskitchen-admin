import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import dayjs from 'dayjs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import user1 from '/src/assets/images/profile/user-1.jpg';
import Loading from 'src/components/Loading';
import NoDataFound from 'src/components/NoDataFound';
import useDebounce from 'src/Hook/useDebounce';
import { getAllTiffinOrders } from 'src/AxiosConfig/AxiosConfig';

const DailyTiffin: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    search: '',
    date: dayjs().format('YYYY-MM-DD'),
    page: 1,
    limit: 10,
  });

  const debouncedFilter = useDebounce(filter, 500);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllTiffinOrders(debouncedFilter);
      setOrders(response?.data?.data?.orders || []);
    } catch (err) {
      console.error('Error fetching tiffin orders', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [debouncedFilter]);

  const toggleExpand = (orderId: string) =>
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));

  const handleReset = () =>
    setFilter({
      search: '',
      date: '',
      page: 1,
      limit: 10,
    });

  const summary = useMemo(() => {
    let totalOrders = orders.length;
    let totalPrice = 0;
    const itemSummary: Record<string, { quantity: number; weight?: string; weightUnit?: string }> =
      {};

    orders.forEach((order) => {
      totalPrice += order.grandTotal || 0;

      order.tiffinItems?.forEach((tiffin: any) => {
        const tiffinQty = tiffin.quantity || 0;
        tiffin.customizedItems?.forEach((item: any) => {
          const name = item.name?.trim() || 'Unnamed';
          const itemQty = parseInt(item.quantity || '0') * tiffinQty;

          if (itemSummary[name]) {
            itemSummary[name].quantity += itemQty;
          } else {
            itemSummary[name] = {
              quantity: itemQty,
              weight: item.weight || '',
              weightUnit: item.weightUnit || '',
            };
          }
        });
      });
    });

    return {
      totalOrders,
      totalPrice: totalPrice.toFixed(2),
      itemSummary,
    };
  }, [orders]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3 text-primary">Tiffin Orders</h1>

      <div className="flex flex-col lg:flex-row items-end gap-4 mb-3 justify-between">
        <div className="w-full lg:w-1/4">
          <Label className="text-sm font-semibold text-black">Search</Label>
          <TextInput
            placeholder="Search"
            value={filter.search}
            onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full items-end lg:w-1/3">
          <div className="flex-1">
            <Label className="text-sm font-semibold text-black">Date</Label>
            <TextInput
              type="date"
              value={filter.date}
              onChange={(e) => setFilter((prev) => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <Button color="gray" className="w-full sm:w-auto" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md shadow mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Order Summary</h2>
        <div className="text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-800">Total Tiffin Orders:</span>{' '}
            {summary.totalOrders}
          </div>
          <div>
            <span className="font-medium text-gray-800">Total Amount:</span> ${summary.totalPrice}
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mt-2">Items Summary:</h3>
            <ul className="list-disc list-inside mt-1">
              {Object.entries(summary.itemSummary).map(([name, data], idx) => (
                <li key={idx}>
                  {name} - {data.quantity} Qty
                  {data.weight && (
                    <span className="text-gray-500">
                      {' '}
                      ({data.weight} {data.weightUnit} / Qty)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-md shadow-md">
        <table className="min-w-full text-sm text-left text-gray-800 border border-gray-200">
          <thead className="text-xs uppercase bg-gray-50 text-blue-800">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Post Code</th>
              <th className="px-4 py-3">Ordered Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  <NoDataFound />
                </td>
              </tr>
            ) : (
              orders.map((order: any) => {
                const isExpanded = expandedOrderId === order._id;
                const address = order.address?.shipping || order.address?.billing;

                return (
                  <Fragment key={order._id}>
                    <tr
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleExpand(order._id)}
                    >
                      <td className="px-4 py-3 flex items-center gap-2">
                        <img src={user1} alt={order.user} className="w-10 h-10 rounded-full" />
                        <span>{order.user}</span>
                      </td>
                      <td className="px-4 py-3">{order.address?.billing.name || 'N/A'}</td>
                      <td className="px-4 py-3">{order.orderId}</td>
                      <td className="px-4 py-3">
                        {[address?.address, address?.city, address?.state, address?.country]
                          .filter(Boolean)
                          .join(', ')}
                      </td>
                      <td className="px-4 py-3">{address?.postCode || ''}</td>
                      <td className="px-4 py-3">
                        {dayjs(order.Orderdate).format('DD MMM YYYY, hh:mm A')}
                      </td>
                      <td className="px-4 py-3">${order.grandTotal?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={9} className="p-0 border-0">
                          <div className="bg-white px-4 py-3 border border-t-0 border-gray-200">
                            <table className="min-w-full text-sm text-left text-gray-700">
                              <thead className="text-blue-800 text-xs uppercase">
                                <tr>
                                  <th className="px-3 py-2">Image</th>
                                  <th className="px-3 py-2">Name</th>
                                  <th className="px-3 py-2">Day</th>
                                  <th className="px-3 py-2">Qty</th>
                                  <th className="px-3 py-2">Delivery Date</th>
                                  <th className="px-3 py-2">Items</th>
                                  <th className="px-3 py-2">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.tiffinItems?.map((item: any, i: number) => (
                                  <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                      <img
                                        src={
                                          item.tiffinMenuDetails.image_url?.[0]?.url ||
                                          'https://via.placeholder.com/50'
                                        }
                                        className="w-12 h-12 object-cover"
                                      />
                                    </td>
                                    <td className="px-3 py-2">{item.tiffinMenuDetails.name}</td>
                                    <td className="px-3 py-2">{item.tiffinMenuDetails.day}</td>
                                    <td className="px-3 py-2">{item.quantity}</td>
                                    <td className="px-3 py-2">
                                      {dayjs(item.deliveryDate).format('DD MMM YYYY')}
                                    </td>
                                    <td className="px-3 py-2 space-y-1">
                                      {item.customizedItems.map((ci: any, idx: number) => {
                                        const qty = parseInt(ci.quantity || '0');
                                        const price = parseFloat(ci.price || '0');
                                        const subtotal = (qty * price).toFixed(2);
                                        return (
                                          <div key={idx}>
                                            {ci.name} x {qty} = ${subtotal}
                                          </div>
                                        );
                                      })}
                                    </td>
                                    <td className="px-3 py-2">${item.totalAmount}</td>
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

export default DailyTiffin;
