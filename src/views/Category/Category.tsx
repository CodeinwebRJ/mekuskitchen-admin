import { Button, TextInput, ToggleSwitch } from 'flowbite-react';
import { useState, useCallback, FormEvent, useMemo } from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { CreateCategory, DeleteCategory, UpdateCategory } from 'src/AxiosConfig/AxiosConfig'; // Fixed typo
import DeleteDialog from 'src/components/DeleteDialog';
import Loading from 'src/components/Loading';
import NoDataFound from 'src/components/NoDataFound';
import { setCategoryList, setSearchCategory } from 'src/Store/Slices/Categories';
import { RootState } from 'src/Store/Store';
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

interface CategoryType {
  _id: string;
  name: string;
  subCategories: SubCategoryType[];
  isActive: boolean;
}

const Category = () => {
  const { categoryList, loading, categorySearch } = useSelector(
    (state: RootState) => state.category,
  );
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ create?: string; edit?: string; delete?: string }>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  const dispatch = useDispatch();

  const setLoading = (key: string, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpenDelete = useCallback((category: CategoryType) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedCategory(null);
  }, []);

  const confirmDeleteCategory = useCallback(async () => {
    if (!selectedCategory) return;

    setLoading(`delete-${selectedCategory._id}`, true);
    setError({});

    try {
      await DeleteCategory({ categoryId: selectedCategory._id });
      dispatch(setCategoryList(categoryList.filter((cat) => cat._id !== selectedCategory._id)));
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      setError((prev) => ({ ...prev, delete: 'Failed to delete category.' }));
    } finally {
      setLoading(`delete-${selectedCategory._id}`, false);
    }
  }, [selectedCategory, categoryList, dispatch]);

  const validateCategory = (name: string): string | null => {
    if (!name || name.trim() === '') return 'This field can not be empty.';
    return null;
  };

  const handleCategorySubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const trimmedInput = categoryInput.trim();
      const validationError = validateCategory(trimmedInput);

      if (validationError) {
        setError((prev) => ({ ...prev, create: validationError }));
        return;
      }

      setLoading('create', true);
      setError({});
      try {
        const data = { name: trimmedInput };
        const res = await CreateCategory(data);
        dispatch(setCategoryList([...categoryList, res.data.data]));
        setCategoryInput('');
        setShowCategoryForm(false);
        Toast({ message: 'Category created successfully!', type: 'success' });
      } catch (error: any) {
        console.log(error);
        setError((prev) => ({
          ...prev,
          create:
            error?.response?.data?.errorData || 'Failed to create category. Please try again.',
        }));
      } finally {
        setLoading('create', false);
      }
    },
    [categoryInput, categoryList, dispatch],
  );

  const handleToggle = useCallback(
    async (category: CategoryType) => {
      setLoading(`toggle-${category._id}`, true);
      setError({});
      try {
        const data = {
          categoryId: category._id,
          isActive: !category.isActive,
        };
        const res = await UpdateCategory(data);
        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === category._id ? { ...cat, isActive: res.data.data.isActive } : cat,
            ),
          ),
        );
      } catch (error: any) {
        console.error('Failed to toggle category:', error);
      } finally {
        setLoading(`toggle-${category._id}`, false);
      }
    },
    [categoryList, dispatch],
  );

  const handleEditStart = useCallback((id: string, name: string) => {
    setEditCategoryId(id);
    setEditCategoryName(name);
    setError({});
  }, []);

  const handleEditSubmit = useCallback(
    async (e: FormEvent, category: CategoryType) => {
      e.preventDefault();
      const trimmedName = editCategoryName.trim();
      const validationError = validateCategory(trimmedName);

      if (validationError) {
        setError((prev) => ({ ...prev, edit: validationError }));
        return;
      }

      if (trimmedName === category.name) {
        setEditCategoryId(null);
        return;
      }

      setLoading(`edit-${category._id}`, true);
      setError((prev) => ({ ...prev, edit: '' }));

      try {
        const data = {
          categoryId: category._id,
          name: trimmedName,
        };
        const res = await UpdateCategory(data);
        dispatch(
          setCategoryList(
            categoryList.map((cat) =>
              cat._id === category._id ? { ...cat, name: res.data.data.name } : cat,
            ),
          ),
        );
        setEditCategoryId(null);
        setEditCategoryName('');
        Toast({ message: 'Category updated successfully!', type: 'success' });
      } catch (error: any) {
        console.error('Failed to update category:', error);
        setError((prev) => ({
          ...prev,
          edit: 'Something went wrong, Please try again.',
        }));
      } finally {
        setLoading(`edit-${category._id}`, false);
      }
    },
    [editCategoryName, categoryList, dispatch],
  );

  const handleEditCancel = useCallback(() => {
    setEditCategoryId(null);
    setEditCategoryName('');
    setError({});
  }, []);

  const categoryListRender = useMemo(
    () =>
      categoryList.map((cat: CategoryType) => (
        <li key={cat._id} className="flex justify-between p-4">
          {editCategoryId === cat._id ? (
            <form
              onSubmit={(e) => handleEditSubmit(e, cat)}
              className="flex items-center gap-2 w-full"
            >
              <div className="flex flex-col w-full">
                <TextInput
                  value={editCategoryName}
                  onChange={(e) => {
                    setEditCategoryName(e.target.value);
                    if (error.edit) {
                      setError((prev) => ({ ...prev, edit: '' }));
                    }
                  }}
                  placeholder="Edit category name"
                  className="flex-1"
                  disabled={loadingStates[`edit-${cat._id}`]}
                  aria-label={`Edit name for ${cat.name}`}
                />
                {editCategoryId === cat._id && error.edit && (
                  <div className="text-red-500 text-sm mt-1">{error.edit}</div>
                )}
              </div>
              <Button
                color="primary"
                type="submit"
                size="sm"
                disabled={loadingStates[`edit-${cat._id}`]}
              >
                {loadingStates[`edit-${cat._id}`] ? 'Saving...' : 'Save'}
              </Button>
              <Button
                color="gray"
                size="sm"
                type="button"
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
                  aria-label={`Edit ${cat.name}`}
                >
                  <MdModeEdit className="text-black cursor-pointer" size={18} />
                </div>
                <div onClick={() => handleOpenDelete(cat)} aria-label={`Delete ${cat.name}`}>
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
      confirmDeleteCategory,
      handleEditSubmit,
      handleEditCancel,
      loadingStates,
      error.edit,
    ],
  );

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Main Category</h2>
            <Button
              color="primary"
              size="sm"
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              disabled={loadingStates.create}
              className="w-full sm:w-auto"
            >
              {showCategoryForm ? 'Cancel' : 'Create New Category'}
            </Button>
          </div>
          <div>
            <TextInput
              className="w-full sm:w-1/3"
              placeholder="Search Category"
              value={categorySearch}
              onChange={(e) => dispatch(setSearchCategory(e.target.value))}
            />
          </div>
        </div>
        {error.delete && <div className="text-red-600">{error.delete}</div>}

        {loading ? (
          <Loading />
        ) : showCategoryForm ? (
          <form
            onSubmit={handleCategorySubmit}
            className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 flex flex-col mb-4 gap-5 bg-white shadow-md rounded-lg p-4 sm:p-6"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Create Category</h2>
            <div>
              <TextInput
                value={categoryInput}
                onChange={(e) => {
                  if (error.create) {
                    setError((prev) => ({ ...prev, create: '' }));
                  }
                  setCategoryInput(e.target.value);
                }}
                placeholder="Enter category name"
                disabled={loadingStates.create}
                aria-label="Category name"
              />
              {error.create && <div className="text-red-600">{error.create}</div>}
            </div>
            <Button
              color="primary"
              type="submit"
              size="sm"
              disabled={loadingStates.create}
              className="w-full sm:w-auto"
            >
              {loadingStates.create ? 'Creating...' : 'Create Category'}
            </Button>
          </form>
        ) : categoryList.length === 0 ? (
          <div className="bg-white rounded-md">
            <NoDataFound />
          </div>
        ) : (
          <ul className="bg-white shadow-md rounded-md divide-y">{categoryListRender}</ul>
        )}
      </div>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onCancel={handleCancelDelete}
        onDelete={confirmDeleteCategory}
        message={`Are you sure you want to delete this Category?`}
      />
    </div>
  );
};

export default Category;
