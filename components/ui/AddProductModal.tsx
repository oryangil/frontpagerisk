'use client';

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { CheckCircle, ChevronDownIcon, MoreHorizontal, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AddShippingModal from './AddShippingModal';
import { Product } from '@/types';

const money = [
  {
    name: 'USD',
    prefix: 'US$',
  },
  {
    name: 'EUR',
    prefix: 'EU€',
  },
];

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const shippingList = [
  {
    id: '424',
    name: 'Free Shipping',
    maxDay: 2,
    minDay: 1,
    fee: 20.2,
  },
  {
    id: '4234',
    name: 'Free FEDEX Shipping',
    maxDay: 5,
    minDay: 3,
    fee: 10.22,
  },
];

const AddProductModal: React.FC<{
  open: boolean;
  onClose: () => void;
  type: 'Physical' | 'Digital';
  product?: Product;
}> = ({ open, onClose, type, product }) => {
  const [mounted, setMounted] = useState(false);

  const [moneyType, setMoneyType] = useState('USD');
  const [value, setValue] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [shipModal, setShipModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // if (!open) return null;
  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex justify-end bg-[#0008] ${open ? 'translate-x-0' : 'translate-x-full'}`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-5xl h-full bg-white shadow-xl p-4 flex flex-col overflow-hidden duration-700 transition ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 mb-4 pb-2 mx-2">
          <div className="text-lg font-bold">Add Product</div>
          <button className="rounded-full hover:bg-gray-100 transition p-2 cursor-pointer" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-row gap-6 overflow-hidden mr-2">
          {/* Left: Form */}
          <div className="flex-1 flex flex-col min-h-0 text-sm  px-2">
            <div className="flex-1 space-y-6 overflow-y-auto">
              <div className="space-y-1">
                <div className="font-semibold">Name (required)</div>
                <div className="text-gray-600">Name of the product or service, visible to customers.</div>
                <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="space-y-1">
                <div className="font-semibold">Description</div>
                <div className="text-gray-600">
                  It appears at checkout, in the customer portal and in quotation mark.
                </div>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                />
              </div>

              <div className="space-y-1">
                <div className="font-semibold">Image</div>
                <div className="text-sm text-gray-500 mb-2">
                  Appears at checkout as JPEG, PNG or WEBP less than 2MB.
                </div>
                <button
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 transition shadow-lg text-gray-600 cursor-pointer rounded-md flex items-center gap-2 text-sm font-medium"
                  onClick={handleButtonClick}
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              </div>

              {type === 'Digital' && (
                <div className="space-y-2">
                  <p className="font-semibold">More Option</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="border px-4 py-2 rounded-md font-medium border-gray-300 hover:bg-gray-100 transition cursor-pointer">
                      Recurrent
                    </button>
                    <button className="border px-4 py-2 rounded-md font-medium border-gray-300 hover:bg-gray-100 transition cursor-pointer">
                      One Time
                    </button>
                  </div>
                </div>
              )}

              {type === 'Physical' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Shipping</p>
                    <button
                      className="px-3 py-0.5 hover:bg-blue-600 bg-blue-500 transition cursor-pointer text-white rounded-md font-medium"
                      onClick={() => setShipModal(true)}
                    >
                      Add
                    </button>
                  </div>
                  <div className="w-full">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-300 text-gray-700 text-left bg-gray-200">
                          <th className="p-2 max-w-16 w-16 font-semibold">Name</th>
                          <th className="p-2 font-semibold">Time</th>
                          <th className="p-2 font-semibold">Price</th>
                          <th className="p-2 font-semibold"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {shippingList.map((s, i) => (
                          <tr key={i} className="border-b border-b-gray-200 text-gray-600">
                            <td className="py-1 truncate px-2">{s.name}</td>
                            <td className="py-1 truncate px-2">
                              {s.minDay}-{s.maxDay} days
                            </td>
                            <td className="py-1 truncate px-2">USD {formatter.format(s.fee)}</td>
                            <td className="py-1 text-gray-500 ">
                              <Menu as="div" className="relative inline-block text-left">
                                <div>
                                  <MenuButton className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out cursor-pointer">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </MenuButton>
                                </div>
                                <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 ring-gray-300 focus:outline-none cursor-pointer">
                                  <div className="py-1">
                                    <MenuItem>
                                      <button
                                        className="hover:bg-gray-100 hover:text-black text-gray-700 w-full px-4 py-2 text-left text-sm cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        Edit
                                      </button>
                                    </MenuItem>
                                    <MenuItem>
                                      <button
                                        className="hover:bg-gray-100 hover:text-black text-gray-700 w-full px-4 py-2 text-left text-sm cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        Remove
                                      </button>
                                    </MenuItem>
                                  </div>
                                </MenuItems>
                              </Menu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="font-semibold">Value (required)</div>
                <div className="flex gap-2 relative items-center">
                  <input
                    className="border border-gray-300 rounded-md px-3 pl-12 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={value}
                    onChange={(e) => setValue(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))}
                  />
                  <div className="absolute left-3 font-semibold">
                    {money.find((e) => e.name === moneyType)?.prefix ?? '$'}
                  </div>
                  <Listbox value={moneyType} onChange={setMoneyType}>
                    <div className="relative">
                      <ListboxButton className="w-full rounded-md px-4 py-2 text-sm text-white cursor-pointer bg-gray-800 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {money.find((e) => e.name === moneyType)?.name || 'Please select'}
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                      </ListboxButton>
                      <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-gray-300 focus:outline-none z-10">
                        {money.map((e, i) => (
                          <ListboxOption
                            value={e.name}
                            key={i}
                            className={({ active }) =>
                              `cursor-pointer select-none px-4 py-2 ${
                                active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                              }`
                            }
                          >
                            {e.name}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                </div>
              </div>
            </div>

            {/* Footer buttons pinned */}
            <div className="sticky bottom-0 pt-4 bg-white flex gap-4 border-t border-gray-300 mt-0">
              <button
                className="px-6 py-2 bg-gray-100 rounded-md font-medium cursor-pointer hover:bg-gray-200 border-gray-200 border"
                onClick={onClose}
              >
                Cancel
              </button>
              <button className="px-6 py-2 hover:bg-blue-600 bg-blue-500 transition cursor-pointer text-white rounded-md font-medium">
                Create Product
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="w-[320px] bg-gray-100 p-6 rounded-lg space-y-4 text-sm overflow-y-auto hidden md:block">
            <h3 className="font-semibold text-lg">Preview</h3>
            <p className="text-sm text-gray-600">Estimate totals based on pricing model, unit quantity, and tax</p>
            <div className="space-y-1">
              <div className="text-sm font-medium">Unit Quantity</div>
              <input
                className="border border-gray-300 bg-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))}
              />
            </div>
            <div className="border-t border-gray-300">
              <div className="text-sm border-b border-gray-300 py-4">
                {`${quantity} × $${formatter.format(value)} = `}
                <strong>US$ {formatter.format(value * quantity)}</strong>
              </div>
              <div className="font-semibold pt-2">
                Total <span className="float-right">US$ {formatter.format(value * quantity)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <AddShippingModal open={shipModal} onClose={() => setShipModal(false)} id={product?.id} />
      </div>
    </div>,
    document.body
  );
};

export default AddProductModal;
