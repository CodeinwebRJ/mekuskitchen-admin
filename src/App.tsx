import { RouterProvider } from 'react-router';
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from './routes/Router';
import { useCallback, useEffect } from 'react';
import { setCategoryList, setError, setLoading } from './Store/Slices/Categories';
import { getAllProduct, getCategory } from './AxiosConfig/AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './Store/Store';
import { setProducts } from './Store/Slices/ProductData';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const res = await getCategory();
      if (res?.data?.data) {
        dispatch(setCategoryList(res?.data?.data));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again.');
    }
  }, []);

  const filterData = useSelector((state: any) => state.filterData);

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      dispatch(setLoading(true));
      const data = {
        page: filterData?.page,
        limit: filterData?.limit,
        search: filterData?.search,
        sortBy: filterData?.sortBy,
        category: filterData?.categories,
        subCategory: filterData?.subCategories,
        ProductCategory: filterData?.productCategories,
        brands: filterData?.Brands,
        ratings: filterData?.ratings,
        attributes: filterData?.attributes,
      };
      const res = await getAllProduct(data);
      dispatch(setProducts(res?.data?.data));
      dispatch(setLoading(false));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again.');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filterData]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
        <RouterProvider router={router} />
      </Flowbite>
    </>
  );
}

export default App;
