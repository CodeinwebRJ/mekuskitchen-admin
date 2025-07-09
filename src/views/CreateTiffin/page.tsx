import { useEffect, useState } from 'react';
import Stepper from '../CreateProduct/Component/Stepper';
import TiffinInfo from './TiffinInfo';
import Items from './Items';
import { Button } from 'flowbite-react';
import {
  Createtiffin,
  getTiffinById,
  UploadImage,
  updateTiffin,
  getAllTiffin,
} from 'src/AxiosConfig/AxiosConfig';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setTiffin } from 'src/Store/Slices/Tiffin';

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
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
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

  const fetchData = async () => {
    try {
      const id = location?.state?.id;
      if (id) {
        setIsEditMode(true);
        const { data } = await getTiffinById(id);
        const tiffin = data?.data;

        const formatDate = (dateStr: string) => {
          return dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';
        };

        setFormData({
          day: tiffin.day || '',
          date: formatDate(tiffin.date),
          endDate: formatDate(tiffin.endDate),
          description: tiffin.description || '',
          image_url: tiffin.image_url || [],
          category: tiffin.category || '',
          aboutItem: tiffin.aboutItem || [],
          totalAmount: tiffin.totalAmount || '',
          items: tiffin.items || [],
        });
      }
    } catch (error) {
      console.error('Error fetching tiffin data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location?.state?.id]);

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
        if (!item.quantity) newErrors[`item_quantity_${index}`] = 'Quantity is required';
        if (!item.quantityUnit.trim())
          newErrors[`item_quantityUnit_${index}`] = 'Quantity unit is required';
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchAllTiffin = async () => {
    try {
      const data = { day: '', Active: '', search: '' };
      const res = await getAllTiffin(data);
      dispatch(setTiffin(res?.data?.data));
    } catch (error) {
      console.error('Error fetching tiffins:', error);
    }
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

        let uploadedImages: ImageItem[] = formData.image_url
          .filter((img) => img.url && !img.file)
          .map((img, index) => ({
            url: img.url,
            isPrimary: img.isPrimary ?? index === 0,
          }));

        if (imageFiles.length > 0) {
          const uploadedRes = await UploadImage(imageFiles);
          const newlyUploaded: ImageItem[] =
            uploadedRes?.data?.data?.images?.map((img: { url: string }, index: number) => ({
              url: img.url,
              isPrimary: uploadedImages.length === 0 && index === 0,
            })) || [];

          uploadedImages = [...uploadedImages, ...newlyUploaded];
        }

        if (!uploadedImages.some((img) => img.isPrimary)) {
          if (uploadedImages.length > 0) {
            uploadedImages[0].isPrimary = true;
          }
        }

        const payload = {
          ...formData,
          image_url: uploadedImages,
        };

        if (isEditMode && location.state?.id) {
          await updateTiffin(location.state.id, payload);
        } else {
          await Createtiffin(payload);
        }
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
        navigate('/tiffin');
        fetchAllTiffin();
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
            {currentStep === steps.length ? (isEditMode ? 'Update' : 'Submit') : 'Next'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTiffin;
