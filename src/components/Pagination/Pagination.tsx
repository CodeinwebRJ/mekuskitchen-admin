import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Define the props interface
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePrev = (): void => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (): void => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 my-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
      >
        <FaArrowLeft />
      </button>

      {pageNumbers.map((number ,i) => (
        <button
          key={i}
          onClick={() => onPageChange(number)}
          className={`p-2 px-3 rounded-md ${
            Number(currentPage) === number
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          } transition-colors`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
