import { Button, Label, Select, TextInput } from 'flowbite-react';
import { MdDelete } from 'react-icons/md';
import { TiffinFormData } from './page';
import { FC } from 'react';

interface Props {
  formData: TiffinFormData;
  setFormData: React.Dispatch<React.SetStateAction<TiffinFormData>>;
}

const Items: FC<Props> = ({ formData, setFormData }) => {
  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field as keyof (typeof updatedItems)[number]] = value;
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: '', price: '', quantity: '', quantityUnit: '', description: '' },
      ],
    }));
  };

  const removeItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const totalAmount = formData.items.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <form className="p-6 space-y-6">
      <h3 className="text-2xl font-bold text-primary">Tiffin Items</h3>

      {formData.items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border border-gray-200 p-4 rounded-md bg-gray-50"
        >
          <div>
            <Label htmlFor={`item-name-${index}`} value="Name" />
            <TextInput
              id={`item-name-${index}`}
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              placeholder="e.g. Aloo Gobi"
            />
          </div>

          <div>
            <Label htmlFor={`item-price-${index}`} value="Price" />
            <TextInput
              id={`item-price-${index}`}
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              placeholder="e.g. 90"
            />
          </div>

          <div>
            <Label htmlFor={`item-quantity-${index}`} value="Quantity" />
            <TextInput
              id={`item-quantity-${index}`}
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              placeholder="e.g. 1"
            />
          </div>

          <div>
            <Label htmlFor={`item-quantityUnit-${index}`} value="Unit" />
            <Select
              id={`item-quantityUnit-${index}`}
              value={item.quantityUnit}
              onChange={(e) => handleItemChange(index, 'quantityUnit', e.target.value)}
            >
              <option value="">Select Unit</option>
              <option value="plate">Plate</option>
              <option value="piece">Piece</option>
              <option value="bowl">Bowl</option>
              <option value="box">Box</option>
              <option value="oz">OZ</option>
              <option value="kg">Kg</option>
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="l">L</option>
            </Select>
          </div>

          <div>
            <Label htmlFor={`item-description-${index}`} value="Description" />
            <TextInput
              id={`item-description-${index}`}
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              placeholder="e.g. Classic aloo gobi with spices"
            />
          </div>

          <div className="col-span-5 flex justify-end mt-2">
            <div className="cursor-pointer text-red-600" onClick={() => removeItem(index)}>
              <MdDelete size={20} />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center">
        <Button type="button" color="gray" onClick={addItem}>
          + Add Item
        </Button>
        <div className="text-right text-lg font-semibold text-gray-700">
          Total Amount: ₹{totalAmount.toFixed(2)}
        </div>
      </div>
    </form>
  );
};

export default Items;
