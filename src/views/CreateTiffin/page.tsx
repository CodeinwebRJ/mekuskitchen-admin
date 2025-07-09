import { useState } from 'react';
import Stepper from '../CreateProduct/Component/Stepper';
import TiffinInfo from './TiffinInfo';
import Items from './Items';
import { Button } from 'flowbite-react';
import { Createtiffin, UploadImage } from 'src/AxiosConfig/AxiosConfig';

export interface TiffinItem {
  name: string;
  price: string;
  quantity: string;
  quantityUnit: string;
  description: string;
}

export interface ImageItem {
  url: string;
  public_id?: string;
  file?: File;
  isPrimary?: boolean;
}

export interface TiffinFormData {
  day: string;
  date: string;
  endDate: string;
  description: string;
  image_url: ImageItem[];
  category: string;
  aboutItem: string[];
  items: TiffinItem[];
  totalAmount: string;
}

const CreateTiffin = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<TiffinFormData>({
    day: '',
    date: '',
    endDate: '',
    description: '',
    image_url: [],
    category: '',
    aboutItem: [],
    totalAmount: '',
    items: [
      {
        name: '',
        price: '',
        quantity: '',
        quantityUnit: '',
        description: '',
      },
    ],
  });

  const steps = [1, 2];

  const validateForm = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.day.trim()) newErrors.day = 'Day is required';
      if (!formData.date.trim()) newErrors.date = 'Date is required';
      if (!formData.endDate.trim()) newErrors.endDate = 'BookingDate is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.category.trim()) newErrors.category = 'Category is required';
      if (formData.image_url.length === 0) newErrors.image_url = 'Tiffin Image is required';
    }

    if (step === 2) {
      formData.items.forEach((item, index) => {
        if (!item.name.trim()) newErrors[`item_name_${index}`] = 'Item name is required';
        if (!item.price.trim()) newErrors[`item_price_${index}`] = 'Price is required';
        if (!item.quantity.trim()) newErrors[`item_quantity_${index}`] = 'Quantity is required';
        if (!item.quantityUnit.trim())
          newErrors[`item_quantityUnit_${index}`] = 'Quantity unit is required';
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    const isValid = validateForm(currentStep);
    if (!isValid) return;

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        const imageFiles: File[] = formData.image_url
          .filter((img) => img.file instanceof File)
          .map((img) => img.file as File);

        const uploadedTiffinImages = await UploadImage(imageFiles);

        const formattedImages =
          uploadedTiffinImages?.data?.data?.images?.map((img: { url: string }, index: number) => ({
            url: img.url,
            isPrimary: index === 0,
          })) || [];

        const payload = {
          ...formData,
          image_url: formattedImages,
        };

        await Createtiffin(payload);
        setFormData({
          day: '',
          date: '',
          endDate: '',
          description: '',
          image_url: [],
          category: '',
          aboutItem: [],
          totalAmount: '',
          items: [
            {
              name: '',
              price: '',
              quantity: '',
              quantityUnit: '',
              description: '',
            },
          ],
        });
      } catch (error) {
        console.error('Failed to submit tiffin items:', error);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <TiffinInfo
            errors={errors}
            setErrors={setErrors}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <Items
            errors={errors}
            setErrors={setErrors}
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto p-6 bg-white rounded-xl shadow">
      <div className="w-full mb-8">
        <Stepper currentStep={currentStep} steps={steps} />
      </div>

      <form className="w-full">
        <div>{renderStepContent(currentStep)}</div>

        <div className="w-full flex justify-between mt-8">
          <Button onClick={handleBack} disabled={currentStep === 1} color="gray" type="button">
            Back
          </Button>

          <Button onClick={handleNext} type="button" color="blue">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTiffin;
