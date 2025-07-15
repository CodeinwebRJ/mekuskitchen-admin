'use client';
import { Button, TextInput, Label, Select } from 'flowbite-react';
import { useState, FormEvent, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { CreateTax, DeleteTax, EditTax, getallTax } from 'src/AxiosConfig/AxiosConfig';
import DeleteDialog from 'src/components/DeleteDialog';
import Loading from 'src/components/Loading';
import NoDataFound from 'src/components/NoDataFound';
import { Toast } from 'src/components/Toast';
import useDebounce from 'src/Hook/useDebounce';
import { RootState } from 'src/Store/Store';

interface TaxEntry {
  category: string;
  provinceTax: string;
  federalTax: string;
}

interface PreventScrollEvent extends React.WheelEvent<HTMLInputElement> {
  target: HTMLInputElement;
}

interface TaxConfig {
  _id?: string;
  provinceName: string;
  provinceCode: string;
  taxes: { category: string; provinceTax: number; federalTax: number }[];
}

const validateTaxForm = (
  provinceName: string,
  provinceCode: string,
  taxes: TaxEntry[],
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!provinceName.trim()) errors.provinceName = 'Province Name is required.';
  if (!provinceCode.trim()) errors.provinceCode = 'Province Code is required.';

  taxes.forEach((tax, index) => {
    if (!tax.category) errors[`category-${index}`] = 'Category is required.';
    if (!tax.provinceTax) errors[`provinceTax-${index}`] = 'Province Tax is required.';
    if (!tax.federalTax) errors[`federalTax-${index}`] = 'Federal Tax is required.';
  });

  return errors;
};

