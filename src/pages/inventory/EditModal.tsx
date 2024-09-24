import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";

type InventoryItem = {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  unit: "kg" | "litre" | "nos";
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<InventoryItem, "_id">) => void;
  editItem?: InventoryItem;
};

const EditModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editItem,
}) => {
  const [item, setItem] = useState<Omit<InventoryItem, "_id">>({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    unit: "kg",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editItem) {
      setItem({
        name: editItem.name,
        description: editItem.description,
        quantity: editItem.quantity,
        price: editItem.price,
        unit: editItem.unit,
      });
    } else {
      setItem({ name: "", description: "", quantity: 0, price: 0, unit: "kg" });
    }
    setErrors({});
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!item.name.trim()) newErrors.name = "Name is required";
    if (!item.description.trim())
      newErrors.description = "Description is required";
    if (item.quantity < 0)
      newErrors.quantity = "Quantity must be a non-negative number";
    if (item.price < 0) newErrors.price = "Price must be a non-negative number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(item);
        onClose();
      } catch (error) {
        console.error("Error submitting item:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {editItem ? "Edit Item" : "Add New Item"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              className={`w-full p-2 border rounded ${
                errors.name ? "border-red-500" : ""
              }`}
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              className={`w-full p-2 border rounded ${
                errors.description ? "border-red-500" : ""
              }`}
              value={item.description}
              onChange={(e) =>
                setItem({ ...item, description: e.target.value })
              }
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              className={`w-full p-2 border rounded ${
                errors.quantity ? "border-red-500" : ""
              }`}
              value={item.quantity || ""}
              onChange={(e) =>
                setItem({
                  ...item,
                  quantity: e.target.value ? parseFloat(e.target.value) : 0,
                })
              }
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="unit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Unit
            </label>
            <select
              id="unit"
              className="w-full p-2 border rounded"
              value={item.unit}
              onChange={(e) =>
                setItem({
                  ...item,
                  unit: e.target.value as InventoryItem["unit"],
                })
              }
            >
              <option value="kg">kg</option>
              <option value="litre">litre</option>
              <option value="nos">nos</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price (per {item.unit})
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              className={`w-full p-2 border rounded ${
                errors.price ? "border-red-500" : ""
              }`}
              value={item.price || ""}
              onChange={(e) =>
                setItem({
                  ...item,
                  price: e.target.value ? parseFloat(e.target.value) : 0,
                })
              }
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-200 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#735DA5] text-white rounded flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  Submitting...
                </>
              ) : (
                <>{editItem ? "Update" : "Add"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
