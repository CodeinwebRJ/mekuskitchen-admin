import { useEffect, useState } from 'react';
import Stepper from '../Component/Stepper';
import BasicInfo from '../BasicInfo';
import SKU from './SKU';
import { Button } from 'flowbite-react';
import ProductDetail from './ProductDetails';
import { ProductSchema } from '../interface';
import {
  CreateProduct,
  EditProduct,
  getAllProduct,
  getProductById,
  UploadImage,
} from 'src/AxiosConfig/AxiosConfig';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/Store/Store';
import { setProducts } from 'src/Store/Slices/ProductData';
import { Toast } from 'src/components/Toast';

const VariationsProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
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
    manageInventory: true,
    isTaxFree: true,
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
    aboutItem: [],
    skuFields: [
      { name: 'Name', type: 'text', isDefault: true },
      { name: 'SKUname', type: 'text', isDefault: true },
      { name: 'Stock', type: 'number', isDefault: true },
      { name: 'SKUImages', type: 'image', isDefault: true },
    ],
    combinationFields: [],
    sku: [{ Name: '', Stock: 0, Price: 0, SKUname: '', combinations: [] }],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const steps = [1, 2, 3];
  const filterData = useSelector((state: RootState) => state.filterData);
  const [apiError, setApiError] = useState('');

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!product.images || product.images.length === 0) {
        newErrors.images = 'Product images are required';
      }
      if (product.manageInventory) {
        if (product.stock === '' || isNaN(Number(product.stock)) || Number(product.stock) < 0) {
          newErrors.stock = 'Stock quantity is required';
        }
      }
      if (!product.name || product.name.trim() === '') newErrors.name = 'Product name is required';
      if (!product.category) newErrors.category = 'Category is required';
      if (!product.subCategory) newErrors.subCategory = 'Subcategory is required';
      if (!product.currency) newErrors.currency = 'Currency is required';
      if (!product.price) newErrors.price = 'Price is required';
      if (!product.sellingPrice) newErrors.sellingPrice = 'Selling price is required';
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
    }

    if (step === 3) {
      if (!product.weight) newErrors.weight = 'Weight is required';
      if (!product.weightUnit) newErrors.weightUnit = 'Weight unit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchProducts = async () => {
    try {
      const data = {
        page: filterData.page,
        limit: '10',
        variation: filterData.variation,
      };
      const res = await getAllProduct(data);
      dispatch(setProducts(res?.data?.data));
    } catch (error: any) {
      console.error('Error fetching products:', error);
    } finally {
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <BasicInfo
            errors={errors}
            setErrors={setErrors}
            product={product}
            setProduct={setProduct}
          />
        );
      case 2:
        return <SKU errors={errors} product={product} setProduct={setProduct} />;
      case 3:
        return (
          <ProductDetail
            apiError={apiError}
            errors={errors}
            product={product}
            setProduct={setProduct}
            setErrors={setErrors}
          />
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const fetchData = async () => {
    try {
      const res = await getProductById({ id: location?.state?.id });
      const edit = res?.data?.data;

      if (edit) {
        const flattenedSku = edit.sku.map((item: any) => item.details);
        const combinationFields = edit.combinationFields?.length
          ? edit.combinationFields
          : Array.from(
              new Set(
                flattenedSku.flatMap((skuItem: any) =>
                  skuItem.combinations.flatMap((comb: any) =>
                    Object.keys(comb).filter((key) => key !== 'Price' && key !== 'Stock'),
                  ),
                ),
              ),
            ).map((name) => ({
              name,
              type: 'text',
              isDefault: false,
            }));

        setProduct({
          ...product,
          name: edit.name || '',
          price: edit.price || '',
          sellingPrice: edit.sellingPrice || '',
          currency: edit.currency || '',
          SKUName: edit.SKUName || '',
          description: edit.description || '',
          shortDescription: edit.shortDescription || '',
          images: edit.images || [],
          stock: edit.stock || '',
          category: edit.category || '',
          subCategory: edit.subCategory || '',
          subsubCategory: edit.ProductCategory || '',
          brand: edit.brand || '',
          weight: edit.weight || '',
          isTaxFree: edit.isTaxFree ?? false,
          weightUnit: edit.weightUnit || '',
          dimensions: edit.dimensions || {
            length: '',
            width: '',
            height: '',
            dimensionUnit: '',
          },
          tags: edit.tags || [],
          specifications: edit.specifications || {},
          features: edit.features || [],
          aboutItem: edit.aboutItem || [],
          sku: flattenedSku.map((skuItem: any) => ({
            ...skuItem,
            combinations: (skuItem.combinations || []).map((comb: any) => ({
              ...comb,
            })),
          })),
          skuFields: edit.skuFields?.length ? edit.skuFields : product.skuFields,
          combinationFields,
        });

        setIsEdit(true);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      const fileFieldNames = product.skuFields
        .filter((field) => field.type === 'image')
        .map((field) => field.name);

      const updatedSku = await Promise.all(
        (product.sku || []).map(async (skuItem: any) => {
          const updatedFields = { ...skuItem };

          for (const fieldName of fileFieldNames) {
            const files = skuItem[fieldName];

            if (Array.isArray(files)) {
              const newFiles: File[] = [];
              const existingUrls: string[] = [];

              for (const file of files) {
                if (file instanceof File) {
                  newFiles.push(file);
                } else if (file?.file instanceof File) {
                  newFiles.push(file.file);
                } else if (typeof file === 'string') {
                  existingUrls.push(file);
                } else if (file?.url) {
                  existingUrls.push(file.url);
                }
              }

              let uploadedImages: string[] = [];

              if (newFiles.length > 0) {
                const uploadRes = await UploadImage(newFiles);
                uploadedImages = uploadRes?.data?.data?.images?.map((img: any) => img.url) || [];
              }

              updatedFields[fieldName] = [...existingUrls, ...uploadedImages];
            }
          }

          return updatedFields;
        }),
      );

      const newProductImages: File[] = [];
      const existingProductImages: { url: string; isPrimary: boolean }[] = [];

      product.images.forEach((img: any, index: number) => {
        if (img?.file instanceof File) {
          newProductImages.push(img.file);
        } else if (img?.url) {
          existingProductImages.push({
            url: img.url,
            isPrimary: img.isPrimary ?? index === 0,
          });
        }
      });

      let uploadedProductImages: { url: string; isPrimary: boolean }[] = [];

      if (newProductImages.length > 0) {
        const uploadRes = await UploadImage(newProductImages);
        uploadedProductImages =
          uploadRes?.data?.data?.images?.map((img: any, index: number) => ({
            url: img.url,
            isPrimary: index === 0 && existingProductImages.length === 0,
          })) || [];
      }

      const formattedImages = [...existingProductImages, ...uploadedProductImages];

      const data = {
        ...product,
        images: formattedImages,
        sku: updatedSku,
      };

      if (isEdit && location?.state?.id) {
        await EditProduct({ id: location.state.id, data });
      } else {
        await CreateProduct(data);
      }
      navigate('/');
      fetchProducts();
      Toast({
        message: isEdit ? 'Product updated successfully!' : 'Product created successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error while submitting product:', error);
      const err = error as { response?: { data?: { errorData?: string } } };
      setApiError(err.response?.data?.errorData || 'Failed to create product. Please try again.');
    }
  };

  useEffect(() => {
    if (location?.state?.id) {
      setIsEdit(true);
      fetchData();
    }
  }, [location?.state?.id]);

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
        <Button onClick={currentStep === steps.length ? handleSubmit : handleNext} color="primary">
          {currentStep === steps.length ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default VariationsProduct;
