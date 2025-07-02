import { Button, ToggleSwitch } from 'flowbite-react';
import { useState, FC, useEffect, useCallback } from 'react';
import CreateCoupons from './CreateCoupon';
import { DeleteCoupons, EditCoupons, GetAllCoupons } from 'src/AxiosConfig/AxiosConfig';
import { MdDelete, MdModeEdit } from 'react-icons/md';

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
  const [isEdit, setIsEdit] = useState<boolean>(false);

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
      await EditCoupons({ couponId: id, isActive: checked });
    } catch (error) {
      console.error('Failed to update coupon status:', error);
      setError('Failed to update coupon status.');
      setData((prev) =>
        prev.map((coupon) => (coupon._id === id ? { ...coupon, isActive: !checked } : coupon)),
      );
    }
  };

  const handleEdit = (coupon: CouponFormData) => {
    setFormData({ ...coupon });
    setIsEdit(true);
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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <span className="text-lg sm:text-xl font-semibold text-blue-700">Coupons</span>
        <Button
          size="sm"
          color="primary"
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
          className="w-full sm:w-auto"
        >
          {showForm ? 'Cancel' : 'Create Coupon'}
        </Button>
      </div>

      {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

      {showForm ? (
        <CreateCoupons
          setShowForm={setShowForm}
          formData={formData}
          setFormData={setFormData}
          onSuccess={fetchCoupons}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
        />
      ) : (
        <div className="divide-y">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="bg-white shadow-md rounded-md overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Index</th>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Discount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.map((coupon, index) => (
                    <tr key={coupon._id}>
                      <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {coupon.image ? (
                          <img
                            src={coupon.image}
                            alt={coupon.code}
                            className="h-10 w-10 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/fallback-image.jpg';
                            }}
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No Image</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{coupon.code}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {coupon.discountValue} {coupon.discountType === 'percentage' ? '%' : '$'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <ToggleSwitch
                          onChange={(checked) => handleToggleChange(coupon._id, checked)}
                          checked={coupon.isActive}
                          className="focus:ring-0"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-3">
                          <MdModeEdit
                            size={18}
                            className="text-primary cursor-pointer"
                            onClick={() => handleEdit(coupon)}
                          />
                          <MdDelete
                            size={18}
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleDelete(coupon._id)}
                          />
                        </div>
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
