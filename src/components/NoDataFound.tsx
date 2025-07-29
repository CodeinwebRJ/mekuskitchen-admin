import { AiOutlineFileSearch } from 'react-icons/ai';

const NoDataFound = ({ message = 'No data found!' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <AiOutlineFileSearch className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700">{message}</h2>
      {/* <p className="text-gray-500 mt-2 text-sm md:text-base">
        Please try again later or adjust your filters.
      </p> */}
    </div>
  );
};

export default NoDataFound;
