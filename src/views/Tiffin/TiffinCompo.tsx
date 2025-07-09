import { Label, TextInput, ToggleSwitch } from 'flowbite-react';
import { Fragment, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { RootState } from 'src/Store/Store';
import { format } from 'date-fns';
import DeleteDialog from 'src/components/DeleteDialog';
import { deleteTiffin, getAllTiffin } from 'src/AxiosConfig/AxiosConfig';
import { setTiffin } from 'src/Store/Slices/Tiffin';

const TiffinCompo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.tiffin);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTiffinId, setSelectedTiffinId] = useState<string | null>(null);

  const fetchAllTiffin = async () => {
    try {
      const data = { day: '', Active: '', search: '' };
      const res = await getAllTiffin(data);
      dispatch(setTiffin(res?.data?.data));
    } catch (error) {
      console.error('Error fetching tiffins:', error);
    }
  };

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
      setIsDeleteDialogOpen(false);
      setSelectedTiffinId(null);
      await fetchAllTiffin();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-3 text-primary">Tiffins</h1>

      <form className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-3">
        <div className="w-full lg:w-1/3">
          <TextInput placeholder="Search" className="w-full" />
        </div>
        <div className="px-4">
          <div className="flex gap-2 items-center">
            <Label>Active</Label>
            <ToggleSwitch checked={true} onChange={() => {}} />
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
              <th className="px-4 py-3">End Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
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

                      <td className="px-4 py-3">
                        <div className="flex gap-4 items-center justify-center">
                          <div onClick={(e) => e.stopPropagation()}>
                            <MdModeEdit
                              className="text-black cursor-pointer"
                              size={20}
                              onClick={() =>
                                navigate('/create-tiffin', { state: { id: tiffin._id } })
                              }
                            />
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <MdDelete
                              onClick={() => handleOpenDelete(tiffin._id)}
                              className="text-red-600 cursor-pointer"
                              size={20}
                            />
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <ToggleSwitch checked={tiffin.Active} onChange={() => {}} />
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
                                      <th className="px-3 py-2">Unit</th>
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
                                          {item.quantityUnit.toUpperCase()}
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
              })}
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
