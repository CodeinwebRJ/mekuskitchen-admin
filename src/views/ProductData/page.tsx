import { Button, TextInput, ToggleSwitch } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';
import Pagination from 'src/components/Pagination/Pagination';
import { setPage } from 'src/Store/Slices/FilterData';
import { MdModeEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { EditProduct } from 'src/AxiosConfig/AxiosConfig';
import { updateProductStatus } from 'src/Store/Slices/ProductData';

interface RootState {
  product: any;
}

const Page = () => {
  const { products, loading, page } = useSelector((state: RootState) => state.product);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const dispatch = useDispatch();

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
  };

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      dispatch(setPage(pageNumber));
    },
    [dispatch],
  );

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Filtering with:', { startDate, endDate });
  };

  const handleToggle = useCallback(
    async (productId: string, currentStatus: boolean) => {
      try {
        const newStatus = !currentStatus;
        await EditProduct({
          id: productId,
          data: { isActive: newStatus },
        });
        dispatch(
          updateProductStatus({
            productId,
            isActive: newStatus,
          }),
        );
      } catch (error) {
        console.error('Error updating product status:', error);
      }
    },
    [dispatch],
  );

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Products</h1>
      <form
        onSubmit={handleFilter}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6"
      >
        <div className="w-full lg:w-1/3">
          <TextInput placeholder="Search" className="w-full" />
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <Button type="submit" color="blue">
            Filter
          </Button>
          <Button type="button" onClick={handleReset} color="gray">
            Reset
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          <span className="ml-4 text-gray-700">Loading products...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-md text-sm text-left text-gray-800 border border-gray-200">
            <thead className="text-xs uppercase bg-white text-blue-800">
              <tr>
                <th className="px-4 py-3">Index</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Categories</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products?.data?.length > 0 &&
                products?.data?.map((product: any, index: number) => (
                  <tr key={product?._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <img
                        src={product?.images?.[0]?.url || '/default-product.jpg'}
                        alt={product?.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3">{product?.name?.toUpperCase()}</td>
                    <td className="px-4 py-3">₹{product?.price?.toFixed(2)}</td>
                    <td className="px-4 py-3">{product?.stock}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col text-sm gap-1">
                        {product?.category && <span>Category: {product?.category}</span>}
                        {product?.subCategory && <span>SubCategory: {product?.subCategory}</span>}
                        {product?.ProductCategory && (
                          <span>ProductCategory: {product?.ProductCategory}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{product.brand || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-4 items-center justify-end">
                        <MdModeEdit className="text-black cursor-pointer" size={20} />
                        <MdDelete className="text-red-600 cursor-pointer" size={20} />
                        <ToggleSwitch
                          onChange={() => handleToggle(product._id, product.isActive)}
                          checked={product.isActive || false}
                          className="focus:ring-0"
                        />
                      </div>
                    </td>
                  </tr>
                ))}

              {products === null && (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {products?.pages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={products.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
