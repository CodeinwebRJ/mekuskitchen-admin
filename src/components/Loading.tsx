import { Spinner } from 'flowbite-react';

const Loading = () => {
  return (
    <div className="w-full h-[50vh] flex items-center justify-center">
      <Spinner size="xl" />
    </div>
  );
};
export default Loading;
