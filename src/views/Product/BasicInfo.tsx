import React, { useCallback, useState } from 'react';
import { Select, TextInput, Label, Textarea } from 'flowbite-react';
import TableFileUploader from './Component/fileUploader';
import { useSelector } from 'react-redux';

// export interface Product {
//   name: string;
//   category: string;
//   subCategory: string;
//   subsubCategory: string;
//   currency: string;
//   price: string;
//   sellingPrice: string;
//   discount?: string;
//   SKUName: string;
//   stock: string;
//   brand: string;
//   shortDescription: string;
//   description: string;
//   images: ImageItem[];
//   [key: string]: any;
// }

interface BasicInfoProps {
  product: any;
  setProduct: any;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ product, setProduct }) => {
  const category = useSelector((state: any) => state.category.categoryList);
  const [subCategory, setSubCategory] = useState<any[]>([]);
  const [subsubCategory, setSubSubCategory] = useState<any[]>([]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;

      setProduct((prev: any) => {
        const updatedProduct = { ...prev, [id]: value };

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
    [setProduct],
  );

  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
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
    setProduct((prev: any) => ({
      ...prev,
      [id]: value,
      subsubCategory: '',
    }));
    const selectedSub = subCategory.find((sub: any) => sub.name === value);
    setSubSubCategory(selectedSub?.subSubCategories || []);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Information</h3>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <Label value="Upload Product Images" className="text-sm font-medium text-gray-700" />
            <div className="bg-gray-50 mt-2">
              <TableFileUploader images={product.images} setProduct={setProduct} />
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
                color={product.name ? 'success' : 'gray'}
              />
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
          </div>
          <div>
            <Label
              value="Product Subcategory*"
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
          </div>

          <div>
            <Label value="Currency" className="block text-sm font-medium text-gray-700 mb-1" />
            <Select
              id="currency"
              value={product.currency}
              onChange={handleInputChange}
              className="w-full"
            >
              <option value="">Select Currency</option>
              <option value="usd">$ - USD</option>
              <option value="inr">₹ - INR</option>
            </Select>
          </div>
          <div>
            <Label value="Price*" className="block text-sm font-medium text-gray-700 mb-1" />
            <TextInput
              id="price"
              type="number"
              value={product.price}
              onChange={handleInputChange}
              required
              placeholder="Enter price"
              className="w-full"
            />
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
              onChange={handleInputChange}
              required
              placeholder="Enter selling price"
              className="w-full"
            />
          </div>

          <div>
            <Label value="Discount (%)" className="block text-sm font-medium text-gray-700 mb-1" />
            <TextInput
              id="discount"
              type="number"
              value={product.discount || '0'}
              readOnly
              className="w-full bg-gray-100 cursor-not-allowed"
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
          </div>

          <div>
            <Label
              value="Stock Quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            />
            <TextInput
              id="stock"
              type="number"
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

        <div>
          <Label
            value="Short Description"
            className="block text-sm font-medium text-gray-700 mb-1"
          />
          <Textarea
            id="shortDescription"
            value={product.shortDescription}
            rows={2}
            onChange={handleInputChange}
            placeholder="Short Description"
            required
          />
        </div>

        <div>
          <Label value="Description" className="block text-sm font-medium text-gray-700 mb-1" />
          <Textarea
            id="description"
            value={product.description}
            rows={4}
            onChange={handleInputChange}
            placeholder="Description"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default BasicInfo;
