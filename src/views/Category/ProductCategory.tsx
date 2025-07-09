import { useState, useCallback, useMemo, FormEvent } from 'react';
import { Button, Select, TextInput, ToggleSwitch } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryList, setSearchProductCategory } from 'src/Store/Slices/Categories';
import { RootState } from 'src/Store/Store';
import {
  CreateSubSubCategory,
  UpdateSubSubCategory,
  DeleteSubSubCategory,
} from 'src/AxiosConfig/AxiosConfig';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import NoDataFound from 'src/components/NoDataFound';
import DeleteDialog from 'src/components/DeleteDialog';
import Loading from 'src/components/Loading';

// Define constants
const ERROR_MESSAGES = {
  CREATE: '',
  UPDATE: 'Failed to update product category. Please try again.',
  DELETE: 'Failed to delete product category. Please try again.',
  DUPLICATE: 'Product category name already exists in this subcategory.',
  INVALID: 'This field can not be empty.',
  NO_CATEGORY: 'Please select a category.',
  NO_SUBCATEGORY: 'Please select a subcategory.',
};

const ProductCategory = () => {
  const dispatch = useDispatch();
  const { categoryList, loading, productCategorySearch } = useSelector(
    (state: RootState) => state.category,
  );
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [subSubCategoryName, setSubSubCategoryName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editSubSubCategoryId, setEditSubSubCategoryId] = useState<string | null>(null);
  const [editSubSubCategoryName, setEditSubSubCategoryName] = useState('');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ create?: string; edit?: string; delete?: string }>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState<SubSubCategoryType | null>(
    null,
  );

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
        setError((prev) => ({ ...prev, create: 'Please select a category.' }));
        return;
      }
      if (!selectedSubCategory) {
        setError((prev) => ({ ...prev, create: 'Please select a category.' }));
        return;
      }
      const validationError = validateSubSubCategoryName(
        trimmedName,
        selectedCategory,
        selectedSubCategory,
      );
      if (validationError) {
        setError((prev) => ({ ...prev, create: validationError }));
        return;
      }

      setLoading('create', true);
      try {
        const data = {
          name: trimmedName,
          categoryId: selectedCategory,
          subCategoryId: selectedSubCategory,
        };
        const res = await CreateSubSubCategory(data);
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
        setError((prev) => ({
          ...prev,
          create: 'Failed to create product category. Please try again.',
        }));
      } finally {
        setLoading('create', false);
      }
    },
    [subSubCategoryName, selectedCategory, selectedSubCategory, categoryList, dispatch],
  );

  const handleEditStart = useCallback((ssub: SubSubCategoryType) => {
    setEditSubSubCategoryId(ssub._id);
    setEditSubSubCategoryName(ssub.name);
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
        setError((prev) => ({
          ...prev,
          edit: validationError,
        }));
        return;
      }

      setLoading(`edit-${subSubCategory._id}`, true);
      try {
        const data = {
          categoryId: catId,
          subCategoryId: subCatId,
          subSubCategoryId: subSubCategory._id,
          name: trimmedName,
        };
        const res = await UpdateSubSubCategory(data);
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
        setError((prev) => ({
          ...prev,
          edit: 'Failed to create product category. Please try again.',
        }));
      } finally {
        setLoading(`edit-${subSubCategory._id}`, false);
      }
    },
    [editSubSubCategoryName, categoryList, dispatch],
  );

  const handleToggle = useCallback(
    async (catId: string, subCatId: string, subSubCategory: SubSubCategoryType) => {
      setLoading(`toggle-${subSubCategory._id}`, true);
      try {
        const data = {
          categoryId: catId,
          subCategoryId: subCatId,
          subSubCategoryId: subSubCategory._id,
          isActive: !subSubCategory.isActive,
        };
        const res = await UpdateSubSubCategory(data);
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
        setError((prev) => ({
          ...prev,
          edit: 'Failed to toggle product category. Please try again.',
        }));
      } finally {
        setLoading(`toggle-${subSubCategory._id}`, false);
      }
    },
    [categoryList, dispatch],
  );

  const handleOpenDelete = useCallback((ssub: SubSubCategoryType) => {
    setSelectedSubSubCategory(ssub);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedSubSubCategory(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedCategory || !selectedSubCategory || !selectedSubSubCategory) return;

    setLoading(`delete-${selectedSubSubCategory._id}`, true);
    try {
      await DeleteSubSubCategory({
        categoryId: selectedCategory,
        subCategoryId: selectedSubCategory,
        subSubCategoryId: selectedSubSubCategory._id,
      });

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
                          subSubCategories: sub.subSubCategories.filter(
                            (ssub) => ssub._id !== selectedSubSubCategory._id,
                          ),
                        }
                      : sub,
                  ),
                }
              : cat,
          ),
        ),
      );
      setIsDeleteDialogOpen(false);
      setSelectedSubSubCategory(null);
    } catch (error: any) {
      console.error('Failed to delete product category:', error);
      setError((prev) => ({
        ...prev,
        delete: 'Failed to delete product category. Please try again.',
      }));
    } finally {
      setLoading(`delete-${selectedSubSubCategory._id}`, false);
    }
  }, [selectedCategory, selectedSubCategory, selectedSubSubCategory, categoryList, dispatch]);

  const handleEditCancel = useCallback(() => {
    setEditSubSubCategoryId(null);
    setEditSubSubCategoryName('');
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
              <div className="flex-1">
                <TextInput
                  value={editSubSubCategoryName}
                  onChange={(e) => {
                    if (error.edit) {
                      setError((prev) => ({ ...prev, edit: '' }));
                    }
                    setEditSubSubCategoryName(e.target.value);
                  }}
                  placeholder="Edit product category name"
                  className="flex-1"
                  disabled={loadingStates[`edit-${ssub._id}`]}
                  aria-label={`Edit name for ${ssub.name}`}
                />
                {error.edit && <div className="text-red-600">{error.edit}</div>}
              </div>
              <Button type="submit" size="sm" color="primary">
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
              <div className="flex items-center gap-4">
                <div
                  onClick={() => handleEditStart(ssub)}
                  color="primary"
                  aria-label={`Edit ${ssub.name}`}
                >
                  <MdModeEdit className="text-black cursor-pointer" size={18} />
                </div>
                <div
                  onClick={() => handleOpenDelete(ssub)}
                  color="primary"
                  aria-label={`Delete ${ssub.name}`}
                >
                  <MdDelete className="text-red-600 cursor-pointer" size={18} />
                </div>
                <ToggleSwitch
                  checked={ssub.isActive}
                  onChange={() => handleToggle(selectedCategory, selectedSubCategory, ssub)}
                  aria-label={`Toggle active status for ${ssub.name}`}
                />
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
      confirmDelete,
      handleEditCancel,
      loadingStates,
      error.edit,
    ],
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Product Categories</h2>
            <Button
              color="primary"
              size="sm"
              onClick={() => setShowForm(!showForm)}
              disabled={loadingStates.create || categoryList.length === 0 || !selectedSubCategory}
              className="w-full sm:w-auto"
            >
              {showForm ? 'Cancel' : 'Create New Product Category'}
            </Button>
          </div>
          {error.delete && <div className="text-red-600">{error.delete}</div>}

          <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <TextInput
              placeholder="Search"
              className="w-full sm:w-1/3"
              value={productCategorySearch}
              onChange={(e) => dispatch(setSearchProductCategory(e.target.value))}
            />
            <Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory('');
                setEditSubSubCategoryId(null);
                setShowForm(false);
              }}
              className="w-full sm:w-1/3"
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
              className="w-full sm:w-1/3"
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
        </div>

        {loading ? (
          <Loading />
        ) : selectedSubCategory ? (
          showForm ? (
            <form
              onSubmit={handleAddSubSubCategory}
              className="w-full sm:w-2/3 md:w-1/2 flex flex-col gap-4 bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-600">
                Create Product Category
              </h3>
              <div>
                <TextInput
                  value={subSubCategoryName}
                  onChange={(e) => {
                    if (error.create) {
                      setError((prev) => ({ ...prev, create: '' }));
                    }
                    setSubSubCategoryName(e.target.value);
                  }}
                  placeholder="Enter product category name"
                  disabled={loadingStates.create}
                  aria-label="Product category name"
                />
                {error.create && <div className="text-red-600">{error.create}</div>}
              </div>
              <Button
                color="primary"
                size="sm"
                type="submit"
                disabled={loadingStates.create}
                className="w-full sm:w-auto"
              >
                {loadingStates.create ? 'Creating...' : 'Create Product Category'}
              </Button>
            </form>
          ) : filteredSubSubCategories.length > 0 ? (
            <ul className="bg-white shadow-md rounded-md divide-y mt-4">
              {subSubCategoryListRender}
            </ul>
          ) : (
            <div className="bg-white rounded-md">
              <NoDataFound />
            </div>
          )
        ) : null}
      </div>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onCancel={handleCancelDelete}
        onDelete={confirmDelete}
        message={`Are you sure you want to delete this Product Category?`}
      />
    </div>
  );
};

export default ProductCategory;
