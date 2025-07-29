import { Button, Label, Select, TextInput } from 'flowbite-react';
import { MdDelete } from 'react-icons/md';
import { TiffinFormData } from './page';
import { FC } from 'react';
import Loading from 'src/components/Loading';

interface Props {
  loading: boolean;
  formData: TiffinFormData;
  setFormData: React.Dispatch<React.SetStateAction<TiffinFormData>>;
  errors: any;
  setErrors: any;
}

interface TiffinItem {
  name: string;
  price: string;
  quantity: string;
  weight: string;
  weightUnit: string;
  description: string;
}

const Items: FC<Props> = ({ loading, errors, setErrors, formData, setFormData }) => {
  const calculateTotal = (items: TiffinItem[]) => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field as keyof TiffinItem] = value;

    setErrors((prevErrors: any) => {
      const newErrors = { ...prevErrors };

      if (Array.isArray(newErrors.items)) {
        const itemErrors = [...newErrors.items];

        if (itemErrors[index]) {
          itemErrors[index] = {
            ...itemErrors[index],
            [field]: undefined,
          };

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
      {
        name: '',
        price: '',
        quantity: '',
        weight: '',
        weightUnit: '',
        description: '',
      },
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

  if (loading) return <Loading />;

  return (
    <form className="p-4 sm:p-6 space-y-6">
      <h3 className="text-xl sm:text-2xl font-bold text-primary">Tiffin Items</h3>

      {formData.items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 border border-gray-200 p-4 rounded-md bg-gray-50"
        >
          {/* Name */}
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

          {/* Price */}
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

          {/* Weight */}
          <div>
            <Label htmlFor={`item-weight-${index}`} value="Weight" />
            <TextInput
              id={`item-weight-${index}`}
              value={item.weight || ''}
              onChange={(e) => handleItemChange(index, 'weight', e.target.value)}
              placeholder="e.g. 250"
            />
            {errors.items?.[index]?.weight && (
              <p className="text-red-600 text-sm">{errors.items[index].weight}</p>
            )}
          </div>

          {/* Weight Unit */}
          <div>
            <Label htmlFor={`item-weightUnit-${index}`} value="Weight Unit" />
            <Select
              id={`item-weightUnit-${index}`}
              value={item.weightUnit || ''}
              onChange={(e) => handleItemChange(index, 'weightUnit', e.target.value)}
            >
              <option value="">Select Unit</option>
              <option value="oz">OZ</option>
              <option value="g">G</option>
              <option value="kg">KG</option>
              <option value="ml">ML</option>
              <option value="l">L</option>
              <option value="piece">PIECE</option>
              <option value="bowl">BOWL</option>
              <option value="plate">PLATE</option>
              <option value="box">BOX</option>
            </Select>
            {errors.items?.[index]?.weightUnit && (
              <p className="text-red-600 text-sm">{errors.items[index].weightUnit}</p>
            )}
          </div>

          <div className="sm:col-span-2 md:col-span-3 lg:col-span-5">
            <Label htmlFor={`item-description-${index}`} value="Description" />
            <TextInput
              id={`item-description-${index}`}
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              placeholder="e.g. Classic aloo gobi with spices"
            />
            {errors.items?.[index]?.description && (
              <p className="text-red-600 text-sm">{errors.items[index].description}</p>
            )}
          </div>

          <div className="col-span-full flex justify-end mt-2">
            <div
              className="cursor-pointer text-red-600 hover:text-red-800 transition"
              onClick={() => removeItem(index)}
            >
              <MdDelete size={20} />
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button type="button" color="gray" onClick={addItem}>
          + Add Item
        </Button>
        <div className="text-right font-semibold text-gray-700 text-md">
          Total Amount: ${totalAmount.toFixed(2)}
        </div>
      </div>
    </form>
  );
};

export default Items;
