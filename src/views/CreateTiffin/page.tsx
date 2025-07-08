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
  BookingEndDate: string;
  description: string;
  images: ImageItem[];
  category: string;
  aboutItem: string[];
  items: TiffinItem[];
}

const CreateTiffin = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const steps = [1, 2];

  const [formData, setFormData] = useState<TiffinFormData>({
    day: '',
    date: '',
    BookingEndDate: '',
    description: '',
    images: [],
    category: '',
    aboutItem: [],
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

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        const imageFiles: File[] = formData.images
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
          images: formattedImages,
        };

        await Createtiffin(payload);
        setFormData({
          day: '',
          date: '',
          BookingEndDate: '',
          description: '',
          images: [],
          category: '',
          aboutItem: [],
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
        return <TiffinInfo formData={formData} setFormData={setFormData} />;
      case 2:
        return <Items formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  // };

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
