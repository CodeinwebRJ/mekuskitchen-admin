import { RouterProvider } from 'react-router';
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from './routes/Router';
import { useCallback, useEffect } from 'react';
import { setCategoryList, setError } from './Store/Slices/Categories';
import { getCategory } from './AxiosConfig/AxiosConfig';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './Store/Store';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const res = await getCategory();
      if (res.data?.data) {
        dispatch(setCategoryList(res.data.data));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again.');
    }
  }, []);

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
