import { TextInput, ToggleSwitch } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import Pagination from 'src/components/Pagination/Pagination';
import { setPage } from 'src/Store/Slices/FilterData';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { Toast } from 'src/components/Toast';
import DeleteDialog from 'src/components/DeleteDialog';
import Loading from 'src/components/Loading';
import NoDataFound from 'src/components/NoDataFound';
import { useNavigate } from 'react-router';
import {
  setItems,
  setLoading,
  updateItemStatus,
  deleteItemFromState,
} from 'src/Store/Slices/ItemMasterData';
import { getAllTiffinItems, changeItemStatus, deleteTiffinItem } from 'src/AxiosConfig/AxiosConfig';
import { RootState, AppDispatch } from 'src/Store/Store';

const ManageItemMaster = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state: RootState) => state.itemMaster);

  const [search, setSearch] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive">("active");

const fetchItems = async () => {
  try {
    dispatch(setLoading(true));
    const params: any = { search };

    params.status = statusFilter === "active";

    const res = await getAllTiffinItems(params);
    dispatch(setItems(res?.data?.data || []));
  } catch (error) {
    console.error(error);
    Toast({ message: 'Failed to fetch items', type: 'error' });
  } finally {
    dispatch(setLoading(false));
  }
};

useEffect(() => {
  fetchItems();
}, [search, statusFilter]);

  const handleToggle = async (itemId: string, currentStatus: boolean) => {
    try {
      await changeItemStatus(itemId, !currentStatus);
      dispatch(updateItemStatus({ id: itemId, status: !currentStatus }));
      Toast({ message: 'Status updated successfully', type: 'success' });
    } catch (error) {
      console.error(error);
      Toast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleOpenDelete = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setSelectedItemId(null);
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedItemId) return;
    try {
      await deleteTiffinItem(selectedItemId);
      dispatch(deleteItemFromState(selectedItemId));
      setSelectedItemId(null);
      setIsDeleteDialogOpen(false);
      Toast({ message: 'Item deleted successfully', type: 'success' });
    } catch (error) {
      console.error(error);
      Toast({ message: 'Failed to delete item', type: 'error' });
    }
  };

const handlePageChange = useCallback(
    (pageNumber: number) => {
      dispatch(setPage(pageNumber));
    },
    [dispatch],
  );

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-3 text-primary">Manage Item Master</h1>
     
{/* Search and Active Toggle */}
<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-3">
  <div className="w-full lg:w-1/3">
    <TextInput
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search items..."
      className="w-full"
    />
  </div>

  <div className="flex justify-end">
    <ToggleSwitch
      checked={statusFilter === "active"}
      label={statusFilter === "active" ? "Active" : "Inactive"} 
      onChange={(checked) => setStatusFilter(checked ? "active" : "inactive")} 
      className="focus:ring-0"
    />
  </div>
</div>

      <div className="overflow-x-auto">
        <table className="min-w-full rounded-md text-sm text-left text-gray-800 border border-gray-200">
          <thead className="text-xs uppercase bg-white text-blue-800">
            <tr>
              <th className="px-4 py-3">Index</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            ) : items?.length > 0 ? (
              items.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.weight}</td>
                  <td className="px-4 py-3">{item.weightUnit}</td>
                  <td className="px-4 py-3">${item.price}</td>
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4 items-center justify-end">
                      <MdModeEdit
                        className="text-black cursor-pointer"
                        size={20}
                        onClick={() =>
                          navigate('/create-tiffin-item-master', { state: { id: item._id } })
                        }
                      />
                      <MdDelete
                        className="text-red-600 cursor-pointer"
                        size={20}
                        onClick={() => handleOpenDelete(item._id)}
                      />
                      <ToggleSwitch
                        onChange={() => handleToggle(item._id, item.status)}
                        checked={item.status || false}
                        className="focus:ring-0"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <NoDataFound />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination placeholder */}
      <div className="mt-6">
        <Pagination currentPage={1} totalPages={1} onPageChange={handlePageChange} />
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onCancel={handleCancelDelete}
        onDelete={handleDelete}
        message="Are you sure you want to delete this item?"
      />
    </div>
  );
};

export default ManageItemMaster;
