import { TextInput, Label, Textarea, Select } from 'flowbite-react';
import { ChangeEvent } from 'react';
import { TiffinFormData } from './page';
import TiffinImage from '../CreateProduct/Component/TiffinImage';

interface Props {
  formData: TiffinFormData;
  setFormData: React.Dispatch<React.SetStateAction<TiffinFormData>>;
  errors: any;
  setErrors: any;
}

const TiffinInfo: React.FC<Props> = ({ errors, setErrors, formData, setFormData }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev: any) => ({ ...prev, [id]: '' }));
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev: any) => ({ ...prev, [id]: '' }));
    }
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-primary">Tiffin Information</h2>

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label value="Upload Tiffin Images" className="mb-1" />
            <TiffinImage
              images={formData.image_url}
              setProduct={setFormData}
              fieldKey="image_url"
            />
            {errors.image_url && formData.image_url.length === 0 && (
              <p className="text-red-500">{errors.image_url}</p>
            )}
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="day" value="Day*" />
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
                {errors.day && <p className="text-red-500">{errors.day}</p>}
              </div>

              <div>
                <Label htmlFor="category" value="Tiffin Category*" />
                <Select id="category" value={formData.category} onChange={handleSelectChange}>
                  <option value="">Select Category</option>
                  <option value="Regular">Regular</option>
                  <option value="Customize">Customize</option>
                </Select>
                {errors.category && <p className="text-red-500">{errors.category}</p>}
              </div>

              <div>
                <Label htmlFor="date" value="Tiffin Date*" />
                <TextInput
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
                {errors.date && <p className="text-red-500">{errors.date}</p>}
              </div>

              <div>
                <Label htmlFor="endDate" value="Booking End Date*" />
                <TextInput
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
                {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description" value="Tiffin Description" />
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the tiffin items, options, or special notes..."
                rows={4}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TiffinInfo;
