import { Label, Select, TextInput, Button, Alert } from 'flowbite-react';
import { useCallback, useState, useMemo } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { BasicInfoProps } from '../interface';

const ProductDetail: React.FC<BasicInfoProps> = ({ product, setProduct }) => {
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Validate inputs before adding
  const validateInput = useCallback((value: string, field: string): boolean => {
    if (!value.trim()) {
      setError(`Please enter a valid ${field}`);
      return false;
    }
    if (value.length > 100) {
      setError(`${field} cannot exceed 100 characters`);
      return false;
    }
    return true;
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
      setError(null);

      if (['length', 'width', 'height'].includes(id)) {
        if (parseFloat(value) < 0) {
          setError('Dimensions cannot be negative');
          return;
        }
      }

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
    if (!validateInput(newFeature, 'feature')) return;

    setProduct((prev: any) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature('');
    setError(null);
  }, [newFeature, validateInput]);

  const removeFeature = useCallback(
    (index: number) => {
      setProduct((prev: any) => ({
        ...prev,
        features: prev.features.filter((_: any, i: number) => i !== index),
      }));
    },
    [setProduct],
  );

  const addTag = useCallback(() => {
    if (!validateInput(newTag, 'tag')) return;

    setProduct((prev: any) => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()],
    }));
    setNewTag('');
    setError(null);
  }, [newTag, validateInput]);

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
    if (
      !validateInput(specKey, 'specification key') ||
      !validateInput(specValue, 'specification value')
    )
      return;

    if (product.specifications[specKey.trim()]) {
      setError('Specification key already exists');
      return;
    }

    setProduct((prev: any) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specKey.trim()]: specValue.trim(),
      },
    }));
    setSpecKey('');
    setSpecValue('');
    setError(null);
  }, [specKey, specValue, product.specifications, validateInput]);

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
    <div className="mx-auto p-6 bg-white rounded-xl shadow space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Product Information</h2>
      {error && (
        <Alert color="failure" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Weight & Dimensions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>
            <div>
              <Label value="Weight*" />
              <TextInput
                id="weight"
                type="number"
                min="0"
                step="0.01"
                value={product.weight}
                onChange={handleInputChange}
                required
                placeholder="Enter weight"
                className="w-full"
                aria-required="true"
              />
            </div>
            <div>
              <Label value="Dimension Unit*" />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <Label value="Length*" />
              <TextInput
                id="length"
                type="number"
                min="0"
                step="0.01"
                value={product.dimensions.length}
                onChange={handleInputChange}
                required
                placeholder="Enter length"
                className="w-full"
                aria-required="true"
              />
            </div>
            <div>
              <Label value="Width*" />
              <TextInput
                id="width"
                type="number"
                min="0"
                step="0.01"
                value={product.dimensions.width}
                onChange={handleInputChange}
                required
                placeholder="Enter width"
                className="w-full"
                aria-required="true"
              />
            </div>
            <div>
              <Label value="Height*" />
              <TextInput
                id="height"
                type="number"
                min="0"
                step="0.01"
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Features & Specifications</h3>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Tags</h4>
            <div className="flex gap-4 items-center mb-4">
              <TextInput
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter tag (e.g., Electronics)"
                className="w-full"
                maxLength={100}
                aria-label="Add new tag"
              />
              <div className="w-full">
                <Button size="xs" type="button" onClick={addTag}>
                  Add Tag
                </Button>
              </div>
            </div>
            <ul className="flex flex-wrap gap-4">
              {product.tags.map((tag: any, index: number) => (
                <li key={index} className="flex items-center gap-2 bg-gray-100 rounded-md p-2">
                  <span className="text-gray-800">{tag}</span>
                  <Button
                    color="failure"
                    size="xs"
                    onClick={() => removeTag(index)}
                    aria-label={`Remove tag: ${tag}`}
                  >
                    <RiDeleteBinLine />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Features</h4>
            <div className="flex gap-4 items-center mb-4">
              <TextInput
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter feature (e.g., Waterproof)"
                className="w-full"
              />
              <div className="w-full">
                <Button size="xs" type="button" onClick={addFeature}>
                  Add Feature
                </Button>
              </div>
            </div>
            <ul className="flex flex-wrap gap-4">
              {product.features.map((feature: any, index: number) => (
                <li key={index} className="flex items-center gap-2 bg-gray-100 rounded-md p-2">
                  <span className="text-gray-800">{feature}</span>
                  <Button color="failure" size="xs" onClick={() => removeFeature(index)}>
                    <RiDeleteBinLine />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-700">Specifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
              <TextInput
                type="text"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                placeholder="Specification Key"
              />
              <TextInput
                type="text"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                placeholder="Specification Value"
              />
              <div className="w-full">
                <Button type="button" size="xs" onClick={addSpecification}>
                  Add Specification
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {(Object.entries(product.specifications) as [string, string][]).map(
                ([key, value]) => (
                  <div key={key} className="flex gap-4 items-center border rounded-md p-2">
                    <span>
                      <span className="font-medium text-gray-800">{key} :</span>{' '}
                      <span className="font-medium text-gray-800">{value}</span>
                    </span>
                    <Button color="failure" size="xs" onClick={() => removeSpecification(key)}>
                      <RiDeleteBinLine />
                    </Button>
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
