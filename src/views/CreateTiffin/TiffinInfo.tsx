import { TextInput, Label, Textarea, Select, Checkbox } from 'flowbite-react';
import { ChangeEvent } from 'react';
import { TiffinFormData } from './page';
import TiffinImage from '../CreateProduct/Component/TiffinImage';
import dayjs from 'dayjs';

interface Props {
  formData: TiffinFormData;
  setFormData: React.Dispatch<React.SetStateAction<TiffinFormData>>;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const TiffinInfo: React.FC<Props> = ({ errors, setErrors, formData, setFormData }) => {
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    if (id === 'date') {
      const selectedDay = dayjs(value).format('dddd');
      setFormData((prev) => ({
        ...prev,
        date: value,
        day: selectedDay,
      }));

      if (errors.date || errors.day) {
        setErrors((prev) => ({ ...prev, date: '', day: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));

      if (errors[id]) {
        setErrors((prev) => ({ ...prev, [id]: '' }));
      }
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, isCustomized: checked }));
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-primary">Tiffin Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label value="Upload Tiffin Images*" className="mb-1" />
          <TiffinImage setErrors={setErrors} images={formData.image_url} setProduct={setFormData} fieldKey="image_url" />
          {errors.image_url && formData.image_url.length === 0 && (
            <p className="text-red-500 text-sm mt-1">{errors.image_url}</p>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" value="Tiffin Name*" />
              <TextInput
                id="name"
                type="text"
                placeholder="Tiffin Name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="day" value="Tiffin Day*" />
              <Select id="day" value={formData.day} onChange={handleSelectChange}>
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </Select>
              {errors.day && <p className="text-red-500 text-sm mt-1">{errors.day}</p>}
            </div>

            <div>
              <Label htmlFor="date" value="Tiffin Date*" />
              <TextInput id="date" type="date" value={formData.date} onChange={handleInputChange} />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <Label htmlFor="endDate" value="Booking End Date*" />
              <TextInput
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="isCustomized"
              checked={formData.isCustomized}
              onChange={handleCheckboxChange}
            />
            <Label htmlFor="isCustomized">Is Customized</Label>
          </div>

          <div>
            <Label htmlFor="description" value="Tiffin Description*" />
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the tiffin items, options, or special notes..."
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiffinInfo;
