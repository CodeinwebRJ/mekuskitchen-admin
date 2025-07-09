import { useCallback, useEffect, useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import BasicInfo from '../BasicInfo';
import {
  CreateProduct,
  EditProduct,
  getProductById,
  UploadImage,
} from 'src/AxiosConfig/AxiosConfig';
import { MdDelete } from 'react-icons/md';
import Loading from 'src/components/Loading';
import { useLocation, useNavigate } from 'react-router';

interface Dimension {
  length: string;
  width: string;
  height: string;
  dimensionUnit: string;
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
  discount: string;
  dimensions: Dimension;
  tags: string[];
  isTaxFree: boolean;
  manageInventory: boolean;
  specifications: Record<string, string>;
  features: string[];
  aboutItem: string[];
  sku: [];
}

const SimpleProduct = () => {
  const [isEdit, setIsEdit] = useState(false);
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
    discount: '',
    brand: '',
    weight: '',
    isTaxFree: false,
    manageInventory: true,
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
    aboutItem: [],
    sku: [],
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [newFeature, setNewFeature] = useState<string>('');
  const [aboutItem, setAboutItem] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [specKey, setSpecKey] = useState<string>('');
  const [specValue, setSpecValue] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setProduct({
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
      discount: '',
      brand: '',
      weight: '',
      isTaxFree: false,
      manageInventory: true,
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
      aboutItem: [],
      sku: [],
    });
    setNewFeature('');
    setAboutItem('');
    setNewTag('');
    setSpecKey('');
    setSpecValue('');
    setErrors({});
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductById({ id: location?.state?.id });
      const edit = res?.data?.data;
      if (edit) {
        setProduct({
          name: edit.name || '',
          price: edit.price || '',
          sellingPrice: edit.sellingPrice || '',
          currency: edit.currency || '',
          description: edit.description || '',
          shortDescription: edit.shortDescription || '',
          images: edit.images || [],
          stock: edit.stock || '',
          category: edit.category || '',
          subCategory: edit.subCategory || '',
          subsubCategory: edit.subsubCategory || '',
          SKUName: edit.SKUName || '',
          discount: edit.discount || '',
          brand: edit.brand || '',
          weight: edit.weight || '',
          isTaxFree: edit.isTaxFree ?? false,
          manageInventory: edit.manageInventory ?? true,
          weightUnit: edit.weightUnit || '',
          dimensions: {
            length: edit.dimensions?.length || '',
            width: edit.dimensions?.width || '',
            height: edit.dimensions?.height || '',
            dimensionUnit: edit.dimensions?.dimensionUnit || '',
          },
          tags: edit.tags || [],
          specifications: edit.specifications || {},
          features: edit.features || [],
          aboutItem: edit.aboutItem || [],
          sku: edit.sku || [],
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location?.state?.id) {
      setIsEdit(true);
      fetchProduct();
    }
  }, [location?.state?.id]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!product.images || product.images.length === 0) {
      newErrors.images = 'Product images are required';
    }
    if (!product.name || product.name.trim() === '') newErrors.name = 'Product name is required';
    if (!product.category) newErrors.category = 'Category is required';
    if (!product.subCategory) newErrors.subCategory = 'Subcategory is required';
    if (!product.currency) newErrors.currency = 'Currency is required';
    if (!product.price) newErrors.price = 'price is required';
    if (!product.sellingPrice) newErrors.sellingPrice = 'selling price is required';
    if (
      product.price &&
      product.sellingPrice &&
      Number(product.price) <= Number(product.sellingPrice)
    ) {
      newErrors.sellingPrice = 'Selling price must be less than original price';
    }
    if (!product.SKUName || product.SKUName.trim() === '')
      newErrors.SKUName = 'SKU Name is required';
    if (!product.shortDescription || product.shortDescription.trim() === '')
      newErrors.shortDescription = 'Short description is required';
    if (!product.description || product.description.trim() === '')
      newErrors.description = 'Description is required';
    if (location.pathname === '/create-product') {
      if (!product.weight) newErrors.weight = 'Weight is required';
      if (!product.weightUnit) newErrors.weightUnit = 'Weight unit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    if (!validateForm()) return;

    try {
      setLoading(true);

      const newImageFiles: File[] = [];
      const existingImages: { url: string; isPrimary: boolean }[] = [];

      product.images.forEach((img: any, index: number) => {
        if (img?.file instanceof File) {
          newImageFiles.push(img.file);
        } else if (typeof img === 'string') {
          existingImages.push({
            url: img,
            isPrimary: index === 0,
          });
        } else if (img?.url) {
          existingImages.push({
            url: img.url,
            isPrimary: img.isPrimary ?? index === 0,
          });
        }
      });

      let uploadedImages: { url: string; isPrimary: boolean }[] = [];

      if (newImageFiles.length > 0) {
        const uploadRes = await UploadImage(newImageFiles);
        uploadedImages =
          uploadRes?.data?.data?.images?.map((img: any, index: number) => ({
            url: img.url,
            isPrimary: existingImages.length === 0 && index === 0,
          })) || [];
      }

      const formattedImages = [...existingImages, ...uploadedImages];

      const data = {
        ...product,
        images: formattedImages,
      };

      let res;
      if (isEdit && location?.state?.id) {
        res = await EditProduct({ id: location.state.id, data });
      } else {
        res = await CreateProduct(data);
      }

      if (res?.status === 200) {
        navigate('/');
        resetForm();
      }
    } catch (error) {
      console.error('Error while submitting product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = useCallback(() => {
    const trimmedFeature = newFeature.trim();
    if (trimmedFeature === '') {
      setErrors((prev) => ({ ...prev, feature: 'Please enter a valid feature' }));
      return;
    }
    if (product.features.includes(trimmedFeature)) {
      setErrors((prev) => ({ ...prev, feature: 'Feature already added' }));
      return;
    }

    setProduct((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature('');
  }, [newFeature]);

  const addAboutItem = useCallback(() => {
    const trimmedAboutItem = aboutItem.trim();
    if (trimmedAboutItem === '') {
      setErrors((prev) => ({ ...prev, aboutItem: 'Please enter a valid AboutItem' }));
      return;
    }
    if (product.aboutItem.includes(trimmedAboutItem)) {
      setErrors((prev) => ({ ...prev, aboutItem: 'AboutItem already added' }));
      return;
    }

    setProduct((prev) => ({
      ...prev,
      aboutItem: [...prev.aboutItem, aboutItem.trim()],
    }));
    setAboutItem('');
  }, [aboutItem]);

  const removeAboutItem = useCallback((index: number) => {
    setProduct((prev) => ({
      ...prev,
      aboutItem: prev.aboutItem.filter((_, i: number) => i !== index),
    }));
  }, []);

  const removeFeature = useCallback((index: number) => {
    setProduct((prev) => ({
      ...prev,
      features: prev.features.filter((_, i: number) => i !== index),
    }));
  }, []);

  const addTag = useCallback(() => {
    const trimmedTag = newTag.trim();
    if (trimmedTag === '') {
      setErrors((prev) => ({ ...prev, tag: 'Please enter a valid Tag' }));
      return;
    }
    if (product.aboutItem.includes(trimmedTag)) {
      setErrors((prev) => ({ ...prev, tag: 'Tag already added' }));
      return;
    }

    setProduct((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()],
    }));
    setNewTag('');
  }, [newTag]);

  const removeTag = useCallback((index: number) => {
    setProduct((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i: number) => i !== index),
    }));
  }, []);

  const addSpecification = useCallback(() => {
    const trimmedKey = specKey.trim();
    const trimmedValue = specValue.trim();

    if (!trimmedKey || !trimmedValue) {
      setErrors((prev) => ({
        ...prev,
        specification: 'Please enter a valid key and value.',
      }));
      return;
    }

    if (product.specifications[trimmedKey]) {
      setErrors((prev) => ({
        ...prev,
        specification: 'Specification key already exists',
      }));
      return;
    }

    setProduct((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [trimmedKey]: trimmedValue,
      },
    }));
    setSpecKey('');
    setSpecValue('');
    setErrors((prev) => {
      const { specification, ...rest } = prev;
      return rest;
    });
  }, [specKey, specValue, product.specifications]);

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow">
      {loading ? (
        <Loading />
      ) : (
        <div>
          <BasicInfo
            product={product}
            setErrors={setErrors}
            setProduct={setProduct}
            errors={errors}
          />
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Features & Specifications</h3>
            <div>
              <h4 className="text-lg font-medium text-gray-700">Tags</h4>
              <div className="flex gap-4 mb-4">
                <div className="w-full">
                  <TextInput
                    type="text"
                    value={newTag}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewTag(value);
                      if (errors.tag && value.trim() !== '') {
                        setErrors((prev) => ({ ...prev, tag: '' }));
                      }
                    }}
                    placeholder="Enter tag (e.g., Electronics)"
                    className="w-full"
                    aria-label="Add new tag"
                  />
                  {errors.tag && <span className="text-red-600">{errors.tag}</span>}
                </div>
                <div className="w-full">
                  <Button color="primary" size="sm" type="button" onClick={addTag}>
                    Add Tag
                  </Button>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <li key={index} className="flex items-center gap-2 bg-gray-100 rounded-md p-2">
                    <span className="text-gray-800">{tag}</span>
                    <div
                      className="cursor-pointer"
                      onClick={() => removeTag(index)}
                      aria-label={`Remove tag: ${tag}`}
                    >
                      <MdDelete size={20} className="text-red-600" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 mt-4">
              <h4 className="text-lg font-medium text-gray-700">Features</h4>
              <div className="flex gap-4  mb-4">
                <div className="w-full">
                  <TextInput
                    type="text"
                    value={newFeature}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewFeature(value);
                      if (errors.feature && value.trim() !== '') {
                        setErrors((prev) => ({ ...prev, feature: '' }));
                      }
                    }}
                    placeholder="Enter feature (e.g., Waterproof)"
                    className="w-full"
                  />
                  {errors.feature && <span className="text-red-600">{errors.feature}</span>}
                </div>
                <div className="w-full">
                  <Button color="primary" size="sm" type="button" onClick={addFeature}>
                    Add Feature
                  </Button>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 bg-gray-100 rounded-md p-2">
                    <span className="text-gray-800">{feature}</span>
                    <div
                      className="cursor-pointer"
                      onClick={() => removeFeature(index)}
                      aria-label={`Remove feature: ${feature}`}
                    >
                      <MdDelete size={20} className="text-red-600" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 mt-4">
              <h4 className="text-lg font-medium text-gray-700">About Product</h4>
              <div className="flex gap-4 mb-4">
                <div className="w-full">
                  <TextInput
                    type="text"
                    value={aboutItem}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAboutItem(value);
                      if (errors.aboutItem && value.trim() !== '') {
                        setErrors((prev) => ({ ...prev, aboutItem: '' }));
                      }
                    }}
                    placeholder="Enter feature (e.g., Waterproof)"
                    className="w-full"
                  />
                  {errors.aboutItem && <span className="text-red-600">{errors.aboutItem}</span>}
                </div>
                <div className="w-full">
                  <Button color="primary" size="sm" type="button" onClick={addAboutItem}>
                    Add AboutItem
                  </Button>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2">
                {product.aboutItem.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 bg-gray-100 rounded-md p-2">
                    <span className="text-gray-800">{feature}</span>
                    <div
                      className="cursor-pointer"
                      onClick={() => removeAboutItem(index)}
                      aria-label={`Remove feature: ${feature}`}
                    >
                      <MdDelete size={20} className="text-red-600" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Specifications</h4>
              <div className="flex w-full gap-4 items-start">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-4">
                    <TextInput
                      type="text"
                      value={specKey}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSpecKey(value);
                        if (errors.specification && value.trim() !== '') {
                          setErrors((prev) => ({ ...prev, specification: '' }));
                        }
                      }}
                      placeholder="Specification Key (e.g., Material)"
                      className="w-full"
                    />
                    <TextInput
                      type="text"
                      value={specValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSpecValue(value);
                        if (errors.specification && value.trim() !== '') {
                          setErrors((prev) => ({ ...prev, specification: '' }));
                        }
                      }}
                      placeholder="Specification Value (e.g., Aluminum)"
                      className="w-full"
                    />
                  </div>
                  {errors.specKey && <span className="text-red-600">{errors.specKey}</span>}
                  {errors.specValue && <span className="text-red-600">{errors.specValue}</span>}
                  {errors.specification && (
                    <span className="text-red-600">{errors.specification}</span>
                  )}
                </div>

                <div className="flex justify-start md:justify-end">
                  <Button color="primary" size="sm" onClick={addSpecification}>
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
                    <div
                      className="cursor-pointer"
                      onClick={() => removeSpecification(key)}
                      aria-label={`Remove specification: ${key}`}
                    >
                      <MdDelete size={20} className="text-red-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <Button color="primary" onClick={handleSubmit} size="lg">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default SimpleProduct;
