import { Label, Select, TextInput, Button } from 'flowbite-react';
import { useCallback, useState, useMemo } from 'react';
import { BasicInfoProps } from '../interface';
import { MdDelete } from 'react-icons/md';

const ProductDetail: React.FC<BasicInfoProps> = ({ errors, product, setProduct, setErrors }) => {
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [aboutItem, setAboutItem] = useState<string>('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;

      // if (['length', 'width', 'height'].includes(id)) {
      //   if (parseFloat(value) < 0) {
      //     // setErrors('Dimensions cannot be negative');
      //     return;
      //   }
      // }

      if (['length', 'width', 'height', 'dimensionUnit'].includes(id)) {
        setProduct((prev: any) => ({
          ...prev,
          dimensions: {
            ...prev.dimensions,
            [id]: value,
          },
        }));
      } else {
        setProduct((prev: any) => ({
          ...prev,
          [id]: value,
        }));
      }
    },
    [setProduct],
  );

  const addFeature = useCallback(() => {
    const trimmedFeature = newFeature.trim();
    if (trimmedFeature === '') {
      setErrors((prev: any) => ({ ...prev, feature: 'Please enter a valid feature' }));
      return;
    }
    if (product.features.includes(trimmedFeature)) {
      setErrors((prev: any) => ({ ...prev, feature: 'Feature already added' }));
      return;
    }

    setProduct((prev: any) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature('');
  }, [newFeature]);

  const removeFeature = useCallback(
    (index: number) => {
      setProduct((prev: any) => ({
        ...prev,
        features: prev.features.filter((_: any, i: number) => i !== index),
      }));
    },
    [setProduct],
  );

  const addAboutItem = useCallback(() => {
    const trimmedAboutItem = aboutItem.trim();
    if (trimmedAboutItem === '') {
      setErrors((prev: any) => ({ ...prev, aboutItem: 'Please enter a valid AboutItem' }));
      return;
    }
    if (product.aboutItem.includes(trimmedAboutItem)) {
      setErrors((prev: any) => ({ ...prev, aboutItem: 'AboutItem already added' }));
      return;
    }

    setProduct((prev: any) => ({
      ...prev,
      aboutItem: [...prev.aboutItem, aboutItem.trim()],
    }));
    setAboutItem('');
  }, [aboutItem]);

  const removeAboutItem = useCallback((index: number) => {
    setProduct((prev: any) => ({
      ...prev,
      aboutItem: prev.aboutItem.filter((_: any, i: number) => i !== index),
    }));
  }, []);

  const addTag = useCallback(() => {
    const trimmedTag = newTag.trim();
    if (trimmedTag === '') {
      setErrors((prev: any) => ({ ...prev, tag: 'Please enter a valid Tag' }));
      return;
    }
    if (product.aboutItem.includes(trimmedTag)) {
      setErrors((prev: any) => ({ ...prev, tag: 'Tag already added' }));
      return;
    }

    setProduct((prev: any) => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()],
    }));
    setNewTag('');
  }, [newTag]);

  const removeTag = useCallback(
    (index: number) => {
      setProduct((prev: any) => ({
        ...prev,
        tags: prev.tags.filter((_: any, i: number) => i !== index),
      }));
    },
    [setProduct],
  );

  const addSpecification = useCallback(() => {
    const trimmedKey = specKey.trim();
    const trimmedValue = specValue.trim();

    if (!trimmedKey || !trimmedValue) {
      setErrors((prev: any) => ({
        ...prev,
        specification: 'Please enter a valid key and value.',
      }));
      return;
    }

    if (product.specifications[trimmedKey]) {
      setErrors((prev: any) => ({
        ...prev,
        specification: 'Specification key already exists',
      }));
      return;
    }

    setProduct((prev: any) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [trimmedKey]: trimmedValue,
      },
    }));
    setSpecKey('');
    setSpecValue('');
    setErrors((prev: any) => {
      const { specification, ...rest } = prev;
      return rest;
    });
  }, [specKey, specValue, product.specifications]);

  const removeSpecification = useCallback(
    (key: string) => {
      setProduct((prev: any) => {
        const newSpecs = { ...prev.specifications };
        delete newSpecs[key];
        return {
          ...prev,
          specifications: newSpecs,
        };
      });
    },
    [setProduct],
  );

  const weightUnits = useMemo(
    () => [
      { value: '', label: 'Select Unit' },
      { value: 'g', label: 'g' },
      { value: 'kg', label: 'kg' },
      { value: 'lb', label: 'lb' },
      { value: 'oz', label: 'oz' },
    ],
    [],
  );

  const dimensionUnits = useMemo(
    () => [
      { value: '', label: 'Select Unit' },
      { value: 'cm', label: 'cm' },
      { value: 'inch', label: 'inch' },
    ],
    [],
  );

  return (
    <div className="mx-auto p-4 sm:p-6 bg-white rounded-xl shadow space-y-6 sm:space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary">Product Information</h2>

      <form className="space-y-6 sm:space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Weight & Dimensions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <Label value="Weight Unit*" />
              <Select
                id="weightUnit"
                value={product.weightUnit}
                onChange={handleInputChange}
                className="w-full"
                required
                aria-required="true"
              >
                {weightUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </Select>
              {errors.weightUnit && <p className="text-red-500">{errors.weightUnit}</p>}
            </div>
            <div>
              <Label value="Weight*" />
              <TextInput
                id="weight"
                type="number"
                min="0"
                value={product.weight}
                onChange={handleInputChange}
                required
                placeholder="Enter weight"
                className="w-full"
                aria-required="true"
              />
              {errors.weight && <p className="text-red-500">{errors.weight}</p>}
            </div>
            <div>
              <Label value="Dimension Unit" />
              <Select
                id="dimensionUnit"
                value={product.dimensions.dimensionUnit}
                onChange={handleInputChange}
                className="w-full"
                required
                aria-required="true"
              >
                {dimensionUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4">
            <div>
              <Label value="Length" />
              <TextInput
                id="length"
                type="number"
                min="0"
                value={product.dimensions.length}
                onChange={handleInputChange}
                required
                placeholder="Enter length"
                className="w-full"
                aria-required="true"
              />
            </div>
            <div>
              <Label value="Width" />
              <TextInput
                id="width"
                type="number"
                min="0"
                value={product.dimensions.width}
                onChange={handleInputChange}
                required
                placeholder="Enter width"
                className="w-full"
                aria-required="true"
              />
            </div>
            <div>
              <Label value="Height" />
              <TextInput
                id="height"
                type="number"
                min="0"
                value={product.dimensions.height}
                onChange={handleInputChange}
                required
                placeholder="Enter height"
                className="w-full"
                aria-required="true"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Features & Specifications
          </h3>

          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-700 mb-2">Tags</h4>
            <div className="flex gap-4 mb-4">
              <div className="w-full">
                <TextInput
                  type="text"
                  value={newTag}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewTag(value);
                    if (errors.tag && value.trim() !== '') {
                      setErrors((prev: any) => ({ ...prev, tag: '' }));
                    }
                  }}
                  placeholder="Enter tag (e.g., Electronics)"
                  className="w-full"
                  aria-label="Add new tag"
                />
                {errors.tag && <span className="text-red-600">{errors.tag}</span>}
              </div>
              <div className="w-full">
                <Button color="primary" size="sm" type="button" onClick={addTag}>
                  Add Tag
                </Button>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2">
              {product.tags.map((tag: any, index: number) => (
                <li
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1"
                >
                  <span className="text-gray-800 text-sm">{tag}</span>
                  <Button
                    color="failure"
                    size="xs"
                    onClick={() => removeTag(index)}
                    aria-label={`Remove tag: ${tag}`}
                  >
                    <MdDelete />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 mt-4">
            <h4 className="text-lg font-medium text-gray-700">About Product</h4>
            <div className="flex gap-4 mb-4">
              <div className="w-full">
                <TextInput
                  type="text"
                  value={aboutItem}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAboutItem(value);
                    if (errors.aboutItem && value.trim() !== '') {
                      setErrors((prev: any) => ({ ...prev, aboutItem: '' }));
                    }
                  }}
                  placeholder="Enter feature (e.g., Waterproof)"
                  className="w-full"
                />
                {errors.aboutItem && <span className="text-red-600">{errors.aboutItem}</span>}
              </div>
              <div className="w-full">
                <Button color="primary" size="sm" type="button" onClick={addAboutItem}>
                  Add AboutItem
                </Button>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2">
              {product.aboutItem.map((feature: any, index: number) => (
                <li key={index} className="flex items-center gap-2 bg-gray-100 rounded-md p-2">
                  <span className="text-gray-800">{feature}</span>
                  <div
                    className="cursor-pointer"
                    onClick={() => removeAboutItem(index)}
                    aria-label={`Remove feature: ${feature}`}
                  >
                    <MdDelete size={20} className="text-red-600" />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-700 mb-2">Features</h4>
            <div className="flex gap-4  mb-4">
              <div className="w-full">
                <TextInput
                  type="text"
                  value={newFeature}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewFeature(value);
                    if (errors.feature && value.trim() !== '') {
                      setErrors((prev: any) => ({ ...prev, feature: '' }));
                    }
                  }}
                  placeholder="Enter feature (e.g., Waterproof)"
                  className="w-full"
                />
                {errors.feature && <span className="text-red-600">{errors.feature}</span>}
              </div>
              <div className="w-full">
                <Button color="primary" size="sm" type="button" onClick={addFeature}>
                  Add Feature
                </Button>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2">
              {product.features.map((feature: any, index: number) => (
                <li
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1"
                >
                  <span className="text-gray-800 text-sm">{feature}</span>
                  <Button color="failure" size="xs" onClick={() => removeFeature(index)}>
                    <MdDelete />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-medium text-gray-700 mb-2">Specifications</h4>
            <div className="flex w-full gap-4 items-start">
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <TextInput
                    type="text"
                    value={specKey}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSpecKey(value);
                      if (errors.specification && value.trim() !== '') {
                        setErrors((prev: any) => ({ ...prev, specification: '' }));
                      }
                    }}
                    placeholder="Specification Key (e.g., Material)"
                    color={errors.specKey ? 'failure' : ''}
                    className="w-full"
                  />
                  <TextInput
                    type="text"
                    value={specValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSpecValue(value);
                      if (errors.specification && value.trim() !== '') {
                        setErrors((prev: any) => ({ ...prev, specification: '' }));
                      }
                    }}
                    placeholder="Specification Value (e.g., Aluminum)"
                    color={errors.specValue ? 'failure' : ''}
                    className="w-full"
                  />
                </div>
                {errors.specKey && <span className="text-red-600">{errors.specKey}</span>}
                {errors.specValue && <span className="text-red-600">{errors.specValue}</span>}
                {errors.specification && (
                  <span className="text-red-600">{errors.specification}</span>
                )}
              </div>

              <div className="flex justify-start md:justify-end">
                <Button color="primary" size="sm" onClick={addSpecification}>
                  Add Specification
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(product.specifications) as [string, string][]).map(
                ([key, value]) => (
                  <div key={key} className="flex gap-2 items-center border rounded-md px-2 py-1">
                    <span className="text-sm text-gray-800">
                      <strong>{key}:</strong> {value}
                    </span>
                    <div className="cursor-pointer" onClick={() => removeSpecification(key)}>
                      <MdDelete className="text-red-600" />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductDetail;
