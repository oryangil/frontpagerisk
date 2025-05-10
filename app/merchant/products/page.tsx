'use client';

import { DashLayout } from '@/components/layouts';
import { BinaryIcon, MoreHorizontal, TagIcon } from 'lucide-react';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import mastercardImage from '@/assets/images/mastercard.svg';
import visaImage from '@/assets/images/visa.svg';
import { Pagination } from '@/components/widgets';
import { ITEMS_PER_PAGE } from '@/consts/vars';
import { useApiRequest } from '@/hooks';
import { productsUrl, transactionsUrl } from '@/consts/paths';
import Toaster from '@/helpers/Toaster';
import { Product, ProductData, Transaction, TransactionData } from '@/types';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { prDataMock, txDataMock } from '@/mock';

import excelIcon from '@/assets/images/icons/excel-export.svg';
import orderNormalIcon from '@/assets/images/icons/order-normal.svg';
import orderAscIcon from '@/assets/images/icons/order-asc.svg';
import orderDescIcon from '@/assets/images/icons/order-desc.svg';
import { useRouter } from 'next/navigation';
import { txStatusStyles } from '@/consts/styles';
import { AddProductModal } from '@/components/ui';

const cardIcons: Record<Transaction['card'], string> = {
  mastercard: mastercardImage,
  visa: visaImage,
};

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ProductsPage = () => {
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Deactivated'>('All');
  const [dateFilter, setDateFilter] = useState();
  const [orderField, setOrderField] = useState<'createdAt' | 'status' | 'amount'>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [type, setType] = useState<'Physical' | 'Digital' | undefined>();
  const [prData, setPrData] = useState<ProductData>({
    pagination: {
      totalLength: 0,
      itemsPerPage: 0,
      pageCount: 0,
      currentPage: 1,
    },
    data: [] as Product[],
  });

  const {
    response: prResponse,
    error: prError,
    loading: prLoading,
    sendRequest: sendPrRequest,
  } = useApiRequest({
    endpoint: productsUrl,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer 124567890`, // this needs to be changed with the local storage key
    },
    method: 'GET',
    params: {
      status: statusFilter,
      date: dateFilter,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      orderField,
      order,
    },
  });

  const selectStatusFilter = (status: 'All' | 'Active' | 'Deactivated') => {
    setStatusFilter(status);
  };

  useEffect(() => {
    sendPrRequest();
  }, [statusFilter, dateFilter, currentPage, ITEMS_PER_PAGE, order, orderField]);

  useEffect(() => {
    if (prResponse) {
      // Handle the response data here
      setPrData(prResponse.data); // this should be changed according to the response structure, this is the real code
    }
  }, [prResponse]);

  useEffect(() => {
    if (prError) {
      Toaster.error(prError?.message);

      // mock data instead: remove this code in production mode
      setPrData(prDataMock);
    }
  }, [prError]);

  return (
    <DashLayout
      titleArea={
        <>
          <h2 className="text-xl font-semibold">Products</h2>
        </>
      }
    >
      <div className="p-4 bg-white rounded-lg">
        <div className="flex items-center justify-between border-b border-b-gray-200 pb-2 mb-3">
          <div className="flex space-x-4 text-sm font-medium text-gray-900">
            <div
              className={`${
                statusFilter === 'All' ? 'text-blue-500' : 'cursor-pointer hover:text-gray-500'
              } transition-colors duration-200 ease-in-out`}
              onClick={() => selectStatusFilter('All')}
            >
              All
            </div>
            <div
              className={`${
                statusFilter === 'Active' ? 'text-blue-500' : 'cursor-pointer hover:text-gray-500'
              } transition-colors duration-200 ease-in-out`}
              onClick={() => selectStatusFilter('Active')}
            >
              Active
            </div>
            <div
              className={`${
                statusFilter === 'Deactivated' ? 'text-blue-500' : 'cursor-pointer hover:text-gray-500'
              } transition-colors duration-200 ease-in-out`}
              onClick={() => selectStatusFilter('Deactivated')}
            >
              Deactivated
            </div>
          </div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton
                className="flex items-center gap-2 hover:bg-blue-600 text-white px-3 py-1.5 text-sm rounded-sm cursor-pointer transition-colors duration-200 ease-in-out bg-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {'+ '}
                Add Product
              </MenuButton>
            </div>
            <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 ring-gray-300 focus:outline-none cursor-pointer">
              <div className="py-1">
                <MenuItem>
                  <button
                    className="hover:bg-gray-100 hover:text-black text-gray-700 w-full px-4 py-2 text-left text-sm cursor-pointer flex items-center justify-start gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setType('Physical');
                      setAddModal(true);
                    }}
                  >
                    <TagIcon className="w-4 h-4" />
                    Physical
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    className="hover:bg-gray-100 hover:text-black text-gray-700 w-full px-4 py-2 text-left text-sm cursor-pointer flex items-center justify-start gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setType('Digital');
                      setAddModal(true);
                    }}
                  >
                    <BinaryIcon className="w-4 h-4" />
                    Digital
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>

        <div className="flex gap-4 flex-wrap text-sm mb-3">
          {['Creation'].map((filter, idx) => (
            <button
              key={idx}
              className="border border-dashed border-gray-400 px-1 py-1 rounded-full flex items-center gap-1 text-gray-500 cursor-pointer"
            >
              <span className="bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold">
                +
              </span>
              <span className="text-sm font-medium">{filter}</span>
            </button>
          ))}
        </div>
        <div className="h-12 bg-gray-100 -mx-4" style={{ width: 'calc(100% + var(--spacing) * 8)' }} />
        <div className="max-w-full overflow-auto -mt-12">
          <table className="table-auto w-full">
            <thead className="bg-gray-100 text-xs font-semibold text-gray-700 mb-2">
              <tr className="h-12">
                <th className="p-2 text-left cursor-pointer w-14"></th>
                <th className="p-2 text-left cursor-pointer">
                  <div className="flex items-center">
                    <span>Name</span>
                  </div>
                </th>
                <th
                  className="p-2 text-left"
                  onClick={() =>
                    orderField !== 'status' ? setOrderField('status') : setOrder(order === 'asc' ? 'desc' : 'asc')
                  }
                >
                  <div className="flex items-center">
                    <span>Status</span>
                    <Image
                      src={orderField !== 'status' ? orderNormalIcon : order === 'asc' ? orderAscIcon : orderDescIcon}
                      alt="order"
                    />
                  </div>
                </th>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() =>
                    orderField !== 'amount' ? setOrderField('amount') : setOrder(order === 'asc' ? 'desc' : 'asc')
                  }
                >
                  <div className="flex items-center">
                    <span>Amount</span>
                    <Image
                      src={orderField !== 'amount' ? orderNormalIcon : order === 'asc' ? orderAscIcon : orderDescIcon}
                      alt="order"
                    />
                  </div>
                </th>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() =>
                    orderField !== 'createdAt' ? setOrderField('createdAt') : setOrder(order === 'asc' ? 'desc' : 'asc')
                  }
                >
                  <div className="flex items-center">
                    <span>Date / Time</span>
                    <Image
                      src={
                        orderField !== 'createdAt' ? orderNormalIcon : order === 'asc' ? orderAscIcon : orderDescIcon
                      }
                      alt="order"
                    />
                  </div>
                </th>
                <th className="p-2 text-left"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {prLoading && (
                <tr>
                  <td colSpan={8} className="text-center p-6">
                    Loading Products...
                  </td>
                </tr>
              )}
              {!prLoading &&
                prData?.data?.length > 0 &&
                prData?.data.map((p, i) => (
                  <tr
                    key={i}
                    className="h-10 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => {
                      router.push(`/merchant/products/${p.id}`); // this needs to be changed with the local storage key
                    }}
                  >
                    <td className="flex items-center p-2 whitespace-nowrap border-b w-14 border-b-gray-200 gap-2">
                      <Image src={p.image} alt="Product" width={40} height={40} className="w-10 h-10" />
                    </td>
                    <td className="p-2 whitespace-nowrap border-b border-b-gray-200">{p.name}</td>
                    <td className="p-2 whitespace-nowrap border-b border-b-gray-200">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full text-gray-600 ${
                          p.status === 'Active' ? 'bg-[#CBFCCB]' : 'bg-gray-200'
                        }`}
                      >
                        {p.status === 'Active' ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="p-2 font-semibold border-b border-b-gray-200">{`$${formatter.format(p.amount)}`}</td>
                    <td className="p-2 whitespace-nowrap border-b border-b-gray-200">
                      {p.date.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </td>
                    <td className="p-2 text-gray-500 border-b border-b-gray-200">
                      <Menu as="div" className="relative inline-block text-left">
                        <div>
                          <MenuButton
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </MenuButton>
                        </div>
                        <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 ring-gray-300 focus:outline-none cursor-pointer">
                          <div className="py-1">
                            <MenuItem>
                              <button
                                className="hover:bg-gray-100 hover:text-black text-gray-700 w-full px-4 py-2 text-left text-sm cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                Deactivate Product
                              </button>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </Menu>
                    </td>
                  </tr>
                ))}
              {!prLoading && prData?.data?.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-6">
                    No Products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-12">
          <Pagination
            totalLength={prData.pagination.totalLength}
            limit={prData.pagination.itemsPerPage}
            pageCount={prData.pagination.pageCount}
            page={prData.pagination.currentPage}
            pageClick={(p) => setCurrentPage(p)}
          />
        </div>
      </div>
      <AddProductModal open={addModal} onClose={() => setAddModal(false)} type={type!} />
    </DashLayout>
  );
};

export default ProductsPage;
