import { RouterProvider } from 'react-router';
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './Store/Store';
import customTheme from './utils/theme/custom-theme';
import router from './routes/Router';
import { setCategoryList, setCategoryLoading, setError } from './Store/Slices/Categories';
import { setLoading, setProducts } from './Store/Slices/ProductData';
import { setTiffin } from './Store/Slices/Tiffin';

import { getAllProduct, getAllTiffin, getCategory } from './AxiosConfig/AxiosConfig';
import useDebounce from './Hook/useDebounce';
import { Toaster } from 'react-hot-toast';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const filterData = useSelector((state: RootState) => state.filterData);
  const { products } = useSelector((state: RootState) => state.product);
  const { categorySearch, subCategorySearch, productCategorySearch } = useSelector(
    (state: RootState) => state.category,
  );
  const category = useDebounce(categorySearch, 500);
  const subCategory = useDebounce(subCategorySearch, 500);
  const productCategory = useDebounce(productCategorySearch, 500);
  const debouncedSearch = useDebounce(filterData.search, 500);

  const fetchCategories = useCallback(async () => {
    try {
      dispatch(setError(null));
      dispatch(setCategoryLoading(true));
      const data = {
        categorySearch: category,
        subCategorySearch: subCategory,
        productCategorySearch: productCategory,
      };
      const res = await getCategory(data);
      if (res?.data?.data) {
        dispatch(setCategoryList(res.data.data));
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      dispatch(setError('Failed to fetch categories. Please try again.'));
    } finally {
      dispatch(setCategoryLoading(false));
    }
  }, [dispatch, products?.length, category, subCategory, productCategory]);

  const fetchProducts = useCallback(async () => {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));
      const data = {
        search: debouncedSearch,
        page: filterData.page,
        limit: filterData.limit,
        sortBy: filterData.sortBy,
        category: filterData.categories,
        subCategory: filterData.subCategories,
        ProductCategory: filterData.productCategories,
        brands: filterData.Brands,
        variation: filterData.variation,
        attributes: filterData.attributes,
        isActive: filterData.isActive,
      };
      const res = await getAllProduct(data);
      dispatch(setProducts(res?.data?.data));
    } catch (error: any) {
      console.error('Error fetching products:', error);
      dispatch(setError('Failed to fetch products. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [
    dispatch,
    debouncedSearch,
    filterData.page,
    filterData.limit,
    filterData.sortBy,
    filterData.categories,
    filterData.subCategories,
    filterData.productCategories,
    filterData.Brands,
    filterData.variation,
    filterData.attributes,
    filterData.isActive,
  ]);

  const fetchAllTiffin = useCallback(async () => {
    try {
      const data = { day: '', Active: '', search: '' };
      const res = await getAllTiffin(data);
      dispatch(setTiffin(res?.data?.data));
    } catch (error) {
      console.error('Error fetching tiffin:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchAllTiffin();
  }, [fetchAllTiffin]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              padding: '12px 16px',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              style: {
                background: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
        <RouterProvider router={router} />
      </Flowbite>
    </>
  );
}

export default App;
