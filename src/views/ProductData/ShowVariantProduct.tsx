import { Fragment, useCallback, useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Label, Pagination, TextInput, ToggleSwitch } from 'flowbite-react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setIsActive, setPage, setSearch, setVariation } from 'src/Store/Slices/FilterData';
import NoDataFound from 'src/components/NoDataFound';
import { RootState } from 'src/Store/Store';
import Loading from 'src/components/Loading';
import { EditProduct } from 'src/AxiosConfig/AxiosConfig';
import { updateProductStatus } from 'src/Store/Slices/ProductData';

const ShowVariantProduct = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const fetchdata = () => {
    try {
      if (location.pathname === '/variations-product') {
        dispatch(setVariation('sku'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, [location.pathname]);

  const { products, loading } = useSelector((state: RootState) => state.product);
  const { search, isActive } = useSelector((state: RootState) => state.filterData);

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

  return (
    <div className="mx-auto">
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

      <div className="overflow-x-auto bg-white rounded-md shadow-md">
        <table className="min-w-full text-sm text-left text-gray-800 border border-gray-200">
          <thead className="text-xs uppercase bg-gray-50 text-primary">
            <tr>
              <th className="px-4 py-3">Index</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3 max-w-xs">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Categories</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Actions</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Loading />
            ) : products?.data?.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  <NoDataFound />
                </td>
              </tr>
            ) : (
              products?.data?.map((product: any, index: number) => {
                const isExpanded = expandedIndex === index;

                // Calculate total stock from all SKUs
                const totalStock = product?.sku?.reduce((skuAcc: number, skuItem: any) => {
                  const combinations = skuItem?.details?.combinations || [];
                  return (
                    skuAcc +
                    combinations.reduce(
                      (combAcc: number, comb: any) => combAcc + (comb?.Stock || 0),
                      0,
                    )
                  );
                }, 0);

                return (
                  <Fragment key={product._id}>
                    <tr
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => toggleExpand(index)}
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        <img
                          src={product?.images?.[0]?.url || '/default-product.jpg'}
                          alt={product?.name}
                          className="w-14 h-14 object-cover rounded"
                        />
                      </td>
                      <td
                        className="px-4 py-3 max-w-xs truncate whitespace-nowrap overflow-hidden"
                        title={product?.name}
                      >
                        {product?.name?.toUpperCase()}
                      </td>
                      <td className="px-4 py-3">${product?.price?.toFixed(2)}</td>
                      <td className="px-4 py-3">{totalStock}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col text-sm gap-1">
                          {product?.category && <span>Category: {product.category}</span>}
                          {product?.subCategory && <span>SubCategory: {product.subCategory}</span>}
                          {product?.ProductCategory && (
                            <span>ProductCategory: {product.ProductCategory}</span>
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
                      <td className="px-4 py-3">
                        {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={9} className="p-0 border-0">
                          <div className="bg-white px-4 py-3 border border-t-0 border-gray-200">
                            <table className="min-w-full text-sm text-left text-gray-700">
                              <thead className="text-primary text-xs uppercase">
                                <tr>
                                  <th className="px-3 py-2">Image</th>
                                  <th className="px-3 py-2">Name</th>
                                  <th className="px-3 py-2">SKU Name</th>
                                  <th className="px-3 py-2">Stock</th>
                                  <th className="px-3 py-2">Price</th>
                                  <th className="px-3 py-2">Combinations</th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.sku.map((skuItem: any, idx: number) => {
                                  const combinationStock = skuItem.details.combinations?.reduce(
                                    (acc: number, comb: any) => acc + (comb?.Stock || 0),
                                    0,
                                  );

                                  return (
                                    <tr key={skuItem._id || idx} className="hover:bg-gray-50">
                                      <td className="px-3 py-2">
                                        <img
                                          src={
                                            skuItem.details.SKUImages?.[0] || '/default-product.jpg'
                                          }
                                          alt={skuItem.details.Name}
                                          className="w-12 h-12 object-cover rounded"
                                        />
                                      </td>
                                      <td
                                        className="px-3 py-2 max-w-xs truncate"
                                        title={skuItem.details.Name}
                                      >
                                        {skuItem.details.Name}
                                      </td>
                                      <td className="px-3 py-2">{skuItem.details.SKUname}</td>
                                      <td className="px-3 py-2">{combinationStock}</td>
                                      <td className="px-3 py-2">
                                        ${skuItem.details.Price.toFixed(2)}
                                      </td>
                                      <td className="px-3 py-2">
                                        {skuItem.details.combinations?.length > 0 ? (
                                          skuItem.details.combinations.map(
                                            (comb: any, i: number) => (
                                              <div key={i} className="mb-1">
                                                {Object.entries(comb).map(([key, value]) => (
                                                  <span
                                                    key={key}
                                                    className="mr-2 text-xs px-2 py-1 rounded bg-gray-100"
                                                  >
                                                    {key}: {String(value)}
                                                  </span>
                                                ))}
                                              </div>
                                            ),
                                          )
                                        ) : (
                                          <span>-</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
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
    </div>
  );
};

export default ShowVariantProduct;
