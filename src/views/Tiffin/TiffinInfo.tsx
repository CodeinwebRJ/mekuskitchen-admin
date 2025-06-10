import { Select, TextInput, Label, Textarea, Button } from 'flowbite-react';
import { useState } from 'react';
// import TableFileUploader from '../Product/fileUploader';

const TiffinInfo: React.FC = () => {
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    subCategory: '',
    image_url: '',
    title: '',
    description: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800">Product Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* File Uploader */}
          <div className="col-span-1">
            <Label value="Upload Product Images" className="text-sm font-medium text-gray-700" />
            {/* <TableFileUploader /> */}
          </div>

          {/* Product Name */}
          <div className="flex flex-col gap-3">
            <div>
              <Label value="Product Name" className="text-sm font-medium text-gray-700" />
              <TextInput
                id="product_name"
                type="text"
                value={formData.product_name}
                onChange={handleInputChange}
                required
                placeholder="Tiffin Day"
                className="mt-1"
                color={formData.product_name ? 'success' : 'gray'}
              />
            </div>
            <div>
              <Label value="Category" className="text-sm font-medium text-gray-700" />
              <Select
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="mt-1"
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports</option>
              </Select>
            </div>
            <div>
              <Label value="Subcategory" className="text-sm font-medium text-gray-700" />
              <Select
                id="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="mt-1"
              >
                <option value="">Select Subcategory</option>
                <option value="phones">Phones</option>
                <option value="laptops">Laptops</option>
                <option value="shirts">Shirts</option>
                <option value="furniture">Furniture</option>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label value="Title" className="text-sm font-medium text-gray-700" />
            <TextInput
              id="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter product title"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-3">
            <Label value="Description" className="text-sm font-medium text-gray-700" />
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows={4}
              className="mt-1"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit">
            Save Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TiffinInfo;
