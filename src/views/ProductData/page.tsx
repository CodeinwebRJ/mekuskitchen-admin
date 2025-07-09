import { Label, TextInput, ToggleSwitch } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import Pagination from 'src/components/Pagination/Pagination';
import { setIsActive, setPage, setSearch, setVariation } from 'src/Store/Slices/FilterData';
import { MdModeEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { DeleteProduct, EditProduct } from 'src/AxiosConfig/AxiosConfig';
import { updateProductStatus } from 'src/Store/Slices/ProductData';
import Loading from 'src/components/Loading';
import NoDataFound from 'src/components/NoDataFound';
import { useNavigate } from 'react-router';
import DeleteDialog from 'src/components/DeleteDialog';

interface RootState {
  product: any;
  filterData: any;
}

const Page = () => {
  const { products, loading } = useSelector((state: RootState) => state.product);
  const { search, isActive } = useSelector((state: RootState) => state.filterData);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      dispatch(setPage(pageNumber));
    },
    [dispatch],
  );

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

  const handleOpenDelete = (productId: string) => {
    setSelectedProductId(productId);
    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductId(null);
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;

    try {
      await DeleteProduct(selectedProductId);
      setIsDeleteDialogOpen(false);
      setSelectedProductId(null);
      dispatch(setPage(1));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const fetchdata = () => {
    try {
      if (location.pathname === '/') {
        dispatch(setVariation('product'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, [location.pathname]);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-3 text-primary">Products</h1>
      <form className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-3">
        <div className="w-full lg:w-1/3">
          <TextInput
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search"
            className="w-full"
          />
        </div>
        <div className="px-4">
          <div className="flex gap-2">
            <Label>Active</Label>
            <ToggleSwitch onChange={() => dispatch(setIsActive(!isActive))} checked={isActive} />
          </div>
        </div>
      </form>

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
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            ) : (
              products?.data?.length > 0 &&
              products?.data?.map((product: any, index: number) => (
                <tr key={product?._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{(products?.page - 1) * 10 + index + 1}</td>
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
                      <MdModeEdit
                        className="text-black cursor-pointer"
                        size={20}
                        onClick={() => navigate('/create-product', { state: { id: product._id } })}
                      />
                      <MdDelete
                        className="text-red-600 cursor-pointer"
                        size={20}
                        onClick={() => handleOpenDelete(product._id)}
                      />
                      <ToggleSwitch
                        onChange={() => handleToggle(product._id, product.isActive)}
                        checked={product.isActive || false}
                        className="focus:ring-0"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}

            {products === null ||
              (products?.data?.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <NoDataFound />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {products?.pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={products?.page || 1}
            totalPages={products.pages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onCancel={handleCancelDelete}
        onDelete={handleDelete}
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default Page;