const Page = () => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [provinceCode, setProvinceCode] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    search: '',
    category: '',
  });
  const [taxes, setTaxes] = useState<TaxEntry[]>([
    { category: '', provinceTax: '', federalTax: '' },
  ]);
  const [taxConfigs, setTaxConfigs] = useState<TaxConfig[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categoryList = useSelector((state: RootState) => state.category.categoryList);

  const filterData = useDebounce(filter, 500);

  const fetchTax = useCallback(async () => {
    try {
      setLoading(true);
      const data = {
        search: filter.search,
        category: filter.category,
      };
      const response = await getallTax(data);
      setTaxConfigs(response.data.data);
    } catch (error) {
      console.error('Fetch Tax Error:', error);
    } finally {
      setLoading(false);
    }
  }, [filterData]);

  useEffect(() => {
    fetchTax();
  }, [fetchTax]);

  const resetForm = () => {
    setProvinceCode('');
    setProvinceName('');
    setTaxes([{ category: '', provinceTax: '', federalTax: '' }]);
    setErrors({});
    setEditId(null);
    setShowForm(false);
  };

  const handleAddTaxField = () => {
    setTaxes((prev) => [...prev, { category: '', provinceTax: '', federalTax: '' }]);
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

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${field}-${index}`];
      return newErrors;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = validateTaxForm(provinceName, provinceCode, taxes);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const payload: TaxConfig = {
      provinceName,
      provinceCode,
      taxes: taxes.map((t) => ({
        category: categoryList.find((cat) => cat._id === t.category)?.name || t.category,
        provinceTax: parseFloat(t.provinceTax),
        federalTax: parseFloat(t.federalTax),
      })),
    };

    try {
      if (editId) {
        await EditTax(payload);
      } else {
        await CreateTax(payload);
      }
      resetForm();
      await fetchTax();
      Toast({ message: 'Tax created successfully!', type: 'success' });
    } catch (error) {
      console.error(`${editId ? 'Update' : 'Create'} Tax Error:`, error);
    }
  };

  const handleEdit = (config: TaxConfig) => {
    setEditId(config._id ?? null);
    setProvinceName(config.provinceName);
    setProvinceCode(config.provinceCode);
    setTaxes(
      config.taxes.map((t) => ({
        category: categoryList.find((cat) => cat.name === t.category)?._id || '',
        provinceTax: t.provinceTax.toString(),
        federalTax: t.federalTax.toString(),
      })),
    );
    setShowForm(true);
    Toast({ message: 'Tax updated successfully!', type: 'success' });
  };

  const handleOpenDelete = (provinceCode: string) => {
    setSelectedProvinceCode(provinceCode);
    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProvinceCode(null);
  };

  const confirmDelete = async () => {
    if (!selectedProvinceCode) return;
    try {
      await DeleteTax(selectedProvinceCode);
      fetchTax();
      Toast({ message: 'Tax deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Delete Tax Error:', error);
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedProvinceCode(null);
    }
  };

  const preventScroll = (e: PreventScrollEvent) => {
    e.target.blur();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full">
        <div className="mb-3">
          <h2 className="text-xl font-semibold text-primary mb-3">Tax</h2>

          <div className="flex justify-between items-center">
            <TextInput
              placeholder="Search"
              className="w-1/3"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
            <Button size="sm" color="primary" onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? 'Cancel' : 'Create Tax'}
            </Button>
          </div>
        </div>

        {showForm ? (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provinceName" value="Province Name*" />
                <TextInput
                  id="provinceName"
                  value={provinceName}
                  onChange={(e) => {
                    setProvinceName(e.target.value);
                    setErrors((prev) => ({ ...prev, provinceName: '' }));
                  }}
                />
                {errors.provinceName && (
                  <p className="text-red-500 text-sm mt-1">{errors.provinceName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="provinceCode" value="Province Code*" />
                <TextInput
                  id="provinceCode"
                  value={provinceCode}
                  onChange={(e) => {
                    setProvinceCode(e.target.value);
                    setErrors((prev) => ({ ...prev, provinceCode: '' }));
                  }}
                />
                {errors.provinceCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.provinceCode}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {taxes.map((tax, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row lg:items-start gap-4 border p-3 rounded-md"
                >
                  <div className="flex-1">
                    <Label value="Select Category*" />
                    <Select
                      value={tax.category}
                      onChange={(e) => handleTaxChange(index, 'category', e.target.value)}
                      className="w-full"
                    >
                      <option value="">Select Category</option>
                      {categoryList.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                    {errors[`category-${index}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`category-${index}`]}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label value="Province Tax (%)*" />
                    <TextInput
                      type="number"
                      onWheel={preventScroll}
                      value={tax.provinceTax}
                      onChange={(e) => handleTaxChange(index, 'provinceTax', e.target.value)}
                    />
                    {errors[`provinceTax-${index}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`provinceTax-${index}`]}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label value="Federal Tax (%)*" />
                    <TextInput
                      type="number"
                      onWheel={preventScroll}
                      value={tax.federalTax}
                      onChange={(e) => handleTaxChange(index, 'federalTax', e.target.value)}
                    />
                    {errors[`federalTax-${index}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`federalTax-${index}`]}</p>
                    )}
                  </div>
                  {taxes.length > 1 && (
                    <div className="flex justify-end lg:pt-6">
                      <MdDelete
                        className="text-lg text-red-600 cursor-pointer"
                        onClick={() => handleRemoveTaxField(index)}
                      />
                    </div>
                  )}
                </div>
              ))}

              <Button type="button" size="xs" color="gray" onClick={handleAddTaxField}>
                <FiPlus className="mr-1" />
                Add Tax
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button type="button" color="gray" onClick={resetForm}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                {editId ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="w-full">
            {loading ? (
              <Loading />
            ) : taxConfigs.length === 0 ? (
              <div className="bg-white rounded-md">
                <NoDataFound />
              </div>
            ) : (
              <ul className="bg-white shadow-md rounded-md divide-y">
                {taxConfigs.map((config) => (
                  <li key={config._id} className="flex flex-col p-4 gap-2">
                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      <span className="text-gray-600 font-semibold">
                        {config.provinceName} ({config.provinceCode})
                      </span>
                      <div className="flex gap-4">
                        <MdModeEdit
                          className="text-black cursor-pointer"
                          size={18}
                          onClick={() => handleEdit(config)}
                        />
                        <MdDelete
                          className="text-red-600 cursor-pointer"
                          size={18}
                          onClick={() => handleOpenDelete(config.provinceCode)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {config.taxes.map((tax, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-md shadow-sm"
                        >
                          {tax.category}:{' '}
                          <span className="text-gray-900">
                            Province: {tax.provinceTax}%, Federal: {tax.federalTax}%
                          </span>
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
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onCancel={handleCancelDelete}
        onDelete={confirmDelete}
        message={`Are you sure you want to delete this Tax?`}
      />
    </div>
  );
};

export default Page;
