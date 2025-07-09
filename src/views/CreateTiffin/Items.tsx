import { Button, Label, Select, TextInput } from 'flowbite-react';
import { MdDelete } from 'react-icons/md';
import { TiffinFormData } from './page';
import { FC } from 'react';

interface Props {
  formData: TiffinFormData;
  setFormData: React.Dispatch<React.SetStateAction<TiffinFormData>>;
  errors: any;
  setErrors: any;
}

interface TiffinItem {
  name: string;
  price: string;
  quantity: string;
  quantityUnit: string;
  description: string;
}

const Items: FC<Props> = ({ errors, setErrors, formData, setFormData }) => {
  const calculateTotal = (items: TiffinItem[]) => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field as keyof TiffinItem] = value;

    // Clear specific field error for this item
    setErrors((prevErrors: any) => {
      const newErrors = { ...prevErrors };

      if (Array.isArray(newErrors.items)) {
        const itemErrors = [...newErrors.items];

        if (itemErrors[index]) {
          itemErrors[index] = {
            ...itemErrors[index],
            [field]: undefined,
          };

          // Remove the error object if all fields are cleared
          if (Object.values(itemErrors[index]).every((v) => !v)) {
            itemErrors[index] = undefined;
          }
        }

        newErrors.items = itemErrors.filter((e) => e !== undefined);
      }

      return newErrors;
    });

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: calculateTotal(updatedItems).toFixed(2),
    }));
  };

  const addItem = () => {
    const updatedItems = [
      ...formData.items,
      { name: '', price: '', quantity: '', quantityUnit: '', description: '' },
    ];

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: calculateTotal(updatedItems).toFixed(2),
    }));
  };

  const removeItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: calculateTotal(updatedItems).toFixed(2),
    }));

    // Also remove corresponding error
    setErrors((prevErrors: any) => {
      const newErrors = { ...prevErrors };
      if (Array.isArray(newErrors.items)) {
        const itemErrors = [...newErrors.items];
        itemErrors.splice(index, 1);
        newErrors.items = itemErrors;
      }
      return newErrors;
    });
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
            {errors.items?.[index]?.name && (
              <p className="text-red-600 text-sm">{errors.items[index].name}</p>
            )}
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
            {errors.items?.[index]?.price && (
              <p className="text-red-600 text-sm">{errors.items[index].price}</p>
            )}
          </div>

          <div>
            <Label htmlFor={`item-quantity-${index}`} value="Quantity" />
            <TextInput
              id={`item-quantity-${index}`}
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              placeholder="e.g. 1"
            />
            {errors.items?.[index]?.quantity && (
              <p className="text-red-600 text-sm">{errors.items[index].quantity}</p>
            )}
          </div>

          <div>
            <Label htmlFor={`item-quantityUnit-${index}`} value="Unit" />
            <Select
              id={`item-quantityUnit-${index}`}
              value={item.quantityUnit}
              onChange={(e) => handleItemChange(index, 'quantityUnit', e.target.value)}
            >
              <option value="">Select Unit</option>
              <option value="piece">Piece</option>
              <option value="plate">Plate</option>
              <option value="bowl">Bowl</option>
              <option value="box">Box</option>
              <option value="oz">OZ</option>
              <option value="kg">Kg (Kilogram)</option>
              <option value="g">g (gram)</option>
              <option value="ml">ml (milliliter)</option>
              <option value="l">L (liter)</option>
            </Select>
            {errors.items?.[index]?.quantityUnit && (
              <p className="text-red-600 text-sm">{errors.items[index].quantityUnit}</p>
            )}
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
        <div className="text-right font-semibold text-gray-700">
          Total Amount: ${totalAmount.toFixed(2)}
        </div>
      </div>
    </form>
  );
};

export default Items;
