import { TextInput, Label, Textarea, Select } from 'flowbite-react';
import { ChangeEvent } from 'react';
import TableFileUploader from '../CreateProduct/Component/fileUploader';
import { TiffinFormData } from './page';

interface Props {
  formData: TiffinFormData;
  setFormData: React.Dispatch<React.SetStateAction<TiffinFormData>>;
}

const TiffinInfo: React.FC<Props> = ({ formData, setFormData }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-primary">Tiffin Information</h2>

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label value="Upload Tiffin Images" className="mb-1" />
            <TableFileUploader images={formData.images} setProduct={setFormData} />
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="day" value="Day" />
                <TextInput
                  id="day"
                  type="text"
                  value={formData.day}
                  onChange={handleInputChange}
                  placeholder="e.g. Monday"
                />
              </div>

              <div>
                <Label htmlFor="category" value="Tiffin Category" />
                <Select id="category" value={formData.category} onChange={handleSelectChange}>
                  <option value="">Select Category</option>
                  <option value="Regular">Regular</option>
                  <option value="Customize">Customize</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="date" value="Tiffin Date" />
                <TextInput
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="BookingEndDate" value="Booking End Date" />
                <TextInput
                  id="BookingEndDate"
                  type="date"
                  value={formData.BookingEndDate}
                  onChange={handleInputChange}
                />
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
