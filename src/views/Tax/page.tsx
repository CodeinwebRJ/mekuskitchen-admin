'use client';
import { Button, TextInput, Label, Select } from 'flowbite-react';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { FiEdit, FiTrash, FiPlus, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { getallTax } from 'src/AxiosConfig/AxiosConfig';
import { RootState } from 'src/Store/Store';

interface TaxEntry {
  category: string;
  taxRate: string;
}

interface CategoryType {
  _id: string;
  name: string;
}

const Page = () => {
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);
  const categoryList: CategoryType[] = useSelector(
    (state: RootState) => state.category.categoryList,
  );
  const [provinceCode, setProvinceCode] = useState<string>('');
  const [provinceName, setProvinceName] = useState<string>('');
  const [taxes, setTaxes] = useState<TaxEntry[]>([{ category: '', taxRate: '' }]);

  const handleAddTaxField = () => {
    setTaxes((prev) => [...prev, { category: '', taxRate: '' }]);
  };

  const handleRemoveTaxField = (index: number) => {
    setTaxes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTaxChange = (index: number, field: keyof TaxEntry, value: string) => {
    setTaxes((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      provinceCode,
      provinceName,
      taxes: taxes.map((t) => ({
        category: t.category,
        taxRate: parseFloat(t.taxRate),
      })),
    };

    try {
      const res = await fetch('/api/tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Tax config created!');
        setProvinceCode('');
        setProvinceName('');
        setTaxes([{ category: '', taxRate: '' }]);
        setShowCategoryForm(false);
      } else {
        alert(data.message || 'Error creating tax config');
      }
    } catch (error) {
      console.error('Create Tax Error:', error);
    }
  };

  const fetchTax = async () => {
    try {
      await getallTax();
    } catch (error) {
      console.error('Fetch Tax Error:', error);
    }
  };

  useEffect(() => {
    fetchTax();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Tax</h2>
          <Button
            size="sm"
            onClick={() => setShowCategoryForm((prev) => !prev)}
          >
            {showCategoryForm ? 'Cancel' : 'Create Tax'}
          </Button>
        </div>

        {showCategoryForm ? (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provinceName" value="Province Name" />
                <TextInput
                  id="provinceName"
                  required
                  value={provinceName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setProvinceName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="provinceCode" value="Province Code" />
                <TextInput
                  id="provinceCode"
                  required
                  value={provinceCode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setProvinceCode(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label value="Taxes" />
              {taxes.map((tax, index) => (
                <div key={index} className="flex items-center gap-4 mt-2">
                  <Select
                    required
                    value={tax.category}
                    onChange={(e) => handleTaxChange(index, 'category', e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categoryList.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                  <TextInput
                    placeholder="Tax Rate (%)"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={tax.taxRate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleTaxChange(index, 'taxRate', e.target.value)
                    }
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTaxField(index)}
                      className="text-red-500"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                size="xs"
                color="gray"
                className="mt-2"
                onClick={handleAddTaxField}
              >
                <FiPlus className="mr-1" />
                Add Category
              </Button>
            </div>

            <div className="text-right">
              <Button type="submit">
                Submit
              </Button>
            </div>
          </form>
        ) : (
          <div className="w-full">
            <ul className="bg-white shadow-md rounded-md">
              {[...Array(5)].map((_, index) => (
                <li key={index} className="flex justify-between items-center p-4 border-b">
                  <span className="text-gray-600 font-semibold flex-1">Clothing</span>
                  <div className="flex items-center gap-3">
                    <button className="text-blue-500 hover:text-blue-700" title="Edit">
                      <FiEdit size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700" title="Delete">
                      <FiTrash size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
