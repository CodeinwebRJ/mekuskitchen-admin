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
import { Toast } from 'src/components/Toast';
import Loading from 'src/components/Loading';

export interface TiffinItem {
  name: string;
  price: string;
  quantity: string;
  weightUnit: string;
  weight: string;
  description: string;
}

export interface ImageItem {
  url: string;
  public_id?: string;
  file?: File;
  isPrimary?: boolean;
}

export interface TiffinFormData {
  name: string;
  day: string;
  date: string;
  endDate: string;
  description: string;
  image_url: ImageItem[];
  isCustomized: boolean;
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
    name: '',
    day: '',
    date: '',
    endDate: '',
    description: '',
    image_url: [],
    isCustomized: true,
    aboutItem: [],
    totalAmount: '',
    items: [
      {
        name: '',
        price: '',
        quantity: '',
        weightUnit: '',
        weight: '',
        description: '',
      },
    ],
  });
  const [loading, setLoading] = useState<boolean>(false);

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

        const updatedForm = {
          name: tiffin.name || '',
          day: tiffin.day || '',
          date: formatDate(tiffin.date),
          endDate: formatDate(tiffin.endDate),
          description: tiffin.description || '',
          image_url: tiffin.image_url || [],
          isCustomized: tiffin.isCustomized || false,
          aboutItem: tiffin.aboutItem || [],
          totalAmount: tiffin.totalAmount || '',
          items: tiffin.items || [],
        };
        setFormData(updatedForm);
        if (!tiffin.description?.trim()) {
          setErrors((prev) => ({ ...prev, description: 'Description is required' }));
        }
      }
    } catch (error) {
      console.error('Error fetching tiffin data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location?.state?.id]);

  const validateForm = (step: number): boolean => {
    const newErrors: { [key: string]: any } = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.day.trim()) newErrors.day = 'Day is required';
      if (!formData.date.trim()) newErrors.date = 'Date is required';
      if (!formData.endDate.trim()) newErrors.endDate = 'Booking Date is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.image_url.length === 0) newErrors.image_url = 'Tiffin Image is required';
    }

    if (step === 2) {
      const itemErrorsArray: any[] = [];
      formData.items.forEach((item, index) => {
        const itemErrors: any = {};
        if (!item.name.trim()) itemErrors.name = 'Item name is required';
        if (!item.price.trim()) itemErrors.price = 'Price is required';
        if (!item.quantity) itemErrors.quantity = 'Quantity is required';
        if (!item.weight.trim()) itemErrors.weight = 'Weight is required';
        if (!item.weightUnit.trim()) itemErrors.weightUnit = 'Weight unit is required';
        if (!item.description.trim()) itemErrors.description = 'Description is required';
        itemErrorsArray[index] = itemErrors;
      });

      const hasErrors = itemErrorsArray.some((err) => err && Object.keys(err).length > 0);

      if (hasErrors) {
        newErrors.items = itemErrorsArray;
      }
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
    setErrors((prev) => ({ ...prev, apiError: '' }));
    const isValid = validateForm(currentStep);
    if (!isValid) return;

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        setLoading(true);
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
          name: '',
          day: '',
          date: '',
          endDate: '',
          description: '',
          image_url: [],
          isCustomized: true,
          aboutItem: [],
          totalAmount: '',
          items: [
            {
              name: '',
              price: '',
              quantity: '',
              weightUnit: '',
              weight: '',
              description: '',
            },
          ],
        });

        navigate('/tiffin');
        fetchAllTiffin();
        setLoading(false);
        setErrors({});
        Toast({
          message: isEditMode ? 'Tiffin updated successfully!' : 'Tiffin created successfully!',
          type: 'success',
        });
      } catch (error) {
        console.error('Failed to submit tiffin items:', error);
        console.log(error);
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
        {loading ? <Loading /> : <Stepper currentStep={currentStep} steps={steps} />}
      </div>

      <form className="w-full">
        <div>{renderStepContent(currentStep)}</div>

        <div className="w-full flex justify-between mt-8">
          <Button
            onClick={() => {
              if (isEditMode) {
                navigate('/tiffin');
              } else {
                handleBack();
              }
            }}
            color="gray"
            type="button"
          >
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
