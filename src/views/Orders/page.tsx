import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Label, Select, TextInput } from 'flowbite-react';
import dayjs from 'dayjs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import user1 from '/src/assets/images/profile/user-1.jpg';
import Loading from 'src/components/Loading';
import NoDataFound from 'src/components/NoDataFound';
import useDebounce from 'src/Hook/useDebounce';
import { getAllOrders } from 'src/AxiosConfig/AxiosConfig';
import {
  setOrders,
  setLoading,
  setFilter,
  resetFilter,
  selectFilter,
  selectLoading,
} from 'src/Store/Slices/Orders';
import { RootState } from 'src/Store/Store';

interface SKU {
  skuName?: string;
  color?: string;
  images?: string[];
}

interface ProductDetails {
  name: string;
  images?: { url: string }[];
}

interface CartItem {
  sku?: SKU;
  productDetails: ProductDetails;
  combination?: Record<string, string>;
  quantity: number;
  price: number;
}

interface CustomizedItem {
  name: string;
  price: string;
  quantity: string;
  weight?: string;
  weightUnit?: string;
  description?: string;
  included?: boolean;
}

interface TiffinMenuDetails {
  name: string;
  day: string;
  totalAmount: string;
  date: string;
  endDate: string;
  image_url: { url: string }[];
}

interface TiffinItem {
  tiffinMenuDetails: TiffinMenuDetails;
  customizedItems: CustomizedItem[];
  quantity: number;
  totalAmount: string;
  specialInstructions?: string;
  deliveryDate: string;
}

interface AddressDetails {
  shipping?: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postCode: string;
  };
  billing: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postCode: string;
  };
}

interface Order {
  _id: string;
  orderId: string | number;
  Orderdate: string;
  orderStatus: string;
  grandTotal: number;
  user: string;
  cartItems?: CartItem[];
  tiffinItems?: TiffinItem[];
  address?: AddressDetails;
}

