import React, { useState, useEffect } from "react";
import { Button, TextInput, Textarea, Select, Label } from "flowbite-react";
import { createTiffinItem, getTiffinItemById, editTiffinItem } from "src/AxiosConfig/AxiosConfig";
import { Toast } from "src/components/Toast"; 
import { useNavigate, useLocation } from "react-router-dom";

interface Item {
  name: string;
  description: string;
  weight: string;
  price: string;
  weightUnit: string;
}

const CreateItemMaster: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemId = (location?.state as any)?.id; 

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [item, setItem] = useState<Item>({
    name: "",
    description: "",
    weight: "",
    price: "",
    weightUnit: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (itemId) {
      setIsEdit(true);
      fetchItem();
    }
  }, [itemId]);

  const fetchItem = async () => {
    setLoading(true);
    try {
      const res = await getTiffinItemById(itemId);
      const data = res?.data?.data;
      if (data) {
        setItem({
          name: data.name || "",
          description: data.description || "",
          weight: data.weight || "",
          price: data.price || "",
          weightUnit: data.weightUnit || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch item:", err);
      Toast({ message: "Failed to fetch item data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!String(item.name).trim()) newErrors.name = "Item name is required";
    if (!String(item.price).trim() || Number(item.price) <= 0) newErrors.price = "Price must be greater than 0";
    if (!String(item.weight).trim() || Number(item.weight) <= 0) newErrors.weight = "Weight must be greater than 0";
    if (!item.weightUnit) newErrors.weightUnit = "Unit is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEdit && itemId) {
        await editTiffinItem(itemId, item);
        Toast({ message: "Item updated successfully!", type: "success" });
      } else {
        await createTiffinItem(item);
        Toast({ message: "Item created successfully!", type: "success" });
      }
      setItem({ name: "", description: "", weight: "", price: "", weightUnit: "" });
      navigate("/manage-item-master");
    } catch (err: any) {
      console.error(err);
      Toast({ message: isEdit ? "Failed to update item" : "Failed to create item", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 py-10">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          {isEdit ? "Edit Item Master" : "Create Item Master"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="grid grid-cols-2 gap-6">
            <div>
            <Label value="Item Name*" />
            <TextInput
              type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              placeholder="Enter item name"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>
           <div>
              <Label value="Weight*" />
              <TextInput
                type="number"
                name="weight"
                value={item.weight}
                onChange={handleChange}
                placeholder="Enter weight"
              />
              {errors.weight && <p className="text-red-600 text-sm mt-1">{errors.weight}</p>}
            </div>
          </div>

          {/* Weight & Unit */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label value="Unit*" />
              <Select name="weightUnit" value={item.weightUnit} onChange={handleChange}>
                <option value="" disabled>Select Unit</option>
                <option value="OZ">OZ</option>
                <option value="G">G</option>
                <option value="KG">KG</option>
                <option value="ML">ML</option>
                <option value="L">L</option>
                <option value="PIECE">PIECE</option>
                <option value="BOWL">BOWL</option>
                <option value="PLATE">PLATE</option>
                <option value="BOX">BOX</option>
              </Select>
              {errors.weightUnit && <p className="text-red-600 text-sm mt-1">{errors.weightUnit}</p>}
            </div>
             {/* Price */}
          <div>
            <Label value="Price ($)*" />
            <TextInput
              type="number"
              name="price"
              value={item.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
            {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
          </div>
          </div>

          {/* Description */}
          <div>
            <Label value="Description" />
            <Textarea
              name="description"
              value={item.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItemMaster;
