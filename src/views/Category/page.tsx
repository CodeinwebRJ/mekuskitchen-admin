import { Button } from 'flowbite-react';
import { useState } from 'react';
import Category from './Category';
import ProductCategory from './ProductCategory';
import SubCategory from './SubCategory';

const Page = () => {
  const [activeView, setActiveView] = useState<'category' | 'subcategory' | 'productcategory'>(
    'category',
  );

  const handleViewChange = (view: 'category' | 'subcategory' | 'productcategory') => {
    setActiveView(view);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Categories</h2>

      <div className="flex items-center gap-2 mb-6">
        <Button
          onClick={() => handleViewChange('category')}
          size="md"
          color={activeView === 'category' ? 'blue' : 'gray'}
          className="rounded"
        >
          Category
        </Button>
        <Button
          onClick={() => handleViewChange('subcategory')}
          size="md"
          color={activeView === 'subcategory' ? 'blue' : 'gray'}
          className="rounded"
        >
          SubCategory
        </Button>
        <Button
          onClick={() => handleViewChange('productcategory')}
          size="md"
          color={activeView === 'productcategory' ? 'blue' : 'gray'}
          className="rounded"
        >
          Product Category
        </Button>
      </div>

      {activeView === 'category' && <Category />}
      {activeView === 'subcategory' && <SubCategory />}
      {activeView === 'productcategory' && <ProductCategory />}
    </div>
  );
};

export default Page;
