import { Button, TextInput, ToggleSwitch } from 'flowbite-react';
import { useState, useCallback, FormEvent, useMemo } from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { CreateCategory, DeleteCategory, UpdateCategory } from 'src/AxiosConfig/AxiosConfig'; // Fixed typo
import { setCategoryList } from 'src/Store/Slices/Categories';
import { RootState } from 'src/Store/Store';

// Define constants
const ERROR_MESSAGES = {
  CREATE: 'Failed to create category. Please try again.',
  UPDATE: 'Failed to update category. Please try again.',
  DELETE: 'Failed to delete category. Please try again.',
  DUPLICATE: 'Category name already exists.',
  INVALID: 'Category name must be at least 3 characters long.',
};

// Define interfaces (already provided, but included for clarity)
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

interface CategoryType {
  _id: string;
  name: string;
  subCategories: SubCategoryType[];
  isActive: boolean;
}

const Category = () => {
  const categoryList = useSelector((state: RootState) => state.category.categoryList);
  const dispatch = useDispatch();
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  // Validate category name
  const validateCategoryName = (name: string): string | null => {
    if (name.trim().length < 3) return ERROR_MESSAGES.INVALID;
    if (categoryList.some((cat) => cat.name.toLowerCase() === name.trim().toLowerCase())) {
      return ERROR_MESSAGES.DUPLICATE;
    }
    return null;
  };

  // Set loading state for specific action
  const setLoading = (key: string, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  // Handle form submission for creating a category
  const handleCategorySubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const trimmedInput = categoryInput.trim();
      const validationError = validateCategoryName(trimmedInput);
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading('create', true);
      setError(null);
      try {
        const data = { name: trimmedInput };
        const res = await CreateCategory(data);
        if (!res.data?.data) throw new Error('Invalid response format');

        dispatch(setCategoryList([...categoryList, res.data.data]));
        setCategoryInput('');
        setShowCategoryForm(false);
      } catch (error: any) {
        console.error('Failed to create category:', error);
        setError(error.response?.status === 409 ? ERROR_MESSAGES.DUPLICATE : ERROR_MESSAGES.CREATE);
      } finally {
        setLoading('create', false);
      }
    },
    [categoryInput, categoryList, dispatch],
  );

  // Handle toggle category active status
  const handleToggle = useCallback(
    async (category: CategoryType) => {
      setLoading(`toggle-${category._id}`, true);
      setError(null);
      try {
        const data = {
          categoryId: category._id,
          isActive: !category.isActive,
        };
        const res = await UpdateCategory(data);
        if (!res.data?.data) throw new Error('Invalid response format');

        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === category._id ? { ...cat, isActive: res.data.data.isActive } : cat,
            ),
          ),
        );
      } catch (error: any) {
        console.error('Failed to toggle category:', error);
        setError(ERROR_MESSAGES.UPDATE);
      } finally {
        setLoading(`toggle-${category._id}`, false);
      }
    },
    [categoryList, dispatch],
  );

  const handleDelete = useCallback(
    async (category: CategoryType) => {
      setLoading(`delete-${category._id}`, true);
      setError(null);
      try {
        await DeleteCategory({ categoryId: category._id });
        dispatch(setCategoryList(categoryList.filter((cat) => cat._id !== category._id)));
      } catch (error: any) {
        console.error('Failed to delete category:', error);
        setError(ERROR_MESSAGES.DELETE);
      } finally {
        setLoading(`delete-${category._id}`, false);
      }
    },
    [categoryList, dispatch],
  );

  const handleEditStart = useCallback((id: string, name: string) => {
    setEditCategoryId(id);
    setEditCategoryName(name);
    setError(null);
  }, []);

  const handleEditSubmit = useCallback(
    async (e: FormEvent, category: CategoryType) => {
      e.preventDefault();
      const trimmedName = editCategoryName.trim();
      if (trimmedName === category.name) {
        setEditCategoryId(null);
        return;
      }

      const validationError = validateCategoryName(trimmedName);
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(`edit-${category._id}`, true);
      setError(null);
      try {
        const data = {
          categoryId: category._id,
          name: trimmedName,
        };
        const res = await UpdateCategory(data);
        if (!res.data?.data) throw new Error('Invalid response format');

        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === category._id ? { ...cat, name: res.data.data.name } : cat,
            ),
          ),
        );
        setEditCategoryId(null);
        setEditCategoryName('');
      } catch (error: any) {
        console.error('Failed to update category:', error);
        setError(error.response?.status === 409 ? ERROR_MESSAGES.DUPLICATE : ERROR_MESSAGES.UPDATE);
      } finally {
        setLoading(`edit-${category._id}`, false);
      }
    },
    [editCategoryName, categoryList, dispatch],
  );

  const handleEditCancel = useCallback(() => {
    setEditCategoryId(null);
    setEditCategoryName('');
    setError(null);
  }, []);

  const categoryListRender = useMemo(
    () =>
      categoryList.map((cat: CategoryType) => (
        <li key={cat._id} className="flex justify-between items-center p-4">
          {editCategoryId === cat._id ? (
            <form
              onSubmit={(e) => handleEditSubmit(e, cat)}
              className="flex items-center gap-2 w-full"
            >
              <TextInput
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                placeholder="Edit category name"
                required
                className="flex-1"
                disabled={loadingStates[`edit-${cat._id}`]}
                aria-label={`Edit name for ${cat.name}`}
              />
              <Button
                color="blue"
                type="submit"
                size="sm"
                disabled={loadingStates[`edit-${cat._id}`]}
              >
                {loadingStates[`edit-${cat._id}`] ? 'Saving...' : 'Save'}
              </Button>
              <Button
                color="gray"
                size="sm"
                onClick={handleEditCancel}
                disabled={loadingStates[`edit-${cat._id}`]}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <>
              <span className="text-gray-600 font-semibold flex-1">{cat.name}</span>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => handleEditStart(cat._id, cat.name)}
                  color="blue"
                  aria-label={`Edit ${cat.name}`}
                >
                  <MdModeEdit className="text-black cursor-pointer" size={18} />
                </div>
                <div
                  color="blue"
                  onClick={() => handleDelete(cat)}
                  aria-label={`Delete ${cat.name}`}
                >
                  <MdDelete className="text-red-600 cursor-pointer" size={18} />
                </div>
                <ToggleSwitch
                  checked={cat.isActive}
                  onChange={() => handleToggle(cat)}
                  className="focus:ring-0"
                  aria-label={`Toggle active status for ${cat.name}`}
                />
              </div>
            </>
          )}
        </li>
      )),
    [
      categoryList,
      editCategoryId,
      editCategoryName,
      handleToggle,
      handleEditStart,
      handleDelete,
      handleEditSubmit,
      handleEditCancel,
      loadingStates,
    ],
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Main Category</h2>
          <Button
            color="blue"
            size="sm"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            disabled={loadingStates.create}
          >
            {showCategoryForm ? 'Cancel' : 'Create New Category'}
          </Button>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {showCategoryForm ? (
          <form
            onSubmit={handleCategorySubmit}
            className="w-1/2 flex flex-col gap-5 bg-white shadow-md rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-700">Create Category</h2>
            <TextInput
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder="Enter category name"
              required
              disabled={loadingStates.create}
              aria-label="Category name"
            />
            <Button color="blue" type="submit" size="sm" disabled={loadingStates.create}>
              {loadingStates.create ? 'Creating...' : 'Create Category'}
            </Button>
          </form>
        ) : categoryList.length === 0 ? (
          <p className="text-gray-500">No categories available.</p>
        ) : (
          <ul className="bg-white shadow-md rounded-md divide-y">{categoryListRender}</ul>
        )}
      </div>
    </div>
  );
};

export default Category;
