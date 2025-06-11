import { Button, ToggleSwitch } from 'flowbite-react';
import { useState, FC, useEffect, useCallback } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';
import CreateCoupons from './CreateCoupon';
import { DeleteCoupons, EditCoupons, GetAllCoupons } from 'src/AxiosConfig/AxiosConfig';

interface CouponFormData {
  _id?: string;
  code?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
  minOrderAmount: string;
  startAt: string;
  expiresAt: string;
  usageLimit: string;
  image: string;
  isActive: boolean;
  termsAndConditions: string;
  description: string;
  category: string[];
  subCategory: string[];
  productCategory: string[];
}

const Page: FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<CouponFormData>({
    _id: '',
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    startAt: '',
    expiresAt: '',
    usageLimit: '',
    image: '',
    isActive: true,
    termsAndConditions: '',
    description: '',
    category: [],
    subCategory: [],
    productCategory: [],
  });
  const [data, setData] = useState<CouponFormData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await GetAllCoupons({ page: 1, limit: 10 });
      setData(res.data.data.coupons);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      setError('Failed to load coupons. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleToggleChange = async (id: any, checked: boolean) => {
    try {
      setData((prev) =>
        prev.map((coupon) => (coupon._id === id ? { ...coupon, isActive: checked } : coupon)),
      );
      await EditCoupons({ _id: id, isActive: checked });
    } catch (error) {
      console.error('Failed to update coupon status:', error);
      setError('Failed to update coupon status.');
      // Revert state on failure
      setData((prev) =>
        prev.map((coupon) => (coupon._id === id ? { ...coupon, isActive: !checked } : coupon)),
      );
    }
  };

  const handleEdit = (coupon: CouponFormData) => {
    setFormData(coupon);
    setShowForm(true);
  };

  const handleDelete = async (id: any) => {
    setLoading(true);
    setError(null);
    try {
      await DeleteCoupons({ couponId: id });
      setData((prev) => prev.filter((coupon) => coupon._id !== id));
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      setError('Failed to delete coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <span className="text-xl font-semibold text-gray-700">Coupons</span>
        <Button
          color="blue"
          size="sm"
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setFormData({
                _id: '',
                code: '',
                discountType: 'percentage',
                discountValue: '',
                minOrderAmount: '',
                startAt: '',
                expiresAt: '',
                usageLimit: '',
                image: '',
                isActive: true,
                termsAndConditions: '',
                description: '',
                category: [],
                subCategory: [],
                productCategory: [],
              });
            }
          }}
        >
          {showForm ? 'Cancel' : 'Create Coupon'}
        </Button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {showForm ? (
        <CreateCoupons
          setShowForm={setShowForm}
          formData={formData}
          setFormData={setFormData}
          // onSuccess={fetchCoupons}
        />
      ) : (
        <div className="divide-y">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="bg-white shadow-md rounded-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.map((coupon) => (
                    <tr key={coupon._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {coupon.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coupon.discountValue} {coupon.discountType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <ToggleSwitch
                          onChange={(checked) => handleToggleChange(coupon._id, checked)}
                          checked={coupon.isActive}
                          className="focus:ring-0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          className="text-blue-500 hover:text-blue-700 mr-4"
                          title="Edit"
                          onClick={() => handleEdit(coupon)}
                        >
                          <FiEdit size={18} />
                        </Button>
                        <Button
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                          onClick={() => handleDelete(coupon._id)}
                        >
                          <FiTrash size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
