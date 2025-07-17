import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Select, TextInput, Label, Textarea, Checkbox } from 'flowbite-react';
import TableFileUploader from './Component/fileUploader';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

interface BasicInfoProps {
  product: any;
  setProduct: any;
  errors: any;
  setErrors: any;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ product, setErrors, setProduct, errors }) => {
  const category = useSelector((state: any) => state.category.categoryList);
  const [subCategory, setSubCategory] = useState<any[]>([]);
  const [subsubCategory, setSubSubCategory] = useState<any[]>([]);
  const location = useLocation();

  console.log(errors)

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { id, value, type } = e.target;

      if (!id) return;

      setErrors((prev: any) => ({
        ...prev,
        [id]: undefined,
      }));

      const inputValue: string | boolean =
        type === 'checkbox' && 'checked' in e.target
          ? (e.target as HTMLInputElement).checked
          : value;

      if (['length', 'width', 'height', 'dimensionUnit'].includes(id)) {
        setProduct((prev: any) => ({
          ...prev,
          dimensions: {
            ...prev.dimensions,
            [id]: inputValue,
          },
        }));
        return;
      }

      setProduct((prev: any) => {
        const updatedProduct: typeof prev = {
          ...prev,
          [id]: inputValue,
        };

        const price = parseFloat(updatedProduct.price);
        const sellingPrice = parseFloat(updatedProduct.sellingPrice);

        if (!isNaN(price) && !isNaN(sellingPrice) && price > 0) {
          const discount = Math.round(((price - sellingPrice) / price) * 100);
          updatedProduct.discount = String(discount);
        } else {
          updatedProduct.discount = '0';
        }

        return updatedProduct;
      });
    },
    [setProduct, setErrors],
  );

  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;

    setErrors((prev: any) => ({
      ...prev,
      [id]: undefined,
    }));

    setProduct((prev: any) => ({
      ...prev,
      [id]: value,
      subCategory: '',
      subsubCategory: '',
    }));
    const selectedCategory = category.find((cat: any) => cat.name === value);
    setSubCategory(selectedCategory?.subCategories || []);
    setSubSubCategory([]);
  };

  const handleSelectSubCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;

    setErrors((prev: any) => ({
      ...prev,
      [id]: undefined,
    }));

    setProduct((prev: any) => ({
      ...prev,
      [id]: value,
      subsubCategory: '',
    }));
    const selectedSub = subCategory.find((sub: any) => sub.name === value);
    setSubSubCategory(selectedSub?.subSubCategories || []);
  };

  const weightUnits = useMemo(
    () => [
      { value: '', label: 'Select Unit' },
      { value: 'g', label: 'g' },
      { value: 'kg', label: 'kg' },
      { value: 'lb', label: 'lb' },
      { value: 'oz', label: 'oz' },
    ],
    [],
  );

  const dimensionUnits = useMemo(
    () => [
      { value: '', label: 'Select Unit' },
      { value: 'cm', label: 'cm' },
      { value: 'inch', label: 'inch' },
    ],
    [],
  );

  interface PreventScrollEvent extends React.WheelEvent<HTMLInputElement> {
    target: HTMLInputElement;
  }

  const preventScroll = (e: PreventScrollEvent) => {
    e.target.blur();
  };

  useEffect(() => {
    if (product.category && category.length > 0) {
      const selectedCategory = category.find((cat: any) => cat.name === product.category);
      setSubCategory(selectedCategory?.subCategories || []);
    }
  }, [product.category, category]);

  useEffect(() => {
    if (product.subCategory && subCategory.length > 0) {
      const selectedSubCategory = subCategory.find((sub: any) => sub.name === product.subCategory);
      setSubSubCategory(selectedSubCategory?.subSubCategories || []);
    }
  }, [product.subCategory, subCategory]);

  return (
    <div>
      <h3 className="text-2xl font-bold text-primary mb-6">Product Information</h3>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <Label value="Upload Product Images*" className="text-sm font-medium text-gray-700" />
            <div>
              <TableFileUploader
                setErrors={setErrors}
                images={product.images}
                setProduct={setProduct}
              />
              {errors?.images && product.images.length === 0 && (
                <p className="text-red-600 text-sm mt-2 w-full text-left">{errors.images}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label
                value="Product Name*"
                className="block text-sm font-medium text-gray-700 mb-1"
              />
              <TextInput
                id="name"
                type="text"
                value={product.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
                className="w-full"
              />
              {errors.name && <span className="text-red-500">{errors.name}</span>}
            </div>

            <div>
              <Label value="Category*" className="block text-sm font-medium text-gray-700 mb-1" />
              <Select
                id="category"
                value={product.category}
                onChange={handleSelectCategory}
                required
                className="w-full"
              >
                <option value="">Select Category</option>
                {category.map((item: any) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </Select>
              {errors.category && <span className="text-red-500">{errors.category}</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label value="Subcategory*" className="block text-sm font-medium text-gray-700 mb-1" />
            <Select
              id="subCategory"
              value={product.subCategory}
              onChange={handleSelectSubCategory}
              className="w-full"
            >
              <option value="">Select Subcategory</option>
              {subCategory.map((item: any) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </Select>
            {errors.subCategory && <span className="text-red-500">{errors.subCategory}</span>}
          </div>
          <div>
            <Label
              value="Product category"
              className="block text-sm font-medium text-gray-700 mb-1"
            />
            <Select
              id="subsubCategory"
              value={product.subsubCategory}
              onChange={handleInputChange}
              className="w-full"
            >
              <option value="">Select Sub-subcategory</option>
              {subsubCategory.map((item: any) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </Select>
            {errors.subsubCategory && <span className="text-red-500">{errors.subsubCategory}</span>}
          </div>

          <div>
            <Label value="Currency*" className="block text-sm font-medium text-gray-700 mb-1" />
            <Select
              id="currency"
              value={product.currency}
              onChange={handleInputChange}
              className="w-full"
            >
              <option value="">Select Currency</option>
              <option value="CAD">$ - CAD</option>
            </Select>
            {errors.currency && <span className="text-red-500">{errors.currency}</span>}
          </div>
          <div>
            <Label value="Price*" className="block text-sm font-medium text-gray-700 mb-1" />
            <TextInput
              id="price"
              type="number"
              onWheel={preventScroll}
              value={product.price}
              onChange={handleInputChange}
              required
              placeholder="Enter price"
              className="w-full"
            />
            {errors.price && <span className="text-red-500">{errors.price}</span>}
          </div>

          <div>
            <Label
              value="Selling Price*"
              className="block text-sm font-medium text-gray-700 mb-1"
            />
            <TextInput
              id="sellingPrice"
              type="number"
              value={product.sellingPrice}
              onWheel={preventScroll}
              onChange={handleInputChange}
              required
              placeholder="Enter selling price"
              className="w-full"
            />
            {errors.sellingPrice && <span className="text-red-500">{errors.sellingPrice}</span>}
          </div>

          <div>
            <Label value="Discount (%)" className="block text-sm font-medium text-gray-700 mb-1" />
            <TextInput
              id="discount"
              type="number"
              onWheel={preventScroll}
              value={product.discount || '0'}
              readOnly
              disabled
              className="w-full"
            />
          </div>

          <div>
            <Label value="SKUName*" className="block text-sm font-medium text-gray-700 mb-1" />
            <TextInput
              id="SKUName"
              type="text"
              value={product.SKUName}
              onChange={handleInputChange}
              required
              placeholder="Enter SKU Name"
              className="w-full"
            />
            {errors.SKUName && <span className="text-red-500">{errors.SKUName}</span>}
          </div>

          <div>
            <Label
              value="Stock Quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            />
            <TextInput
              id="stock"
              type="number"
              onWheel={preventScroll}
              value={product.stock}
              onChange={handleInputChange}
              required
              placeholder="Enter stock quantity"
              className="w-full"
            />
          </div>

          <div>
            <Label value="Brand Name" className="block text-sm font-medium text-gray-700 mb-1" />
            <TextInput
              id="brand"
              type="text"
              value={product.brand}
              onChange={handleInputChange}
              required
              placeholder="Enter brand"
              className="w-full"
            />
          </div>
        </div>

        {location.pathname === '/create-product' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label value="Weight Unit*" />
                <Select
                  id="weightUnit"
                  value={product.weightUnit}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                  aria-required="true"
                >
                  {weightUnits.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </Select>
                {errors.weightUnit && <span className="text-red-500">{errors.weightUnit}</span>}
              </div>
              <div>
                <Label value="Weight*" />
                <TextInput
                  id="weight"
                  type="number"
                  min="0"
                  value={product.weight}
                  onChange={handleInputChange}
                  required
                  onWheel={preventScroll}
                  placeholder="Enter weight"
                  className="w-full"
                  aria-required="true"
                />
                {errors.weight && <span className="text-red-500">{errors.weight}</span>}
              </div>
              <div>
                <Label value="Dimension Unit" />
                <Select
                  id="dimensionUnit"
                  value={product.dimensions.dimensionUnit}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                  aria-required="true"
                >
                  {dimensionUnits.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label value="Length" />
                <TextInput
                  id="length"
                  type="number"
                  min="0"
                  value={product.dimensions.length}
                  onChange={handleInputChange}
                  required
                  onWheel={preventScroll}
                  placeholder="Enter length"
                  className="w-full"
                  aria-required="true"
                />
              </div>
              <div>
                <Label value="Width" />
                <TextInput
                  id="width"
                  type="number"
                  min="0"
                  value={product.dimensions.width}
                  onChange={handleInputChange}
                  required
                  onWheel={preventScroll}
                  placeholder="Enter width"
                  className="w-full"
                  aria-required="true"
                />
              </div>
              <div>
                <Label value="Height" />
                <TextInput
                  id="height"
                  type="number"
                  min="0"
                  value={product.dimensions.height}
                  onChange={handleInputChange}
                  required
                  onWheel={preventScroll}
                  placeholder="Enter height"
                  className="w-full"
                  aria-required="true"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 px-1">
            <Checkbox
              id="manageInventory"
              name="manageInventory"
              checked={product.manageInventory}
              onChange={handleInputChange}
            />
            <Label htmlFor="manageInventory" value="Manage Inventory" />
          </div>
          <div className="flex items-center gap-2 px-1">
            <div>
              <Checkbox id="isTaxFree" checked={product.isTaxFree} onChange={handleInputChange} />
            </div>
            <Label value={'Is Tax Free'} />
          </div>
        </div>

        <div>
          <Label
            value="Short Description*"
            className="block text-sm font-medium text-gray-700 mb-1"
          />
          <Textarea
            id="shortDescription"
            value={product.shortDescription}
            rows={2}
            onChange={handleInputChange}
            placeholder="Short Description"
          />
          {errors.shortDescription && <span className="text-red-500">{errors.shortDescription}</span>}
        </div>

        <div>
          <Label value="Description*" className="block text-sm font-medium text-gray-700 mb-1" />
          <Textarea
            id="description"
            value={product.description}
            rows={4}
            onChange={handleInputChange}
            placeholder="Description"
          />
          {errors.description && <span className="text-red-500">{errors.description}</span>}
        </div>
      </form>
    </div>
  );
};

export default BasicInfo;
