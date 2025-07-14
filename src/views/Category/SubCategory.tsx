import { useState, useCallback, useMemo, FormEvent } from 'react';
import { Button, TextInput, ToggleSwitch, Select } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryList, setSearchSubCategory } from 'src/Store/Slices/Categories';
import { RootState } from 'src/Store/Store';
import {
  CreateSubCategory,
  UpdateSubCategory,
  DeleteSubCategory,
} from 'src/AxiosConfig/AxiosConfig';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import NoDataFound from 'src/components/NoDataFound';
import DeleteDialog from 'src/components/DeleteDialog';
import Loading from 'src/components/Loading';
import { Toast } from 'src/components/Toast';

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

const SubCategory = () => {
  const dispatch = useDispatch();
  const { categoryList, loading, subCategorySearch } = useSelector(
    (state: RootState) => state.category,
  );
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editSubCategoryId, setEditSubCategoryId] = useState<string | null>(null);
  const [editSubCategoryName, setEditSubCategoryName] = useState('');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ create?: string; edit?: string; delete?: string }>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryType | null>(null);

  const setLoading = (key: string, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  const validateSubCategory = (name: string, categoryId: string): string | null => {
    if (!categoryId) return 'Please select a category.';
    if (!name || name.trim().length < 3) return 'This field can not be empty.';
    const category = categoryList.find((cat) => cat._id === categoryId);
    const duplicate = category?.subCategories.some(
      (sub) => sub.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (duplicate) return 'Subcategory name already exists in this category.';
    return null;
  };

  const handleAddSubCategory = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const trimmedName = subCategoryName.trim();

      const validationError = validateSubCategory(trimmedName, selectedCategory);
      if (validationError) {
        setError((prev) => ({ ...prev, create: validationError }));
        return;
      }

      setLoading('create', true);
      setError({});

      try {
        const data = { name: trimmedName, categoryId: selectedCategory };
        const res = await CreateSubCategory(data);
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
        Toast({ message: 'SubCategory created successfully!', type: 'success' });
      } catch (error: any) {
        console.error('Failed to create subcategory:', error);
        setError((prev) => ({
          ...prev,
          create: 'Failed to create subcategory. Please try again.',
        }));
      } finally {
        setLoading('create', false);
      }
    },
    [subCategoryName, selectedCategory, categoryList, dispatch],
  );

  const handleToggle = useCallback(
    async (catId: string, subCategory: SubCategoryType) => {
      setLoading(`toggle-${subCategory._id}`, true);
      try {
        const data = {
          categoryId: catId,
          subCategoryId: subCategory._id,
          isActive: !subCategory.isActive,
        };
        const res = await UpdateSubCategory(data);
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
        setError((prev) => ({
          ...prev,
          edit: 'Failed to toggle subcategory. Please try again.',
        }));
      } finally {
        setLoading(`toggle-${subCategory._id}`, false);
      }
    },
    [categoryList, dispatch],
  );

  const handleEditStart = useCallback((subCatId: string, name: string) => {
    setEditSubCategoryId(subCatId);
    setEditSubCategoryName(name);
  }, []);

  const handleEditSubmit = useCallback(
    async (e: FormEvent, catId: string, subCategory: SubCategoryType) => {
      e.preventDefault();
      const trimmedName = editSubCategoryName.trim();
      if (trimmedName === subCategory.name) {
        setEditSubCategoryId(null);
        return;
      }
      setError((prev) => ({ ...prev, edit: undefined }));

      const validationError = validateSubCategory(trimmedName, catId);
      if (validationError) {
        setError((prev) => ({ ...prev, edit: validationError }));
        return;
      }

      setLoading(`edit-${subCategory._id}`, true);

      try {
        const data = {
          categoryId: catId,
          subCategoryId: subCategory._id,
          name: trimmedName,
        };
        const res = await UpdateSubCategory(data);
        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === catId
                ? {
                    ...cat,
                    subCategories: cat.subCategories.map((sub) =>
                      sub._id === subCategory._id
                        ? {
                            ...sub,
                            name: res.data.data.name,
                            isActive: res.data.data.isActive,
                          }
                        : sub,
                    ),
                  }
                : cat,
            ),
          ),
        );

        setEditSubCategoryId(null);
        setEditSubCategoryName('');
        Toast({ message: 'SubCategory updated successfully!', type: 'success' });
      } catch (error: any) {
        console.error('Failed to update subcategory:', error);
        setError((prev) => ({
          ...prev,
          edit: 'Failed to update subcategory. Please try again.',
        }));
      } finally {
        setLoading(`edit-${subCategory._id}`, false);
      }
    },
    [editSubCategoryName, categoryList, dispatch],
  );

  const handleEditCancel = useCallback(() => {
    setEditSubCategoryId(null);
    setEditSubCategoryName('');
  }, []);

  const handleOpenDelete = useCallback((subCategory: SubCategoryType) => {
    setSelectedSubCategory(subCategory);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedSubCategory(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedSubCategory || !selectedCategory) return;

    setLoading(`delete-${selectedSubCategory._id}`, true);
    try {
      await DeleteSubCategory({
        categoryId: selectedCategory,
        subCategoryId: selectedSubCategory._id,
      });
      dispatch(
        setCategoryList(
          categoryList.map((cat) =>
            cat._id === selectedCategory
              ? {
                  ...cat,
                  subCategories: cat.subCategories.filter(
                    (sub) => sub._id !== selectedSubCategory._id,
                  ),
                }
              : cat,
          ),
        ),
      );
      setIsDeleteDialogOpen(false);
      setSelectedSubCategory(null);
    } catch (error: any) {
      console.error('Failed to delete subcategory:', error);
      setError((prev) => ({
        ...prev,
        delete: 'Failed to delete subcategory. Please try again.',
      }));
    } finally {
      setLoading(`delete-${selectedSubCategory._id}`, false);
    }
  }, [selectedSubCategory, selectedCategory, categoryList, dispatch]);

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
              <div className="flex-1">
                <TextInput
                  value={editSubCategoryName}
                  onChange={(e) => {
                    if (error.edit) {
                      setError((prev) => ({ ...prev, edit: '' }));
                    }
                    setEditSubCategoryName(e.target.value);
                  }}
                  placeholder="Edit subcategory name"
                  className="flex-1"
                  disabled={loadingStates[`edit-${sub._id}`]}
                  aria-label={`Edit name for ${sub.name}`}
                />
                {error.edit && <p className="text-red-500">{error.edit}</p>}
              </div>
              <Button color="primary" type="submit" size="sm">
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
              <div className="flex items-center gap-4">
                <div
                  onClick={() => handleEditStart(sub._id, sub.name)}
                  color="primary"
                  aria-label={`Edit ${sub.name}`}
                >
                  <MdModeEdit className="text-black cursor-pointer" size={18} />
                </div>
                <div
                  onClick={() => handleOpenDelete(sub)}
                  color="primary"
                  aria-label={`Delete ${sub.name}`}
                >
                  <MdDelete className="text-red-600 cursor-pointer" size={18} />
                </div>
                <ToggleSwitch
                  checked={sub.isActive}
                  onChange={() => handleToggle(selectedCategory, sub)}
                  aria-label={`Toggle active status for ${sub.name}`}
                />
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
      confirmDelete,
      handleEditSubmit,
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
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Sub Categories</h2>
            <Button
              color="primary"
              size="sm"
              onClick={() => setShowForm(!showForm)}
              disabled={loadingStates.create || categoryList.length === 0 || !selectedCategory}
              className="w-full sm:w-auto"
            >
              {showForm ? 'Cancel' : 'Create New SubCategory'}
            </Button>
          </div>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <TextInput
            placeholder="Search"
            className="w-full sm:w-1/3"
            value={subCategorySearch}
            onChange={(e) => dispatch(setSearchSubCategory(e.target.value))}
          />
          <Select
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
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
        </div>

        {error.delete && <p className="text-red-500">{error.delete}</p>}

        {loading ? (
          <Loading />
        ) : showForm ? (
          <form
            onSubmit={handleAddSubCategory}
            className="w-full sm:w-2/3 md:w-1/2 flex flex-col gap-4 bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-600">Create SubCategory</h3>
            <div>
              <TextInput
                value={subCategoryName}
                onChange={(e) => {
                  if (error.create) {
                    setError((prev) => ({ ...prev, create: '' }));
                  }
                  setSubCategoryName(e.target.value);
                }}
                placeholder="Enter subcategory name"
                disabled={loadingStates.create}
                aria-label="Subcategory name"
              />
              {error.create && <p className="text-red-500">{error.create}</p>}
            </div>
            <Button
              color="primary"
              type="submit"
              size="sm"
              disabled={loadingStates.create}
              className="w-full sm:w-auto"
            >
              {loadingStates.create ? 'Creating...' : 'Create SubCategory'}
            </Button>
          </form>
        ) : selectedCategory ? (
          filteredSubCategories.length > 0 ? (
            <ul className="bg-white shadow-md rounded-md divide-y mt-4">{subCategoryListRender}</ul>
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
        message={`Are you sure you want to delete this Subcategory?`}
      />
    </div>
  );
};

export default SubCategory;
