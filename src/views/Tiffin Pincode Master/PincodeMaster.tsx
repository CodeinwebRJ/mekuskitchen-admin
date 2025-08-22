import { Button, TextInput, ToggleSwitch } from 'flowbite-react';
import { useState, useCallback, FormEvent, useMemo, useEffect } from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreatePincode,
  DeletePincode,
  UpdatePincode,
  getPincodeList,
  PincodeType,
} from 'src/AxiosConfig/AxiosConfig';
import DeleteDialog from 'src/components/DeleteDialog';
import Loading from 'src/components/Loading';
import NoDataFound from 'src/components/NoDataFound';
import { setPincodeList, setSearchPincode } from 'src/Store/Slices/Pincode';
import { RootState } from 'src/Store/Store';
import { Toast } from 'src/components/Toast';

const PincodeMaster = () => {
  const { pincodeList, loading, pincodeSearch } = useSelector(
    (state: RootState) => state.pincode
  );

  const [pincodeInput, setPincodeInput] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ create?: string; edit?: string; delete?: string }>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState<PincodeType | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPincodes = async () => {
      try {
        const data = await getPincodeList(pincodeSearch);
        dispatch(setPincodeList(data));
      } catch (err) {
        console.error('Failed to fetch pincodes:', err);
      }
    };
    fetchPincodes();
  }, [dispatch, pincodeSearch]);

  const setLoading = (key: string, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpenDelete = useCallback((pincode: PincodeType) => {
    setSelectedPincode(pincode);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedPincode(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedPincode) return;
    setLoading(`delete-${selectedPincode._id}`, true);
    setError({});
    try {
      await DeletePincode({ pincodeId: selectedPincode._id });
      dispatch(setPincodeList(pincodeList.filter((p) => p._id !== selectedPincode._id)));
      setIsDeleteDialogOpen(false);
      setSelectedPincode(null);
      Toast({ message: 'Pincode deleted successfully', type: 'success' });
    } catch (error: any) {
      console.error('Failed to delete pincode:', error);
      setError((prev) => ({ ...prev, delete: 'Failed to delete pincode.' }));
    } finally {
      setLoading(`delete-${selectedPincode._id}`, false);
    }
  }, [selectedPincode, pincodeList, dispatch]);

  const validatePincode = (val: string): string | null => {
    if (!val || val.trim() === '') return 'This field cannot be empty.';
    if (!/^\d{6}$/.test(val.trim())) return 'Enter valid 6-digit pincode.';
    return null;
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const trimmed = pincodeInput.trim();
      const validationError = validatePincode(trimmed);

      if (validationError) {
        setError((prev) => ({ ...prev, create: validationError }));
        return;
      }

      setLoading('create', true);
      setError({});
      try {
        const newPin = await CreatePincode({ code: trimmed });
        dispatch(setPincodeList([...pincodeList, newPin]));
        setPincodeInput('');
        setShowForm(false);
        Toast({ message: 'Pincode created successfully!', type: 'success' });
      } catch (error: any) {
        setError((prev) => ({
          ...prev,
          create: error?.response?.data?.errorData || 'Failed to create pincode.',
        }));
      } finally {
        setLoading('create', false);
      }
    },
    [pincodeInput, pincodeList, dispatch],
  );

  const handleToggle = useCallback(
    async (pincode: PincodeType) => {
      setLoading(`toggle-${pincode._id}`, true);
      try {
        const updated = await UpdatePincode({
          pincodeId: pincode._id,
          isActive: !pincode.isActive,
        });
        dispatch(
          setPincodeList(
            pincodeList.map((p) => (p._id === pincode._id ? updated : p)),
          ),
        );
      } catch (error) {
        console.error('Failed to toggle pincode:', error);
      } finally {
        setLoading(`toggle-${pincode._id}`, false);
      }
    },
    [pincodeList, dispatch],
  );

  const handleEditStart = useCallback((id: string, val: string) => {
    setEditId(id);
    setEditValue(val);
    setError({});
  }, []);

  const handleEditSubmit = useCallback(
    async (e: FormEvent, pincode: PincodeType) => {
      e.preventDefault();
      const trimmed = editValue.trim();
      const validationError = validatePincode(trimmed);

      if (validationError) {
        setError((prev) => ({ ...prev, edit: validationError }));
        return;
      }
      if (trimmed === pincode.code) {
        setEditId(null);
        return;
      }

      setLoading(`edit-${pincode._id}`, true);
      try {
        const updated = await UpdatePincode({
          pincodeId: pincode._id,
          code: trimmed,
        });
        dispatch(
          setPincodeList(
            pincodeList.map((p) => (p._id === pincode._id ? updated : p)),
          ),
        );
        setEditId(null);
        setEditValue('');
        Toast({ message: 'Pincode updated successfully!', type: 'success' });
      } catch (error) {
        setError((prev) => ({ ...prev, edit: 'Failed to update pincode.' }));
      } finally {
        setLoading(`edit-${pincode._id}`, false);
      }
    },
    [editValue, pincodeList, dispatch],
  );

  const handleEditCancel = useCallback(() => {
    setEditId(null);
    setEditValue('');
    setError({});
  }, []);

  const pincodeListRender = useMemo(
    () =>
      pincodeList.map((p: PincodeType) => (
        <li key={p._id} className="flex justify-between p-4">
          {editId === p._id ? (
            <form
              onSubmit={(e) => handleEditSubmit(e, p)}
              className="flex items-center gap-2 w-full"
            >
              <TextInput
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Edit pincode"
                disabled={loadingStates[`edit-${p._id}`]}
              />
              {error.edit && <div className="text-red-500 text-sm">{error.edit}</div>}
              <Button color="primary" type="submit" size="sm">
                Save
              </Button>
              <Button color="gray" size="sm" onClick={handleEditCancel}>
                Cancel
              </Button>
            </form>
          ) : (
            <>
              <span className="text-gray-600 font-semibold flex-1">{p.code}</span>
              <div className="flex items-center gap-4">
                <MdModeEdit
                  className="text-black cursor-pointer"
                  size={18}
                  onClick={() => handleEditStart(p._id, p.code)}
                />
                <MdDelete
                  className="text-red-600 cursor-pointer"
                  size={18}
                  onClick={() => handleOpenDelete(p)}
                />
                <ToggleSwitch
                  checked={p.isActive}
                  onChange={() => handleToggle(p)}
                  className="focus:ring-0"
                />
              </div>
            </>
          )}
        </li>
      )),
    [pincodeList, editId, editValue, handleEditStart, handleEditSubmit, handleEditCancel],
  );

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Pincode Master</h2>
            <Button
              color="primary"
              size="sm"
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto"
            >
              {showForm ? 'Cancel' : 'Create New Pincode'}
            </Button>
          </div>
          <TextInput
            className="w-full sm:w-1/3"
            placeholder="Search Pincode"
            value={pincodeSearch}
            onChange={(e) => dispatch(setSearchPincode(e.target.value))}
          />
        </div>
        {loading ? (
          <Loading />
        ) : showForm ? (
          <form
            onSubmit={handleSubmit}
            className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 flex flex-col mb-4 gap-5 bg-white shadow-md rounded-lg p-4 sm:p-6"
          >
            <h2 className="text-lg font-semibold text-gray-700">Create Pincode</h2>
            <TextInput
              value={pincodeInput}
              onChange={(e) => setPincodeInput(e.target.value)}
              placeholder="Enter 6-digit pincode"
            />
            {error.create && <div className="text-red-600">{error.create}</div>}
            <Button color="primary" type="submit" size="sm">
              Create
            </Button>
          </form>
        ) : pincodeList.length === 0 ? (
          <div className="bg-white rounded-md">
            <NoDataFound />
          </div>
        ) : (
          <ul className="bg-white shadow-md rounded-md divide-y">{pincodeListRender}</ul>
        )}
      </div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onCancel={handleCancelDelete}
        onDelete={confirmDelete}
        message={`Are you sure you want to delete this pincode?`}
      />
    </div>
  );
};

export default PincodeMaster;
