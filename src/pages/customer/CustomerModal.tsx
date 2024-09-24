import React, { useState, useEffect } from "react";
import { createCustomer, updateCustomer } from "../../api/user";
import toast from "react-hot-toast";
import { Customer } from "./CustomerList";
import { Loader } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editCustomer?: Customer;
};

const CustomerModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  editCustomer,
}) => {
  const [customer, setCustomer] = useState<Omit<Customer, "_id">>({
    name: "",
    address: "",
    mobileNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editCustomer) {
      setCustomer({
        name: editCustomer.name,
        address: editCustomer.address,
        mobileNumber: editCustomer.mobileNumber,
      });
    } else {
      setCustomer({ name: "", address: "", mobileNumber: "" });
    }
    setErrors({});
  }, [editCustomer, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!customer.name.trim()) newErrors.name = "Name is required";
    if (!customer.address.trim()) newErrors.address = "Address is required";
    if (!customer.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        if (editCustomer) {
          const response = await updateCustomer({
            _id: editCustomer._id,
            updatedCustomer: customer,
          });
          if (response.status === 200) {
            toast.success(response.data);
          } else {
            toast.error(response.data);
          }
        } else {
          const response = await createCustomer(customer);
          if (response.status === 200) {
            toast.success(response.data);
          } else {
            toast.error(response.data);
          }
        }
        onClose();
      } catch (err) {
        toast.error("An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {editCustomer ? "Edit Customer" : "Add New Customer"}
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
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <textarea
              id="address"
              className={`w-full p-2 border rounded ${
                errors.address ? "border-red-500" : ""
              }`}
              value={customer.address}
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              type="tel"
              className={`w-full p-2 border rounded ${
                errors.mobileNumber ? "border-red-500" : ""
              }`}
              value={customer.mobileNumber}
              onChange={(e) =>
                setCustomer({ ...customer, mobileNumber: e.target.value })
              }
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
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
                <>{editCustomer ? "Update" : "Add"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
