import { useCallback, useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import BasicInfo from '../BasicInfo';
import { CreateProduct, UploadImage } from 'src/AxiosConfig/AxiosConfig';
import { RiDeleteBinLine } from 'react-icons/ri';

interface Dimension {
  length: string;
  width: string;
  height: string;
  dimensionUnit: string;
}

interface SKUField {
  name: string;
  type: string;
  isDefault: boolean;
}

interface SKU {
  [key: string]: string | number | File | undefined;
  Name: string;
  Stock: number;
  Price: number;
  SKUname: string;
}

interface Product {
  name: string;
  price: string;
  sellingPrice: string;
  currency: string;
  description: string;
  shortDescription: string;
  images: File[];
  stock: string;
  category: string;
  subCategory: string;
  subsubCategory: string;
  SKUName: string;
  brand: string;
  weight: string;
  weightUnit: string;
  dimensions: Dimension;
  tags: string[];
  specifications: Record<string, string>;
  features: string[];
  skuFields: SKUField[];
  sku: SKU[];
}

const SimpleProduct = () => {
  const [product, setProduct] = useState<Product>({
    name: '',
    price: '',
    sellingPrice: '',
    currency: '',
    description: '',
    shortDescription: '',
    images: [],
    stock: '',
    category: '',
    subCategory: '',
    subsubCategory: '',
    SKUName: '',
    brand: '',
    weight: '',
    weightUnit: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
      dimensionUnit: '',
    },
    tags: [],
    specifications: {},
    features: [],
    skuFields: [
      { name: 'Name', type: 'text', isDefault: true },
      { name: 'SKUname', type: 'text', isDefault: true },
      { name: 'Stock', type: 'number', isDefault: true },
      { name: 'Price', type: 'number', isDefault: true },
    ],
    sku: [{ Name: '', Stock: 0, Price: 0, SKUname: '' }],
  });

  const [newFeature, setNewFeature] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [specKey, setSpecKey] = useState<string>('');
  const [specValue, setSpecValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const validateInput = useCallback((value: string, field: string): boolean => {
    if (!value.trim()) {
      setError(`Please enter a valid ${field}`);
      return false;
    }
    if (value.length > 100) {
      setError(`${field} cannot exceed 100 characters`);
      return false;
    }
    return true;
  }, []);

  const removeSpecification = useCallback((key: string) => {
    setProduct((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs,
      };
    });
  }, []);

  const handleSubmit = async (): Promise<void> => {
    try {
      setError(null);

      const fileFieldNames = product.skuFields
        .filter((field) => field.type === 'image')
        .map((field) => field.name);

      // Handle SKU images
      let skuImageUrls: string[] = [];
      if (fileFieldNames.length > 0 && product.sku[0]) {
        const skuImages = fileFieldNames
          .map((fieldName) => product.sku[0][fieldName])
          .filter((img): img is File => img instanceof File);

        if (skuImages.length > 0) {
          const imageRes = await UploadImage(skuImages);
          skuImageUrls = imageRes.data.data.images?.map((img: { url: string }) => img.url) || [];
        }
      }

      const uploadedProductImages = await UploadImage(product.images);
      const formattedImages =
        uploadedProductImages.data.data.images?.map((img: { url: string }, index: number) => ({
          url: img.url,
          isPrimary: index === 0,
        })) || [];

      const updatedSku = product.sku?.map((skuItem) => {
        const updatedFields = { ...skuItem };
        fileFieldNames.forEach((fieldName, index) => {
          if (skuImageUrls[index]) {
            updatedFields[fieldName] = skuImageUrls[index];
          }
        });
        return updatedFields;
      });

      const data = {
        ...product,
        images: formattedImages,
        skuImages: skuImageUrls,
        sku: updatedSku,
      };

      await CreateProduct(data);
    } catch (error) {
      console.error('Error while creating product:', error);
      setError('Failed to create product. Please try again.');
    }
  };

  const addFeature = useCallback(() => {
    if (!validateInput(newFeature, 'feature')) return;

    setProduct((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature('');
    setError(null);
  }, [newFeature, validateInput]);

  const removeFeature = useCallback((index: number) => {
    setProduct((prev) => ({
      ...prev,
      features: prev.features.filter((_, i :number) => i !== index),
    }));
  }, []);

  const addTag = useCallback(() => {
    if (!validateInput(newTag, 'tag')) return;

    setProduct((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()],
    }));
    setNewTag('');
    setError(null);
  }, [newTag, validateInput]);

  const removeTag = useCallback((index: number) => {
    setProduct((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i:number) => i !== index),
    }));
  }, []);

  const addSpecification = useCallback(() => {
    if (
      !validateInput(specKey, 'specification key') ||
      !validateInput(specValue, 'specification value')
    )
      return;

    if (product.specifications[specKey.trim()]) {
      setError('Specification key already exists');
      return;
    }

    setProduct((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specKey.trim()]: specValue.trim(),
      },
    }));
    setSpecKey('');
    setSpecValue('');
    setError(null);
  }, [specKey, specValue, product.specifications, validateInput]);

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow">
      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
      <BasicInfo product={product} setProduct={setProduct} />

      {/* Tags */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Features & Specifications</h3>

        <div>
          <h4 className="text-lg font-medium text-gray-700">Tags</h4>
          <div className="flex gap-4 items-center mb-4">
            <TextInput
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter tag (e.g., Electronics)"
              className="w-full"
              maxLength={100}
              aria-label="Add new tag"
            />
            <div className="w-full">
              <Button size="sm" type="button" onClick={addTag}>
                Add Tag
              </Button>
            </div>
          </div>
          <ul className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <li key={index} className="flex items-center gap-2 bg-gray-100 rounded-md p-2">
                <span className="text-gray-800">{tag}</span>
                <Button
                  color="failure"
                  size="xs"
                  onClick={() => removeTag(index)}
                  aria-label={`Remove tag: ${tag}`}
                >
                  <RiDeleteBinLine />
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Features */}
        <div className="mb-6 mt-4">
          <h4 className="text-lg font-medium text-gray-700">Features</h4>
          <div className="flex gap-4 items-center">
            <TextInput
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Enter feature (e.g., Waterproof)"
              className="w-full"
              maxLength={100}
            />
            <div className="w-full">
              <Button size="sm" type="button" onClick={addFeature}>
                Add Feature
              </Button>
            </div>
          </div>
          <ul className="flex flex-wrap gap-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 bg-gray-100 rounded-md p-2">
                <span className="text-gray-800">{feature}</span>
                <Button
                  color="failure"
                  size="xs"
                  onClick={() => removeFeature(index)}
                  aria-label={`Remove feature: ${feature}`}
                >
                  <RiDeleteBinLine />
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Specifications */}
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">Specifications</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <TextInput
              type="text"
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
              placeholder="Specification Key (e.g., Material)"
              maxLength={100}
            />
            <TextInput
              type="text"
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
              placeholder="Specification Value (e.g., Aluminum)"
              maxLength={100}
            />
            <div className="w-full">
              <Button size="sm" onClick={addSpecification}>
                Add Specification
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex gap-2 items-center bg-gray-100 rounded-md p-2">
                <span>
                  <span className="font-medium text-gray-800">{key}:</span> {value}
                </span>
                <Button
                  color="failure"
                  size="xs"
                  onClick={() => removeSpecification(key)}
                  aria-label={`Remove specification: ${key}`}
                >
                  <RiDeleteBinLine />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} size="lg">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default SimpleProduct;
