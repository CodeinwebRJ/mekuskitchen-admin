import { useState } from 'react';
import Stepper from '../Component/Stepper';
import BasicInfo from '../BasicInfo';
import SKU from './SKU';
import { Button } from 'flowbite-react';
import ProductDetail from './ProductDetails';
import { ProductSchema } from '../interface';
import { CreateProduct, UploadImage } from 'src/AxiosConfig/AxiosConfig';

const VariationsProduct = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [product, setProduct] = useState<ProductSchema>({
    name: '',
    price: '',
    sellingPrice: '',
    currency: '',
    description: '',
    shortDescription: '',
    images: [],
    stock: '',
    category: '',
    discount: '',
    SKUName: '',
    subCategory: '',
    subsubCategory: '',
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
      { name: 'SKUImages', type: 'image', isDefault: true },
    ],
    combinationFields: [],
    sku: [{ Name: '', Stock: 0, Price: 0, SKUname: '', combinations: [] }],
  });

  const steps = [1, 2, 3];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return <BasicInfo product={product} setProduct={setProduct} />;
      case 2:
        return <SKU product={product} setProduct={setProduct} />;
      case 3:
        return <ProductDetail product={product} setProduct={setProduct} />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      const fileFieldNames = product.skuFields
        .filter((field) => field.type === 'image')
        .map((field) => field.name);

      const updatedSku = await Promise.all(
        (product.sku || []).map(async (skuItem: any) => {
          const updatedFields = { ...skuItem };

          for (const fieldName of fileFieldNames) {
            const files: File[] = skuItem[fieldName];

            if (Array.isArray(files) && files.length > 0) {
              const uploadRes = await UploadImage(files);
              const uploadedImages = uploadRes?.data?.data?.images || [];
              updatedFields[fieldName] = uploadedImages.map((img: any) => img.url);
            }
          }

          return updatedFields;
        }),
      );

      const productImageFiles: File[] = product.images.map((img: any) => img.file);
      const uploadedProductImages = await UploadImage(productImageFiles);

      const formattedImages = uploadedProductImages.data.data.images.map(
        (img: any, index: number) => ({
          url: img.url,
          isPrimary: index === 0,
        }),
      );

      const data = {
        name: product.name,
        price: product.price,
        sellingPrice: product.sellingPrice,
        currency: product.currency,
        SKUName: product.SKUName,
        description: product.description,
        shortDescription: product.shortDescription,
        images: formattedImages,
        stock: product.stock,
        category: product.category,
        subCategory: product.subCategory,
        subsubCategory: product.subsubCategory,
        brand: product.brand,
        weight: product.weight,
        weightUnit: product.weightUnit,
        dimensions: product.dimensions,
        tags: product.tags,
        specifications: product.specifications,
        features: product.features,
        sku: updatedSku,
      };

      await CreateProduct(data);
    } catch (error) {
      console.error('Error while creating product:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto p-6 bg-white rounded-xl shadow">
      <div className="w-full mb-8">
        <Stepper currentStep={currentStep} steps={steps} />
      </div>

      <div className="w-full">{renderStepContent(currentStep)}</div>

      <div className="w-full flex justify-between mt-8">
        <Button onClick={handleBack} disabled={currentStep === 1} color="gray">
          Back
        </Button>
        <Button
          onClick={currentStep === steps.length ? handleSubmit : handleNext}
          color='blue'
        >
          {currentStep === steps.length ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default VariationsProduct;
