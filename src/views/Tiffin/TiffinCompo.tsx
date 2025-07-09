import { Label, TextInput, ToggleSwitch } from 'flowbite-react';
import { Fragment, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Loading from 'src/components/Loading';
import NoDataFound from 'src/components/NoDataFound';
import { setIsActive } from 'src/Store/Slices/FilterData';
import { RootState } from 'src/Store/Store';

const TiffinCompo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products: tiffins, loading } = useSelector((state: RootState) => state.product);
  const { search, isActive } = useSelector((state: RootState) => state.filterData);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-3 text-primary">Tiffins</h1>

      <form className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-3">
        <div className="w-full lg:w-1/3">
          <TextInput value={search} placeholder="Search" className="w-full" />
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
              <th className="px-4 py-3 max-w-xs">Day</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            ) : tiffins?.data?.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  <NoDataFound />
                </td>
              </tr>
            ) : (
              tiffins?.data?.map((tiffin: any, index: number) => {
                const isExpanded = expandedIndex === index;
                const totalStock = tiffin?.sku?.reduce((skuAcc: number, skuItem: any) => {
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
                  <Fragment key={tiffin._id}>
                    <tr
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => toggleExpand(index)}
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        <img
                          src={tiffin?.images?.[0]?.url || '/default-product.jpg'}
                          alt={tiffin?.name}
                          className="w-14 h-14 object-cover rounded"
                        />
                      </td>
                      <td
                        className="px-4 py-3 max-w-xs truncate whitespace-nowrap overflow-hidden"
                        title={tiffin?.name}
                      >
                        {tiffin?.name?.toUpperCase()}
                      </td>
                      <td className="px-4 py-3">${tiffin?.price?.toFixed(2)}</td>
                      <td className="px-4 py-3">{totalStock}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col text-sm gap-1">
                          {tiffin?.category && <span>Category: {tiffin.category}</span>}
                          {tiffin?.subCategory && <span>SubCategory: {tiffin.subCategory}</span>}
                          {tiffin?.ProductCategory && (
                            <span>ProductCategory: {tiffin.ProductCategory}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">{tiffin.brand || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-4 items-center justify-end">
                          <div onClick={(e) => e.stopPropagation()}>
                            <MdModeEdit
                              className="text-black cursor-pointer"
                              size={20}
                              onClick={() =>
                                navigate('/create-variations-product', {
                                  state: { id: tiffin._id },
                                })
                              }
                            />
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <MdDelete className="text-red-600 cursor-pointer" size={20} />
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            {/* <ToggleSwitch className="focus:ring-0" /> */}
                          </div>
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
                                {tiffin.sku.map((skuItem: any, idx: number) => {
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
    </div>
  );
};

export default TiffinCompo;
