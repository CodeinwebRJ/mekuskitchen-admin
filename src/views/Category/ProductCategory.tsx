import { useState, useCallback, useMemo, FormEvent } from 'react';
import { Button, Select, TextInput, ToggleSwitch } from 'flowbite-react';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryList } from 'src/Store/Slices/Categories';
import { RootState } from 'src/Store/Store';
import {
  CreateSubSubCategory,
  UpdateSubSubCategory,
  DeleteSubSubCategory,
} from 'src/AxiosConfig/AxiosConfig';

// Define constants
const ERROR_MESSAGES = {
  CREATE: 'Failed to create product category. Please try again.',
  UPDATE: 'Failed to update product category. Please try again.',
  DELETE: 'Failed to delete product category. Please try again.',
  DUPLICATE: 'Product category name already exists in this subcategory.',
  INVALID: 'Product category name must be at least 3 characters long.',
  NO_CATEGORY: 'Please select a category.',
  NO_SUBCATEGORY: 'Please select a subcategory.',
};

const ProductCategory = () => {
  const dispatch = useDispatch();
  const categoryList = useSelector((state: RootState) => state.category.categoryList);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [subSubCategoryName, setSubSubCategoryName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editSubSubCategoryId, setEditSubSubCategoryId] = useState<string | null>(null);
  const [editSubSubCategoryName, setEditSubSubCategoryName] = useState('');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const setLoading = (key: string, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  const validateSubSubCategoryName = (
    name: string,
    categoryId: string,
    subCategoryId: string,
  ): string | null => {
    if (name.trim().length < 3) return ERROR_MESSAGES.INVALID;
    const category = categoryList.find((cat) => cat._id === categoryId);
    const subCategory = category?.subCategories.find((sub) => sub._id === subCategoryId);
    if (
      subCategory?.subSubCategories.some(
        (ssub) => ssub.name.toLowerCase() === name.trim().toLowerCase(),
      )
    ) {
      return ERROR_MESSAGES.DUPLICATE;
    }
    return null;
  };

  const filteredSubCategories = useMemo(
    () => categoryList.find((cat) => cat._id === selectedCategory)?.subCategories || [],
    [categoryList, selectedCategory],
  );

  const filteredSubSubCategories = useMemo(
    () =>
      filteredSubCategories.find((sub) => sub._id === selectedSubCategory)?.subSubCategories || [],
    [filteredSubCategories, selectedSubCategory],
  );

  const handleAddSubSubCategory = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const trimmedName = subSubCategoryName.trim();
      if (!selectedCategory) {
        setError(ERROR_MESSAGES.NO_CATEGORY);
        return;
      }
      if (!selectedSubCategory) {
        setError(ERROR_MESSAGES.NO_SUBCATEGORY);
        return;
      }
      const validationError = validateSubSubCategoryName(
        trimmedName,
        selectedCategory,
        selectedSubCategory,
      );
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading('create', true);
      setError(null);
      try {
        const data = {
          name: trimmedName,
          categoryId: selectedCategory,
          subCategoryId: selectedSubCategory,
        };
        const res = await CreateSubSubCategory(data);
        if (!res.data?.data) throw new Error('Invalid response format');

        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === selectedCategory
                ? {
                    ...cat,
                    subCategories: cat.subCategories.map((sub) =>
                      sub._id === selectedSubCategory
                        ? {
                            ...sub,
                            subSubCategories: [...sub.subSubCategories, res.data.data],
                          }
                        : sub,
                    ),
                  }
                : cat,
            ),
          ),
        );
        setSubSubCategoryName('');
        setShowForm(false);
      } catch (error: any) {
        console.error('Failed to create sub-subcategory:', error);
        setError(error.response?.status === 409 ? ERROR_MESSAGES.DUPLICATE : ERROR_MESSAGES.CREATE);
      } finally {
        setLoading('create', false);
      }
    },
    [subSubCategoryName, selectedCategory, selectedSubCategory, categoryList, dispatch],
  );

  const handleEditStart = useCallback((ssub: SubSubCategoryType) => {
    setEditSubSubCategoryId(ssub._id);
    setEditSubSubCategoryName(ssub.name);
    setError(null);
  }, []);

  const handleEditSubmit = useCallback(
    async (e: FormEvent, catId: string, subCatId: string, subSubCategory: SubSubCategoryType) => {
      e.preventDefault();
      const trimmedName = editSubSubCategoryName.trim();
      if (trimmedName === subSubCategory.name) {
        setEditSubSubCategoryId(null);
        return;
      }

      const validationError = validateSubSubCategoryName(trimmedName, catId, subCatId);
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(`edit-${subSubCategory._id}`, true);
      setError(null);
      try {
        const data = {
          categoryId: catId,
          subCategoryId: subCatId,
          subSubCategoryId: subSubCategory._id,
          name: trimmedName,
        };
        const res = await UpdateSubSubCategory(data);
        if (!res.data?.data) throw new Error('Invalid response format');

        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === catId
                ? {
                    ...cat,
                    subCategories: cat.subCategories.map((sub) =>
                      sub._id === subCatId
                        ? {
                            ...sub,
                            subSubCategories: sub.subSubCategories.map((ssub) =>
                              ssub._id === subSubCategory._id
                                ? {
                                    ...ssub,
                                    name: res.data.data.name,
                                    isActive: res.data.data.isActive,
                                  }
                                : ssub,
                            ),
                          }
                        : sub,
                    ),
                  }
                : cat,
            ),
          ),
        );
        setEditSubSubCategoryId(null);
        setEditSubSubCategoryName('');
      } catch (error: any) {
        console.error('Failed to update sub-subcategory:', error);
        setError(error.response?.status === 409 ? ERROR_MESSAGES.DUPLICATE : ERROR_MESSAGES.UPDATE);
      } finally {
        setLoading(`edit-${subSubCategory._id}`, false);
      }
    },
    [editSubSubCategoryName, categoryList, dispatch],
  );

  const handleToggle = useCallback(
    async (catId: string, subCatId: string, subSubCategory: SubSubCategoryType) => {
      setLoading(`toggle-${subSubCategory._id}`, true);
      setError(null);
      try {
        const data = {
          categoryId: catId,
          subCategoryId: subCatId,
          subSubCategoryId: subSubCategory._id,
          isActive: !subSubCategory.isActive,
        };
        const res = await UpdateSubSubCategory(data);
        if (!res.data?.data) throw new Error('Invalid response format');

        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === catId
                ? {
                    ...cat,
                    subCategories: cat.subCategories.map((sub) =>
                      sub._id === subCatId
                        ? {
                            ...sub,
                            subSubCategories: sub.subSubCategories.map((ssub) =>
                              ssub._id === subSubCategory._id
                                ? { ...ssub, isActive: res.data.data.isActive }
                                : ssub,
                            ),
                          }
                        : sub,
                    ),
                  }
                : cat,
            ),
          ),
        );
      } catch (error: any) {
        console.error('Failed to toggle sub-subcategory:', error);
        setError(ERROR_MESSAGES.UPDATE);
      } finally {
        setLoading(`toggle-${subSubCategory._id}`, false);
      }
    },
    [categoryList, dispatch],
  );

  const handleDelete = useCallback(
    async (catId: string, subCatId: string, subSubCategory: SubSubCategoryType) => {
      if (!window.confirm(`Are you sure you want to delete "${subSubCategory.name}"?`)) return;

      setLoading(`delete-${subSubCategory._id}`, true);
      setError(null);
      try {
        const data = {
          categoryId: catId,
          subCategoryId: subCatId,
          subSubCategoryId: subSubCategory._id,
        };
        await DeleteSubSubCategory(data);
        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === catId
                ? {
                    ...cat,
                    subCategories: cat.subCategories.map((sub) =>
                      sub._id === subCatId
                        ? {
                            ...sub,
                            subSubCategories: sub.subSubCategories.filter(
                              (ssub) => ssub._id !== subSubCategory._id,
                            ),
                          }
                        : sub,
                    ),
                  }
                : cat,
            ),
          ),
        );
      } catch (error: any) {
        console.error('Failed to delete sub-subcategory:', error);
        setError(ERROR_MESSAGES.DELETE);
      } finally {
        setLoading(`delete-${subSubCategory._id}`, false);
      }
    },
    [categoryList, dispatch],
  );

  const handleEditCancel = useCallback(() => {
    setEditSubSubCategoryId(null);
    setEditSubSubCategoryName('');
    setError(null);
  }, []);

  const subSubCategoryListRender = useMemo(
    () =>
      filteredSubSubCategories.map((ssub: SubSubCategoryType) => (
        <li key={ssub._id} className="flex justify-between items-center p-4">
          {editSubSubCategoryId === ssub._id ? (
            <form
              onSubmit={(e) => handleEditSubmit(e, selectedCategory, selectedSubCategory, ssub)}
              className="flex items-center gap-2 w-full"
            >
              <TextInput
                value={editSubSubCategoryName}
                onChange={(e) => setEditSubSubCategoryName(e.target.value)}
                placeholder="Edit product category name"
                required
                className="flex-1"
                disabled={loadingStates[`edit-${ssub._id}`]}
                aria-label={`Edit name for ${ssub.name}`}
              />
              <Button
                type="submit"
                size="sm"
                disabled={loadingStates[`edit-${ssub._id}`]}
              >
                {loadingStates[`edit-${ssub._id}`] ? 'Saving...' : 'Save'}
              </Button>
              <Button
                color="gray"
                size="sm"
                type="button"
                onClick={handleEditCancel}
                disabled={loadingStates[`edit-${ssub._id}`]}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <>
              <span className="text-gray-700 font-medium flex-1">{ssub.name}</span>
              <div className="flex items-center gap-2">
                <ToggleSwitch
                  checked={ssub.isActive}
                  onChange={() => handleToggle(selectedCategory, selectedSubCategory, ssub)}
                  disabled={loadingStates[`toggle-${ssub._id}`]}
                  aria-label={`Toggle active status for ${ssub.name}`}
                />
                <Button
                  onClick={() => handleEditStart(ssub)}
                  className="text-blue-500 hover:text-blue-700 disabled:text-gray-400"
                  aria-label={`Edit ${ssub.name}`}
                  disabled={
                    loadingStates[`edit-${ssub._id}`] || loadingStates[`delete-${ssub._id}`]
                  }
                >
                  <FiEdit size={18} />
                </Button>
                <Button
                  onClick={() => handleDelete(selectedCategory, selectedSubCategory, ssub)}
                  className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                  aria-label={`Delete ${ssub.name}`}
                  disabled={
                    loadingStates[`edit-${ssub._id}`] || loadingStates[`delete-${ssub._id}`]
                  }
                >
                  <FiTrash size={18} />
                </Button>
              </div>
            </>
          )}
        </li>
      )),
    [
      filteredSubSubCategories,
      editSubSubCategoryId,
      editSubSubCategoryName,
      selectedCategory,
      selectedSubCategory,
      handleEditSubmit,
      handleEditStart,
      handleToggle,
      handleDelete,
      handleEditCancel,
      loadingStates,
    ],
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Product Categories</h2>
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
            disabled={loadingStates.create || categoryList.length === 0 || !selectedSubCategory}
          >
            {showForm ? 'Cancel' : 'Create New Product Category'}
          </Button>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <div className="mb-4 flex items-center gap-4">
          <Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory('');
              setEditSubSubCategoryId(null);
              setShowForm(false);
            }}
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

          <Select
            value={selectedSubCategory}
            onChange={(e) => {
              setSelectedSubCategory(e.target.value);
              setEditSubSubCategoryId(null);
              setShowForm(false);
            }}
            className="w-1/3"
            disabled={
              !selectedCategory || loadingStates.create || filteredSubCategories.length === 0
            }
            aria-label="Select subcategory"
          >
            <option value="">Select SubCategory</option>
            {filteredSubCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </Select>
        </div>

        {showForm && selectedSubCategory && (
          <form
            onSubmit={handleAddSubSubCategory}
            className="w-1/2 flex flex-col gap-4 bg-white shadow-md rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-600">Create Product Category</h3>
            <TextInput
              value={subSubCategoryName}
              onChange={(e) => setSubSubCategoryName(e.target.value)}
              placeholder="Enter product category name"
              required
              disabled={loadingStates.create}
              aria-label="Product category name"
            />
            <Button type="submit" size="sm" disabled={loadingStates.create}>
              {loadingStates.create ? 'Creating...' : 'Create'}
            </Button>
          </form>
        )}

        {selectedSubCategory && filteredSubSubCategories.length > 0 && (
          <ul className="bg-white shadow-md rounded-md divide-y mt-4">
            {subSubCategoryListRender}
          </ul>
        )}

        {selectedSubCategory && filteredSubSubCategories.length === 0 && (
          <p className="text-gray-500 mt-4">No product categories available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductCategory;
