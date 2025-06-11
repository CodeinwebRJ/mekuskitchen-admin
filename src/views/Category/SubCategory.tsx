import { useState, useCallback, useMemo, FormEvent } from 'react';
import { Button, TextInput, ToggleSwitch, Select } from 'flowbite-react';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryList } from 'src/Store/Slices/Categories';
import { RootState } from 'src/Store/Store';
import {
  CreateSubCategory,
  UpdateSubCategory,
  DeleteSubCategory,
} from 'src/AxiosConfig/AxiosConfig';

interface SubSubCategoryType {
  _id: string;
  name: string;
  isActive: boolean;
}

interface SubCategoryType {
  _id: string;
  name: string;
  subSubCategories: SubSubCategoryType[];
  isActive: boolean;
}

// Define constants
const ERROR_MESSAGES = {
  CREATE: 'Failed to create subcategory. Please try again.',
  UPDATE: 'Failed to update subcategory. Please try again.',
  DELETE: 'Failed to delete subcategory. Please try again.',
  DUPLICATE: 'Subcategory name already exists in this category.',
  INVALID: 'Subcategory name must be at least 3 characters long.',
  NO_CATEGORY: 'Please select a category.',
};

const SubCategory = () => {
  const dispatch = useDispatch();
  const categoryList = useSelector((state: RootState) => state.category.categoryList);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editSubCategoryId, setEditSubCategoryId] = useState<string | null>(null);
  const [editSubCategoryName, setEditSubCategoryName] = useState('');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const setLoading = (key: string, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  const validateSubCategoryName = (name: string, categoryId: string): string | null => {
    if (name.trim().length < 3) return ERROR_MESSAGES.INVALID;
    const category = categoryList.find((cat) => cat._id === categoryId);
    if (
      category?.subCategories.some((sub) => sub.name.toLowerCase() === name.trim().toLowerCase())
    ) {
      return ERROR_MESSAGES.DUPLICATE;
    }
    return null;
  };

  const handleAddSubCategory = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const trimmedName = subCategoryName.trim();
      if (!selectedCategory) {
        setError(ERROR_MESSAGES.NO_CATEGORY);
        return;
      }
      const validationError = validateSubCategoryName(trimmedName, selectedCategory);
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading('create', true);
      setError(null);
      try {
        const data = { name: trimmedName, categoryId: selectedCategory };
        const res = await CreateSubCategory(data);
        if (!res.data?.data) throw new Error('Invalid response format');

        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === selectedCategory
                ? { ...cat, subCategories: [...cat.subCategories, res.data.data] }
                : cat,
            ),
          ),
        );
        setSubCategoryName('');
        setShowForm(false);
      } catch (error: any) {
        console.error('Failed to create subcategory:', error);
        setError(error.response?.status === 409 ? ERROR_MESSAGES.DUPLICATE : ERROR_MESSAGES.CREATE);
      } finally {
        setLoading('create', false);
      }
    },
    [subCategoryName, selectedCategory, categoryList, dispatch],
  );

  const handleToggle = useCallback(
    async (catId: string, subCategory: SubCategoryType) => {
      setLoading(`toggle-${subCategory._id}`, true);
      setError(null);
      try {
        const data = {
          categoryId: catId,
          subCategoryId: subCategory._id,
          isActive: !subCategory.isActive,
        };
        const res = await UpdateSubCategory(data);
        if (!res.data?.data) throw new Error('Invalid response format');

        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === catId
                ? {
                    ...cat,
                    subCategories: cat.subCategories.map((sub) =>
                      sub._id === subCategory._id
                        ? { ...sub, isActive: res.data.data.isActive }
                        : sub,
                    ),
                  }
                : cat,
            ),
          ),
        );
      } catch (error: any) {
        console.error('Failed to toggle subcategory:', error);
        setError(ERROR_MESSAGES.UPDATE);
      } finally {
        setLoading(`toggle-${subCategory._id}`, false);
      }
    },
    [categoryList, dispatch],
  );

  const handleEditStart = useCallback((subCatId: string, name: string) => {
    setEditSubCategoryId(subCatId);
    setEditSubCategoryName(name);
    setError(null);
  }, []);

  const handleEditSubmit = useCallback(
    async (e: FormEvent, catId: string, subCategory: SubCategoryType) => {
      e.preventDefault();
      const trimmedName = editSubCategoryName.trim();
      if (trimmedName === subCategory.name) {
        setEditSubCategoryId(null);
        return;
      }

      const validationError = validateSubCategoryName(trimmedName, catId);
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(`edit-${subCategory._id}`, true);
      setError(null);
      try {
        const data = {
          categoryId: catId,
          subCategoryId: subCategory._id,
          name: trimmedName,
        };
        const res = await UpdateSubCategory(data);
        if (!res.data?.data) throw new Error('Invalid response format');

        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === catId
                ? {
                    ...cat,
                    subCategories: cat.subCategories.map((sub) =>
                      sub._id === subCategory._id
                        ? { ...sub, name: res.data.data.name, isActive: res.data.data.isActive }
                        : sub,
                    ),
                  }
                : cat,
            ),
          ),
        );
        setEditSubCategoryId(null);
        setEditSubCategoryName('');
      } catch (error: any) {
        console.error('Failed to update subcategory:', error);
        setError(error.response?.status === 409 ? ERROR_MESSAGES.DUPLICATE : ERROR_MESSAGES.UPDATE);
      } finally {
        setLoading(`edit-${subCategory._id}`, false);
      }
    },
    [editSubCategoryName, categoryList, dispatch],
  );

  const handleEditCancel = useCallback(() => {
    setEditSubCategoryId(null);
    setEditSubCategoryName('');
    setError(null);
  }, []);

  const handleDelete = useCallback(
    async (catId: string, subCategory: SubCategoryType) => {
      setLoading(`delete-${subCategory._id}`, true);
      setError(null);
      try {
        await DeleteSubCategory({ categoryId: catId, subCategoryId: subCategory._id });
        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === catId
                ? {
                    ...cat,
                    subCategories: cat.subCategories.filter((sub) => sub._id !== subCategory._id),
                  }
                : cat,
            ),
          ),
        );
      } catch (error: any) {
        console.error('Failed to delete subcategory:', error);
        setError(ERROR_MESSAGES.DELETE);
      } finally {
        setLoading(`delete-${subCategory._id}`, false);
      }
    },
    [categoryList, dispatch],
  );

  const filteredSubCategories = useMemo(
    () => categoryList.find((cat) => cat._id === selectedCategory)?.subCategories || [],
    [categoryList, selectedCategory],
  );

  const subCategoryListRender = useMemo(
    () =>
      filteredSubCategories.map((sub: SubCategoryType) => (
        <li key={sub._id} className="flex justify-between items-center p-4">
          {editSubCategoryId === sub._id ? (
            <form
              onSubmit={(e) => handleEditSubmit(e, selectedCategory, sub)}
              className="flex items-center gap-2 w-full"
            >
              <TextInput
                value={editSubCategoryName}
                onChange={(e) => setEditSubCategoryName(e.target.value)}
                placeholder="Edit subcategory name"
                required
                className="flex-1"
                disabled={loadingStates[`edit-${sub._id}`]}
                aria-label={`Edit name for ${sub.name}`}
              />
              <Button color="blue" type="submit" size="sm">
                {loadingStates[`edit-${sub._id}`] ? 'Saving...' : 'Save'}
              </Button>
              <Button
                color="gray"
                size="sm"
                onClick={handleEditCancel}
                disabled={loadingStates[`edit-${sub._id}`]}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <>
              <span className="text-gray-700 font-medium flex-1">{sub.name}</span>
              <div className="flex items-center gap-2">
                <ToggleSwitch
                  checked={sub.isActive}
                  onChange={() => handleToggle(selectedCategory, sub)}
                  aria-label={`Toggle active status for ${sub.name}`}
                />
                <Button
                  onClick={() => handleEditStart(sub._id, sub.name)}
                  color="blue"
                  aria-label={`Edit ${sub.name}`}
                  disabled={loadingStates[`edit-${sub._id}`] || loadingStates[`delete-${sub._id}`]}
                >
                  <FiEdit size={18} />
                </Button>
                <Button
                  onClick={() => handleDelete(selectedCategory, sub)}
                  color="blue"
                  aria-label={`Delete ${sub.name}`}
                  disabled={loadingStates[`edit-${sub._id}`] || loadingStates[`delete-${sub._id}`]}
                >
                  <FiTrash size={18} />
                </Button>
              </div>
            </>
          )}
        </li>
      )),
    [
      filteredSubCategories,
      editSubCategoryId,
      editSubCategoryName,
      selectedCategory,
      handleToggle,
      handleEditStart,
      handleDelete,
      handleEditSubmit,
      handleEditCancel,
      loadingStates,
    ],
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Sub Categories</h2>
          <Button
            color="blue"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            disabled={loadingStates.create || categoryList.length === 0 || !selectedCategory}
          >
            {showForm ? 'Cancel' : 'Create New SubCategory'}
          </Button>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <div className="mb-4">
          <Select
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
            className="w-1/3"
            disabled={loadingStates.create || categoryList.length === 0}
            aria-label="Select category"
          >
            <option value="">Select Category</option>
            {categoryList.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        {showForm && (
          <form
            onSubmit={handleAddSubCategory}
            className="w-1/2 flex flex-col gap-4 bg-white shadow-md rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-600">Create SubCategory</h3>
            <TextInput
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              placeholder="Enter subcategory name"
              required
              disabled={loadingStates.create}
              aria-label="Subcategory name"
            />
            <Button color="blue" type="submit" size="sm" disabled={loadingStates.create}>
              {loadingStates.create ? 'Creating...' : 'Create SubCategory'}
            </Button>
          </form>
        )}

        {selectedCategory && filteredSubCategories.length === 0 && (
          <p className="text-gray-500 mt-4">No subcategories available.</p>
        )}

        {selectedCategory && filteredSubCategories.length > 0 && (
          <ul className="bg-white shadow-md rounded-md divide-y mt-4">{subCategoryListRender}</ul>
        )}
      </div>
    </div>
  );
};

export default SubCategory;
