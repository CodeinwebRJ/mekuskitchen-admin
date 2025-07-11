import { Button, Checkbox, Label, Textarea, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { CreateCoupon, EditCoupons, UploadImage } from 'src/AxiosConfig/AxiosConfig';
import MultiSelect from 'src/components/MultiSelect';
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
  allProducts: boolean;
  isMultiple: boolean;
  termsAndConditions: string;
  description: string;
  category: string[];
  subCategory: string[];
  ProductCategory: string[];
}

interface PreventScrollEvent extends React.WheelEvent<HTMLInputElement> {
  target: HTMLInputElement;
}

interface CreateCouponsProps {
  setShowForm: (show: boolean) => void;
  formData: any;
  setFormData: any;
  onSuccess?: any;
  setIsEdit: any;
  isEdit: boolean;
}

interface CouponFormErrors {
  code?: string;
  discountValue?: string;
  minOrderAmount?: string;
  usageLimit?: string;
  startAt?: string;
  expiresAt?: string;
  termsAndConditions?: string;
  description?: string;
  category?: string;
}

export const CreateCoupons: React.FC<CreateCouponsProps> = ({
  setShowForm,
  setFormData,
  formData,
  setIsEdit,
  isEdit,
  onSuccess,
}) => {
  const categories = useSelector((state: RootState) => state.category.categoryList);
  const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategoryType[]>([]);
  const [formErrors, setFormErrors] = useState<CouponFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.code || formData.code.trim() === '') {
      newErrors.code = 'Coupon code is required';
    }

    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      newErrors.discountValue = 'Enter a valid discount value';
    }

    if (!formData.minOrderAmount || Number(formData.minOrderAmount) <= 0) {
      newErrors.minOrderAmount = 'Enter a valid minimum order amount';
    }

    if (!formData.usageLimit || Number(formData.usageLimit) <= 0) {
      newErrors.usageLimit = 'Enter a valid usage limit';
    }

    if (!formData.startAt) {
      newErrors.startAt = 'Start date is required';
    }

    if (!formData.expiresAt) {
      newErrors.expiresAt = 'Expiry date is required';
    }

    if (formData.startAt && formData.expiresAt) {
      const start = new Date(formData.startAt);
      const end = new Date(formData.expiresAt);
      if (end < start) {
        newErrors.expiresAt = 'Expiry date must be after the start date';
      }
    }

    if (!formData.allProducts && (!formData.category || formData.category.length === 0)) {
      newErrors.category = 'At least one category is required';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[name as keyof CouponFormErrors];
      return updatedErrors;
    });
  };

  const handleMultiSelectChange = (selected: string[], field: keyof CouponFormData) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: selected,
      ...(field === 'category' && { subCategory: [], ProductCategory: [] }),
      ...(field === 'subCategory' && { ProductCategory: [] }),
    }));

    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field as keyof CouponFormErrors];
      return updatedErrors;
    });

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
    if (!validateForm()) return;
    try {
      const requiredNumbers = ['discountValue', 'minOrderAmount', 'usageLimit'];
      for (const field of requiredNumbers) {
        if (!formData[field] || Number(formData[field]) <= 0) {
          return;
        }
      }

      const startDate = new Date(formData.startAt);
      const endDate = new Date(formData.expiresAt);
      if (endDate < startDate) {
        return;
      }

      let uploadedImageUrl = '';
      if (formData.image && typeof formData.image !== 'string') {
        const uploadResult = await UploadImage([formData.image]);
        uploadedImageUrl = uploadResult?.data?.data?.images[0]?.url || '';
      }
      const payload = {
        ...formData,
        category: formData.allProducts ? [] : formData.category,
        subCategory: formData.allProducts ? [] : formData.subCategory,
        ProductCategory: formData.allProducts ? [] : formData.ProductCategory,
      };

      const data = new FormData();
      data.append('code', payload.code);
      data.append('discountType', payload.discountType);
      data.append('discountValue', payload.discountValue);
      data.append('minOrderAmount', payload.minOrderAmount);
      data.append('startAt', new Date(payload.startAt).toISOString());
      data.append('expiresAt', new Date(payload.expiresAt).toISOString());
      data.append('usageLimit', payload.usageLimit);
      data.append('isActive', String(payload.isActive));
      data.append('allProducts', String(payload.allProducts));
      data.append('isMultiple', String(payload.isMultiple));
      data.append('termsAndConditions', payload.termsAndConditions);
      data.append('description', payload.description);
      data.append(
        'image',
        uploadedImageUrl || (typeof payload.image === 'string' ? payload.image : ''),
      );

      ['category', 'subCategory', 'ProductCategory'].forEach((key) => {
        payload[key as keyof CouponFormData]?.forEach((val: string) => {
          data.append(`${key}[]`, val);
        });
      });

      if (isEdit && formData._id) {
        await EditCoupons({ couponId: formData._id, ...payload });
      } else {
        await CreateCoupon(data);
      }

      onSuccess?.();
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
        allProducts: false,
        isMultiple: false,
        termsAndConditions: '',
        description: '',
        category: [],
        subCategory: [],
        ProductCategory: [],
      });
      setIsEdit(false);
      setShowForm(false);
    } catch (error) {
      console.error('Coupon submission failed:', error);
    }
  };

  const preventScroll = (e: PreventScrollEvent) => {
    e.target.blur();
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">Create New Coupon</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="code" value="Coupon Code" />
            <TextInput
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="e.g., SAVE10"
            />
            {formErrors.code && <p className="text-red-500">{formErrors.code}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="discountType" value="Discount Type" />
            <select
              id="discountType"
              name="discountType"
              value={formData.discountType}
              onChange={handleInputChange}
              className="border rounded-md p-2"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="discountValue" value="Discount Value" />
            <TextInput
              id="discountValue"
              name="discountValue"
              type="number"
              onWheel={preventScroll}
              value={formData.discountValue}
              onChange={handleInputChange}
              placeholder="e.g., 25"
            />
            {formErrors.discountValue && <p className="text-red-500">{formErrors.discountValue}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="minOrderAmount" value="Minimum Order Amount" />
            <TextInput
              id="minOrderAmount"
              name="minOrderAmount"
              type="number"
              onWheel={preventScroll}
              value={formData.minOrderAmount}
              onChange={handleInputChange}
              placeholder="e.g., 500"
            />
            {formErrors.minOrderAmount && (
              <p className="text-red-500">{formErrors.minOrderAmount}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="startAt" value="Start Date" />
            <TextInput
              id="startAt"
              name="startAt"
              type="date"
              value={formData.startAt}
              onChange={handleInputChange}
            />
            {formErrors.startAt && <p className="text-red-500">{formErrors.startAt}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="expiresAt" value="Expiration Date" />
            <TextInput
              id="expiresAt"
              name="expiresAt"
              type="date"
              value={formData.expiresAt}
              onChange={handleInputChange}
            />
            {formErrors.expiresAt && <p className="text-red-500">{formErrors.expiresAt}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="usageLimit" value="Usage Limit" />
            <TextInput
              id="usageLimit"
              name="usageLimit"
              type="number"
              min="1"
              value={formData.usageLimit}
              onWheel={preventScroll}
              onChange={handleInputChange}
              placeholder="e.g., 100"
            />
            {formErrors.usageLimit && <p className="text-red-500">{formErrors.usageLimit}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image" value="Image" />
            <input
              type="file"
              id="image"
              name="image"
              className="border rounded-md p-2"
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  image: e.target.files?.[0] || '',
                }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <MultiSelect
              id="category"
              label="Category"
              options={categories.map((cat: CategoryType) => cat.name)}
              disabled={formData?.allProducts === true ? true : false}
              selectedValues={formData.category}
              onChange={(selected) => handleMultiSelectChange(selected, 'category')}
            />
            {formErrors.category && <p className="text-red-500">{formErrors.category}</p>}
          </div>

          <MultiSelect
            id="subCategory"
            label="Sub Category"
            disabled={formData?.allProducts === true ? true : false}
            options={subCategories.map((sub: SubCategoryType) => sub.name)}
            selectedValues={formData.subCategory}
            onChange={(selected) => handleMultiSelectChange(selected, 'subCategory')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MultiSelect
            id="ProductCategory"
            label="Product Category"
            disabled={formData?.allProducts === true ? true : false}
            options={subSubCategories.map((subSub: SubSubCategoryType) => subSub.name)}
            selectedValues={formData.ProductCategory}
            onChange={(selected) => handleMultiSelectChange(selected, 'ProductCategory')}
          />
          <div className="flex flex-col sm:flex-row gap-10 items-start sm:items-center mt-2 sm:mt-6">
            <div className="flex items-start sm:items-center gap-3">
              <Checkbox
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
              />
              <Label htmlFor="isActive" value="Is Active" />
            </div>
            <div className="flex items-start sm:items-center gap-3">
              <Checkbox
                id="isMultiple"
                name="isMultiple"
                checked={formData.isMultiple}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    isMultiple: e.target.checked,
                  }))
                }
              />
              <Label htmlFor="isMultiple" value="Is Multiple" />
            </div>
            <div className="flex items-start sm:items-center gap-3">
              <Checkbox
                id="allProducts"
                name="allProducts"
                checked={formData.allProducts}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setFormData((prev: any) => ({
                    ...prev,
                    allProducts: isChecked,
                    ...(isChecked && {
                      category: [],
                      subCategory: [],
                      ProductCategory: [],
                    }),
                  }));
                  if (isChecked) {
                    setSubCategories([]);
                    setSubSubCategories([]);
                  }
                }}
              />
              <Label htmlFor="allProducts" value="All Products" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="termsAndConditions" value="Terms and Conditions" />
            <Textarea
              id="termsAndConditions"
              name="termsAndConditions"
              value={formData.termsAndConditions}
              onChange={handleInputChange}
              placeholder="e.g., Valid only on selected items."
              rows={4}
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
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
          <Button color="gray" onClick={() => setShowForm(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button color="primary" type="submit" className="w-full sm:w-auto">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoupons;
