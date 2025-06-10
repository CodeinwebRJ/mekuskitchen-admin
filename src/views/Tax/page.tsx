'use client';
import { Button, TextInput, Label, Select } from 'flowbite-react';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { FiEdit, FiTrash, FiPlus, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { CreateTax, DeleteTax, EditTax, getallTax } from 'src/AxiosConfig/AxiosConfig'; // Ensure this is correctly set up
import { RootState } from 'src/Store/Store';

interface TaxEntry {
  category: string;
  taxRate: string;
}

interface TaxConfig {
  _id?: string;
  provinceName: string;
  provinceCode: string;
  taxes: { category: string; taxRate: number }[];
}

interface CategoryType {
  _id: string;
  name: string;
}

const Page = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [provinceCode, setProvinceCode] = useState<string>('');
  const [provinceName, setProvinceName] = useState<string>('');
  const [taxes, setTaxes] = useState<TaxEntry[]>([{ category: '', taxRate: '' }]);
  const [taxConfigs, setTaxConfigs] = useState<TaxConfig[]>([]);

  const categoryList: CategoryType[] = useSelector(
    (state: RootState) => state.category.categoryList,
  );

  const fetchTax = async () => {
    try {
      const data = {
        provinceCode: '',
        category: '',
      };
      const response = await getallTax(data);
      console.log(response.data.data);
      setTaxConfigs(response.data.data);
    } catch (error) {
      console.log(error);
      console.error('Fetch Tax Error:', error);
    }
  };

  useEffect(() => {
    fetchTax();
  }, []);

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
    if (!provinceName || !provinceCode || taxes.some((t) => !t.category || !t.taxRate)) {
      return;
    }

    const payload: TaxConfig = {
      provinceName,
      provinceCode,
      taxes: taxes.map((t) => ({
        category: categoryList.find((cat) => cat._id === t.category)?.name || t.category,
        taxRate: parseFloat(t.taxRate),
      })),
    };

    try {
      let res;
      if (editId) {
        res = await EditTax(payload);
      } else {
        res = await CreateTax(payload);
      }
      setProvinceCode('');
      setProvinceName('');
      setTaxes([{ category: '', taxRate: '' }]);
      setShowForm(false);
      setEditId(null);
      await fetchTax();
    } catch (error) {
      console.error(`${editId ? 'Update' : 'Create'} Tax Error:`, error);
    }
  };

  const handleEdit = (config: TaxConfig) => {
    setEditId(config?._id ?? null);
    setProvinceName(config.provinceName);
    setProvinceCode(config.provinceCode);
    setTaxes(
      config.taxes.map((t) => ({
        category: categoryList.find((cat) => cat.name === t.category)?._id || '',
        taxRate: t.taxRate.toString(),
      })),
    );
    setShowForm(true);
  };

  const handleDelete = async (name: string) => {
    try {
      await DeleteTax(name);
      fetchTax();
    } catch (error) {
      console.error('Delete Tax Error:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setProvinceCode('');
    setProvinceName('');
    setTaxes([{ category: '', taxRate: '' }]);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Tax Configurations</h2>
          <Button size="sm" color="blue" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? 'Cancel' : 'Create Tax'}
          </Button>
        </div>

        {showForm ? (
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
                  {taxes.length > 1 && (
                    <Button
                      color="blue"
                      type="button"
                      onClick={() => handleRemoveTaxField(index)}
                      className="text-white"
                    >
                      <FiX />
                    </Button>
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
                Add Tax
              </Button>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" color="gray" onClick={handleCancel}>
                Cancel
              </Button>
              <Button color="blue" type="submit">
                {editId ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="w-full">
            {taxConfigs?.length === 0 ? (
              <p className="text-gray-500">No tax configurations found.</p>
            ) : (
              <ul className="bg-white shadow-md rounded-md">
                {taxConfigs?.map((config) => (
                  <li key={config._id} className="flex flex-col p-4 border-b last:border-b-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-600 font-semibold">
                          {config.provinceName} ({config.provinceCode})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          color="blue"
                          className="text-white"
                          title="Edit"
                          onClick={() => handleEdit(config)}
                        >
                          <FiEdit size={18} />
                        </Button>
                        <Button
                          className="text-white"
                          title="Delete"
                          color="blue"
                          onClick={() => handleDelete(config.provinceCode!)}
                        >
                          <FiTrash size={18} />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      {config.taxes.map((tax, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {tax.category}: {tax.taxRate}%
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
