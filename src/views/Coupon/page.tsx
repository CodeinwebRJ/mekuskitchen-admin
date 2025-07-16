import { Button, TextInput, ToggleSwitch } from 'flowbite-react';
import { useState, FC, useEffect, useCallback } from 'react';
import CreateCoupons from './CreateCoupon';
import { DeleteCoupons, EditCoupons, getAllCoupons } from 'src/AxiosConfig/AxiosConfig';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { format } from 'date-fns';
import Loading from 'src/components/Loading';
import NoDataFound from 'src/components/NoDataFound';
import useDebounce from 'src/Hook/useDebounce';
import DeleteDialog from 'src/components/DeleteDialog';
import { Toast } from 'src/components/Toast';

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
  allProducts: boolean;
  isTiffin: boolean;
  isMultiple: boolean;
  usedCount?: string;
  termsAndConditions: string;
  description: string;
  category: string[];
  subCategory: string[];
  ProductCategory: string[];
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
    allProducts: false,
    isMultiple: false,
    isTiffin: false,
    termsAndConditions: '',
    description: '',
    category: [],
    subCategory: [],
    ProductCategory: [],
  });
  const [data, setData] = useState<CouponFormData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponFormData | null>(null);
  const code = useDebounce(search, 500);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = { page: 1, limit: 10, code: search };
      const res = await getAllCoupons(data);
      setData(res.data.data.coupons);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      setError('Failed to load coupons. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [code]);

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
    setFormData({
      ...coupon,
      startAt: coupon.startAt ? format(new Date(coupon.startAt), 'yyyy-MM-dd') : '',
      expiresAt: coupon.expiresAt ? format(new Date(coupon.expiresAt), 'yyyy-MM-dd') : '',
    });
    setIsEdit(true);
    setShowForm(true);
  };

  const handleOpenDelete = (coupon: CouponFormData) => {
    setSelectedCoupon(coupon);
    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedCoupon(null);
  };

  const confirmDelete = async () => {
    if (!selectedCoupon?._id) return;
    setLoading(true);
    setError(null);
    try {
      await DeleteCoupons({ couponId: selectedCoupon._id });
      setData((prev) => prev.filter((coupon) => coupon._id !== selectedCoupon._id));
      setIsDeleteDialogOpen(false);
      setSelectedCoupon(null);
      Toast({ message: 'Coupon deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      setError('Failed to delete coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        <span className="text-lg sm:text-xl font-semibold text-primary">Coupons</span>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <TextInput
            placeholder="Search"
            className="w-1/3"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
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
                  allProducts: false,
                  isMultiple: false,
                  isTiffin: false,
                  termsAndConditions: '',
                  description: '',
                  category: [],
                  subCategory: [],
                  ProductCategory: [],
                });
              }
            }}
            className="w-full sm:w-auto"
          >
            {showForm ? 'Cancel' : 'Create Coupon'}
          </Button>
        </div>
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
          <div className="bg-white shadow-md rounded-md overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-blue-800">
                <tr>
                  <th className="px-4 py-3">Index</th>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Multiple</th>
                  <th className="px-4 py-3">Used</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 h-full">
                {loading ? (
                  <tr>
                    <td colSpan={8}>
                      <Loading />
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((coupon, index) => (
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
                        {coupon.startAt ? format(new Date(coupon.startAt), 'dd/MM/yyyy') : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {coupon.expiresAt
                          ? format(new Date(coupon.expiresAt), 'dd/MM/yyyy')
                          : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {coupon.discountValue} {coupon.discountType === 'percentage' ? '%' : '$'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {coupon.isMultiple ? "True" : "False"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {coupon.isMultiple ? `${coupon?.usedCount} / ${coupon?.usageLimit}` : 'NA'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <MdModeEdit
                            size={18}
                            className=" cursor-pointer"
                            onClick={() => handleEdit(coupon)}
                          />
                          <MdDelete
                            size={18}
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleOpenDelete(coupon)}
                          />
                          <ToggleSwitch
                            onChange={(checked) => handleToggleChange(coupon._id, checked)}
                            checked={coupon.isActive}
                            className="focus:ring-0"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>
                      <NoDataFound />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onCancel={handleCancelDelete}
        onDelete={confirmDelete}
        message={`Are you sure you want to delete this Coupon?`}
      />
    </div>
  );
};

export default Page;
