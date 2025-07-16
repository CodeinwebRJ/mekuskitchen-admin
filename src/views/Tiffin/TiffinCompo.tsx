import { Label, TextInput, ToggleSwitch } from 'flowbite-react';
import { Fragment, useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { RootState } from 'src/Store/Store';
import { format } from 'date-fns';
import DeleteDialog from 'src/components/DeleteDialog';
import { deleteTiffin, getAllTiffin, updateTiffin } from 'src/AxiosConfig/AxiosConfig';
import { setTiffin } from 'src/Store/Slices/Tiffin';
import useDebounce from 'src/Hook/useDebounce';
import Loading from 'src/components/Loading';
import { Toast } from 'src/components/Toast';

const TiffinCompo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.tiffin);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTiffinId, setSelectedTiffinId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(true);
  const [loading, setLoading] = useState(false);

  const debounceSearch = useDebounce(search, 500);

  const fetchAllTiffin = async () => {
    try {
      setLoading(true);
      const res = await getAllTiffin({
        day: '',
        Active: activeOnly.toString(),
        search: debounceSearch,
      });
      dispatch(setTiffin(res?.data?.data));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tiffins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTiffin();
  }, [debounceSearch, activeOnly]);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleOpenDelete = (tiffinId: string) => {
    setSelectedTiffinId(tiffinId);
    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedTiffinId(null);
  };

  const handleDelete = async () => {
    if (!selectedTiffinId) return;
    try {
      await deleteTiffin(selectedTiffinId);
      handleCancelDelete();
      await fetchAllTiffin();
      Toast({ message: 'Tiffin deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting tiffin:', error);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateTiffin(id, { Active: currentStatus });
      await fetchAllTiffin();
    } catch (error) {
      console.error('Error toggling tiffin active status:', error);
    }
  };

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-3 text-primary">Tiffins</h1>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-3">
        <div className="w-full lg:w-1/3">
          <TextInput
            placeholder="Search"
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="px-4">
          <div className="flex gap-2 items-center">
            <Label>{activeOnly ? "Active" : "Inactive"}</Label>
            <ToggleSwitch checked={activeOnly} onChange={setActiveOnly} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-md shadow-md">
        <table className="min-w-full text-sm text-left text-gray-800 border border-gray-200">
          <thead className="text-xs uppercase bg-gray-50 text-blue-800">
            <tr>
              <th className="px-4 py-3">Index</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Tiffin Day</th>
              <th className="px-4 py-3">Tiffin Date</th>
              <th className="px-4 py-3">Bookin End Date</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-center">Actions</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            ) : (
              Array.isArray(data) &&
              data.map((tiffin: any, index: number) => {
                const isExpanded = expandedIndex === index;
                return (
                  <Fragment key={tiffin._id}>
                    <tr
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => toggleExpand(index)}
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        <img
                          src={tiffin?.image_url?.[0]?.url || '/default-product.jpg'}
                          alt={tiffin?.day}
                          className="w-14 h-14 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate">{tiffin?.name}</td>
                      <td className="px-4 py-3 max-w-xs truncate">{tiffin?.day?.toUpperCase()}</td>
                      <td className="px-4 py-3">
                        {tiffin.date && !isNaN(new Date(tiffin.date).getTime())
                          ? format(new Date(tiffin.date), 'dd/MM/yyyy')
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {tiffin.endDate && !isNaN(new Date(tiffin.endDate).getTime())
                          ? format(new Date(tiffin.endDate), 'dd/MM/yyyy')
                          : '—'}
                      </td>
                      <td className="px-4 py-3">${tiffin.totalAmount}</td>
                      <td className="px-4 py-3">
                        <div
                          className="flex gap-4 items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MdModeEdit
                            className="text-black cursor-pointer"
                            size={20}
                            onClick={() =>
                              navigate('/create-tiffin', { state: { id: tiffin._id } })
                            }
                          />
                          <MdDelete
                            onClick={() => handleOpenDelete(tiffin._id)}
                            className="text-red-600 cursor-pointer"
                            size={20}
                          />
                          <ToggleSwitch
                            checked={tiffin?.Active}
                            onChange={(checked) => handleToggleActive(tiffin._id, checked)}
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
                          <div className="bg-white px-4 py-3 border border-t-0 border-gray-200 space-y-6">
                            {tiffin.items?.length > 0 && (
                              <div>
                                <table className="min-w-full text-sm text-left text-gray-700">
                                  <thead className="text-primary text-xs uppercase">
                                    <tr>
                                      <th className="px-3 py-2">Index</th>
                                      <th className="px-3 py-2">Name</th>
                                      <th className="px-3 py-2">Price</th>
                                      <th className="px-3 py-2">Quantity</th>
                                      <th className="px-3 py-2">Weight</th>
                                      <th className="px-3 py-2">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {tiffin.items.map((item: any, i: number) => (
                                      <tr key={item._id || i} className="hover:bg-gray-50">
                                        <td className="px-3 py-2">{i + 1}</td>
                                        <td className="px-3 py-2">{item.name}</td>
                                        <td className="px-3 py-2">${item.price}</td>
                                        <td className="px-3 py-2">{item.quantity}</td>
                                        <td className="px-3 py-2">
                                          {item.weight} {item.weightUnit?.toUpperCase()}
                                        </td>
                                        <td className="px-3 py-2 line-clamp-2 max-w-xs overflow-hidden">
                                          {item.description}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
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

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onCancel={handleCancelDelete}
        onDelete={handleDelete}
        message="Are you sure you want to delete this Tiffin?"
      />
    </div>
  );
};

export default TiffinCompo;
