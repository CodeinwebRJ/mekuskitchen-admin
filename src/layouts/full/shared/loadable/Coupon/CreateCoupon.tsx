import { Button, Checkbox, Label, Textarea, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateCoupon } from 'src/AxiosConfig/AxiosConfig';
import MultiSelect from 'src/components/MultiSelect';
import { createCoupon } from 'src/Store/Slices/Coupon';
import { RootState } from 'src/Store/Store';

interface SubSubCategoryType {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface SubCategoryType {
  _id: string;
  name: string;
  isActive: boolean;
  subSubCategories: SubSubCategoryType[];
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryType {
  _id: string;
  name: string;
  subCategories: SubCategoryType[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CouponFormData {
  code: string;
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

interface CreateCouponsProps {
  setShowForm: (show: boolean) => void;
  formData: any;
  setFormData: any;
  onSuccess?: any;
}

export const CreateCoupons: React.FC<CreateCouponsProps> = ({
  setShowForm,
  setFormData,
  formData,
  // onSuccess,
}) => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.category.categoryList);
  const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategoryType[]>([]);

  const formatDateToDDMMYYYY = (date: string): string => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const handleMultiSelectChange = (selected: string[], field: keyof CouponFormData) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: selected,
      ...(field === 'category' && { subCategory: [], productCategory: [] }),
      ...(field === 'subCategory' && { productCategory: [] }),
    }));

    if (field === 'category') {
      const selectedCategories = categories.filter((cat) => selected.includes(cat.name));
      const newSubCategories = selectedCategories.flatMap((cat) => cat.subCategories);
      setSubCategories(newSubCategories);
      setSubSubCategories([]);
    } else if (field === 'subCategory') {
      const selectedSubCategories = subCategories.filter((sub) => selected.includes(sub.name));
      const newSubSubCategories = selectedSubCategories.flatMap((sub) => sub.subSubCategories);
      setSubSubCategories(newSubSubCategories);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (new Date(formData.expiresAt) < new Date(formData.startAt)) {
        alert('Expiration date must be after start date');
        return;
      }

      if (
        !formData.code ||
        !formData.discountValue ||
        !formData.minOrderAmount ||
        !formData.usageLimit ||
        Number(formData.discountValue) <= 0 ||
        Number(formData.minOrderAmount) <= 0 ||
        Number(formData.usageLimit) <= 0
      ) {
        alert('All numeric fields must be positive numbers');
        return;
      }

      const couponData = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount),
        usageLimit: Number(formData.usageLimit),
        startAt: formatDateToDDMMYYYY(formData.startAt),
        expiresAt: formatDateToDDMMYYYY(formData.expiresAt),
      };

      const res = await CreateCoupon(couponData);
      dispatch(createCoupon(res.data.data));
      setFormData({
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

      setShowForm(false);
    } catch (error) {
      console.error('Submit Error:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <h3 className="text-lg font-semibold text-gray-700">Create New Coupon</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="code" value="Coupon Code" />
            <TextInput
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="e.g., SAVE10"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="discountType" value="Discount Type" />
            <select
              id="discountType"
              name="discountType"
              value={formData.discountType}
              onChange={handleInputChange}
              className="border rounded-md p-2"
              required
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="discountValue" value="Discount Value" />
            <TextInput
              id="discountValue"
              name="discountValue"
              type="number"
              min="0"
              step="0.01"
              value={formData.discountValue}
              onChange={handleInputChange}
              placeholder="e.g., 25"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="minOrderAmount" value="Minimum Order Amount" />
            <TextInput
              id="minOrderAmount"
              name="minOrderAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.minOrderAmount}
              onChange={handleInputChange}
              placeholder="e.g., 500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="startAt" value="Start Date" />
            <TextInput
              id="startAt"
              name="startAt"
              type="date"
              value={formData.startAt}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="expiresAt" value="Expiration Date" />
            <TextInput
              id="expiresAt"
              name="expiresAt"
              type="date"
              value={formData.expiresAt}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="usageLimit" value="Usage Limit" />
            <TextInput
              id="usageLimit"
              name="usageLimit"
              type="number"
              min="1"
              value={formData.usageLimit}
              onChange={handleInputChange}
              placeholder="e.g., 100"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image" value="Image URL" />
            <TextInput
              type="file"
              id="image"
              name="image"
              className="p-0"
              value={formData.image}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MultiSelect
            id="category"
            label="Category"
            options={categories.map((cat: CategoryType) => cat.name)}
            selectedValues={formData.category}
            onChange={(selected) => handleMultiSelectChange(selected, 'category')}
            required
          />
          <MultiSelect
            id="subCategory"
            label="Sub Category"
            options={subCategories.map((sub: SubCategoryType) => sub.name)}
            selectedValues={formData.subCategory}
            onChange={(selected) => handleMultiSelectChange(selected, 'subCategory')}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MultiSelect
            id="productCategory"
            label="Product Category"
            options={subSubCategories.map((subSub: SubSubCategoryType) => subSub.name)}
            selectedValues={formData.productCategory}
            onChange={(selected) => handleMultiSelectChange(selected, 'productCategory')}
            required
          />
          <div className="flex items-center gap-4 mt-6 px-4">
            <Checkbox id="isActive" checked={formData.isActive} onChange={handleCheckboxChange} />
            <Label htmlFor="isActive" value="Is Active" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="termsAndConditions" value="Terms and Conditions" />
            <Textarea
              id="termsAndConditions"
              name="termsAndConditions"
              value={formData.termsAndConditions}
              onChange={handleInputChange}
              placeholder="e.g., Valid only on selected items."
              rows={4}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Save 25% on orders above ₹500 this May!"
              rows={4}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button color="gray" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
          <Button type="submit">Create Coupon</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoupons;