const Page: React.FC = () => {
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);
  const loading = useSelector(selectLoading);
  const { orders } = useSelector((state: RootState) => state.orders);

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const debouncedFilter = useDebounce(filter, 500);

  const fetchOrders = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllOrders(debouncedFilter);
      dispatch(setOrders(response?.data?.data?.orders || []));
    } catch (err) {
      console.error('Error fetching orders', err);
      dispatch(setOrders([]));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [debouncedFilter]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleReset = () => dispatch(resetFilter());

  console.log(orders);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3 text-primary">Orders</h1>
      <div className="flex flex-col lg:flex-row items-end flex-wrap gap-4 mb-3 justify-between">
        <div className="w-full lg:w-1/4">
          <Label className="block text-sm font-semibold text-black">Search </Label>
          <TextInput
            name="search"
            placeholder="Search"
            value={filter.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch(setFilter({ search: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full lg:w-2/3">
          <div className="flex-1">
            <Label className="block text-sm font-semibold text-black">Start Date</Label>
            <TextInput
              name="startDate"
              type="date"
              value={filter.startDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setFilter({ startDate: e.target.value }))
              }
            />
          </div>
          <div className="flex-1">
            <Label className="block text-sm font-semibold text-black">End Date</Label>
            <TextInput
              name="endDate"
              type="date"
              value={filter.endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setFilter({ endDate: e.target.value }))
              }
            />
          </div>
          <div className="flex-1">
            <Label value="Filter By" className="mb-1 block text-sm font-medium text-gray-700" />
            <Select
              value={filter.orderFilters}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                dispatch(setFilter({ orderFilters: e.target.value }))
              }
              className="w-full"
            >
              <option value="product">Product</option>
              <option value="tiffin">Tiffin</option>
            </Select>
          </div>
          <div>
            <Button color="gray" className="w-full sm:w-auto" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </div>

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
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  <NoDataFound />
                </td>
              </tr>
            ) : (
              orders.map((order: Order) => {
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
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span>{order.user}</span>
                      </td>
                      <td className="px-4 py-3">{order.address?.billing.name}</td>
                      <td className="px-4 py-3">{order.orderId}</td>
                      <td className="px-4 py-3">
                        {order.address?.shipping?.address ||
                          order.address?.billing?.address ||
                          'N/A'}
                        ,{order.address?.shipping?.city || order.address?.billing?.city || ''},{' '}
                        {order.address?.shipping?.state || order.address?.billing?.state || ''},{' '}
                        {order.address?.shipping?.country || order.address?.billing?.country || ''}
                      </td>
                      <td className="px-4 py-3">
                        {order.address?.shipping?.postCode ||
                          order.address?.billing?.postCode ||
                          ''}
                      </td>
                      <td className="px-4 py-3">
                        {dayjs(order.Orderdate).format('DD MMM YYYY, hh:mm A')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${
                            order.orderStatus === 'Delivered' ? 'text-green-600' : 'text-blue-600'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">${order.grandTotal?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
                      </td>
                    </tr>

                    {isExpanded &&
                      (filter.orderFilters === 'product' ? (
                        <tr>
                          <td colSpan={9} className="p-0 border-0">
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
                                  {order.cartItems?.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                      <td className="px-3 py-2">
                                        <img
                                          src={
                                            item.sku?.images?.[0] ||
                                            item.productDetails?.images?.[0]?.url ||
                                            ''
                                          }
                                          className="w-12 h-12 object-cover"
                                          alt={item.productDetails?.name || 'Product'}
                                        />
                                      </td>
                                      <td className="px-3 py-2">
                                        {item.sku?.skuName || item.productDetails?.name}
                                      </td>
                                      <td className="px-3 py-2">{item.sku?.color || '-'}</td>
                                      <td className="px-3 py-2">
                                        {item.combination
                                          ? Object.entries(item.combination).map(([key, val]) => (
                                              <div key={key}>
                                                <strong>{key}</strong>: {val}
                                              </div>
                                            ))
                                          : '-'}
                                      </td>
                                      <td className="px-3 py-2">{item.quantity}</td>
                                      <td className="px-3 py-2">${item.price.toFixed(2)}</td>
                                      <td className="px-3 py-2">
                                        ${(item.quantity * item.price).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={9} className="p-0 border-0">
                            <div className="bg-white px-4 py-3 border border-t-0 border-gray-200">
                              <table className="min-w-full text-sm text-left text-gray-700">
                                <thead className="text-blue-800 text-xs uppercase">
                                  <tr>
                                    <th className="px-3 py-2">Image</th>
                                    <th className="px-3 py-2">Name</th>
                                    <th className="px-3 py-2">Day</th>
                                    <th className="px-3 py-2">Delivery Date</th>
                                    <th className="px-3 py-2">Items</th>
                                    <th className="px-3 py-2">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.tiffinItems?.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                      <td className="px-3 py-2">
                                        <div className="w-12 h-12 overflow-hidden">
                                          <img
                                            src={
                                              item.tiffinMenuDetails?.image_url?.[0]?.url ||
                                              'https://via.placeholder.com/50'
                                            }
                                            className="w-full h-full object-cover"
                                            alt={item.tiffinMenuDetails?.name}
                                          />
                                        </div>
                                      </td>
                                      <td className="px-3 py-2">{item.tiffinMenuDetails?.name}</td>
                                      <td className="px-3 py-2">{item.tiffinMenuDetails?.day}</td>
                                      <td className="px-3 py-2">
                                        {dayjs(item.deliveryDate).format('DD MMM YYYY')}
                                      </td>
                                      <td className="px-3 py-2">
                                        {item.customizedItems?.map((ci, idx) => (
                                          <div key={idx}>
                                            {ci.name} x {ci.quantity} = $
                                            {(parseFloat(ci.price) * parseInt(ci.quantity)).toFixed(
                                              2,
                                            )}
                                          </div>
                                        ))}
                                      </td>
                                      <td className="px-3 py-2">
                                        ${parseFloat(item.totalAmount).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ))}
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
