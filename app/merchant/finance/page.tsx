'use client';

import { DashLayout } from '@/components/layouts';
import { CheckCircle, ChevronDownIcon, ListFilter } from 'lucide-react';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { MenuButton, MenuItem, MenuItems, Menu } from '@headlessui/react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { BalanceCard, Pagination } from '@/components/widgets';
import { ITEMS_PER_PAGE } from '@/consts/vars';
import { useApiRequest } from '@/hooks';
import { payoutsUrl } from '@/consts/paths';
import Toaster from '@/helpers/Toaster';
import { payoutDataMock } from '@/mock';
import { Payout, PayoutData } from '@/types/payout';
import { useRouter } from 'next/navigation';

import walletIcon from '@/assets/images/icons/walletIcon.svg';
import chartIcon from '@/assets/images/icons/chartIcon.svg';
import bagIcon from '@/assets/images/icons/bagIcon.svg';
import balanceIcon from '@/assets/images/icons/balance1.svg';
import Image from 'next/image';

const statusStyles: Record<Payout['status'], string> = {
  Approved: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Failed: 'bg-red-100 text-red-700',
};

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const periods = [1, 2, 7, 15, 30, 0];

const withdrawMethods = [
  {
    type: 'bank',
    name: 'Bank Account',
  },
  {
    type: 'crypto',
    name: 'Crypto Wallet',
  },
];

const FinancePage = () => {
  const router = useRouter();

  const [period, setPeriod] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [payoutData, setPayoutData] = useState<PayoutData>({
    pagination: {
      totalLength: 0,
      itemsPerPage: 0,
      pageCount: 0,
      currentPage: 1,
    },
    data: [] as Payout[],
  });

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [otp, setOTP] = useState('');

  const {
    response: payoutResponse,
    error: payoutError,
    loading: payoutLoading,
    sendRequest: sendPayoutRequest,
  } = useApiRequest({
    endpoint: payoutsUrl,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer 124567890`, // this needs to be changed with the local storage key
    },
    method: 'GET',
    params: {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      period,
    },
  });

  useEffect(() => {
    sendPayoutRequest();
  }, [period, currentPage]);

  useEffect(() => {
    if (payoutResponse) {
      // Handle the response data here
      setPayoutData(payoutResponse.data); // this should be changed according to the response structure, this is the real code
    }
  }, [payoutResponse]);

  useEffect(() => {
    if (payoutError) {
      Toaster.error(payoutError?.message);

      // mock data instead: remove this code in production mode
      setPayoutData(payoutDataMock);
    }
  }, [payoutError]);

  return (
    <DashLayout
      titleArea={
        <>
          <h2 className="text-xl font-semibold">Finance</h2>
        </>
      }
      tools={
        <>
          <Link
            href="/merchant/finance/accounts"
            className="rounded-full bg-white hover:text-blue-500 cursor-pointer text-sm px-3 py-1.5 text-gray-700 transition-colors border border-gray-200 truncate"
          >
            Manage Accounts
          </Link>
          <button
            className="rounded-full hover:bg-blue-600 bg-blue-500 cursor-pointer text-sm px-3 py-1.5 text-white transition"
            onClick={() => setShowWithdrawModal(true)}
          >
            Withdraw
          </button>
        </>
      }
    >
      {/* balance amounts should be fetched from backend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6">
        <BalanceCard icon={walletIcon} label="Available Balance" amount={45445} />
        <BalanceCard icon={chartIcon} label="Total Balance" amount={4544.5} />
        <BalanceCard icon={bagIcon} label="Reserve Balance" amount={4545} />
      </div>

      <div className="p-4 bg-white rounded-lg">
        <div className="flex gap-4 flex-wrap mb-3 px-2 items-center justify-between">
          <div className="text-lg font-bold">Payouts List</div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton className="inline-flex items-center gap-2 border border-gray-400 px-3 py-1 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer">
                <ListFilter className="w-4 h-4 text-indigo-900" />
                {period === 0
                  ? 'Lifetime'
                  : period === 1
                  ? 'Today'
                  : period === 2
                  ? 'Yesterday'
                  : `Last ${period} days`}
              </MenuButton>
            </div>
            <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 ring-gray-300 focus:outline-none cursor-pointer">
              <div className="py-1">
                {periods.map((p, i) => (
                  <MenuItem key={i}>
                    <button
                      className="hover:bg-gray-100 hover:text-black text-gray-700 w-full px-4 py-2 text-left text-sm cursor-pointer"
                      onClick={() => setPeriod(p)}
                    >
                      {p === 0 ? 'Lifetime' : p === 1 ? 'Today' : p === 2 ? 'Yesterday' : `Last ${p} days`}
                    </button>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>

        <div className="h-12 bg-gray-100 -mx-4" style={{ width: 'calc(100% + var(--spacing) * 8)' }} />
        <div className="max-w-full overflow-auto -mt-12">
          <table className="table-auto w-full">
            <thead className="bg-gray-100 text-xs font-semibold text-gray-700 mb-2">
              <tr className="h-12">
                <th className="p-2 text-left cursor-pointer">
                  <div className="flex items-center">
                    <span>Created At</span>
                  </div>
                </th>
                <th className="p-2 text-left cursor-pointer">
                  <div className="flex items-center">
                    <span>Transaction ID</span>
                  </div>
                </th>
                <th className="p-2 text-left cursor-pointer">
                  <div className="flex items-center">
                    <span>Transfer Method</span>
                  </div>
                </th>
                <th className="p-2 text-left cursor-pointer">
                  <div className="flex items-center">
                    <span>Status</span>
                  </div>
                </th>
                <th className="p-2 text-left cursor-pointer">
                  <div className="flex items-center">
                    <span>Amount</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {payoutLoading && (
                <tr>
                  <td colSpan={8} className="text-center p-6">
                    Loading Payouts History...
                  </td>
                </tr>
              )}
              {!payoutLoading &&
                payoutData?.data?.length > 0 &&
                payoutData?.data.map((t, i) => (
                  <tr
                    key={i}
                    className="h-10 hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/merchant/finance/payouts?id=${t.id}`)}
                  >
                    {/* <td className="pl-4 w-8 h-full">
                    <div className="border-b border-b-gray-200 flex items-center h-full w-full">
                      <input type="checkbox" style={{ verticalAlign: 'middle' }} />
                    </div>
                  </td> */}
                    <td className="p-2 whitespace-nowrap border-b border-b-gray-200">
                      {t.createdAt.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </td>
                    <td className="p-2 whitespace-nowrap border-b border-b-gray-200">{t.txid}</td>
                    <td className="p-2 whitespace-nowrap border-b border-b-gray-200">
                      {t.method === 'bank' ? 'Bank' : 'Crypto'}
                    </td>
                    <td className="p-2 border-b border-b-gray-200">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-2 font-semibold border-b border-b-gray-200">{`$${formatter.format(t.amount)}`}</td>
                    {/* <td className="p-2 text-gray-500 border-b border-b-gray-200">
                    <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td> */}
                  </tr>
                ))}
              {!payoutLoading && payoutData?.data?.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-6">
                    No Payout History
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-12">
          <Pagination
            totalLength={payoutData.pagination.totalLength}
            limit={payoutData.pagination.itemsPerPage}
            pageCount={payoutData.pagination.pageCount}
            page={payoutData.pagination.currentPage}
            pageClick={(p) => setCurrentPage(p)}
          />
        </div>
      </div>
      {showWithdrawModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0008]"
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-xl space-y-4"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <h2 className="text-lg font-semibold">Withdraw your amount</h2>
              <span
                className="flex items-center justify-center w-6 h-6 rounded-full text-2xl hover:bg-gray-100 transition-colors duration-200 ease-in-out cursor-pointer"
                onClick={() => setShowWithdrawModal(false)}
              >
                &times;
              </span>
            </div>
            <div className="flex justify-between items-center border-b-4 border-blue-500 py-1">
              <div className="flex items-center text-sm gap-2">
                <Image src={balanceIcon} alt="Balance" className="w-5 h-5" />
                <span>Available Balance</span>
              </div>
              <div className="flex items-center font-semibold text-sm">US$ 45,445.00</div>
            </div>
            <div className="max-w-xl w-full space-y-6">
              <div>
                <label className="block text-sm mb-1">Withdraw Method</label>
                <div className="w-full">
                  <Listbox value={withdrawMethod} onChange={setWithdrawMethod}>
                    <div className="relative">
                      <ListboxButton className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-500 bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {withdrawMethods.find((e) => e.type === withdrawMethod)?.name ||
                          'Please select your withdraw method'}
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                      </ListboxButton>
                      <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-gray-300 focus:outline-none z-10">
                        {withdrawMethods.map((e, i) => (
                          <ListboxOption
                            value={e.type}
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
              <div>
                <label className="block text-sm mb-1">Amount</label>
                <input
                  type="text"
                  placeholder="Enter Amount"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                After confirm, you concern you are requesting to deposit that amount to this bank account/wallet
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6">
                <button className="bg-blue-50 text-blue-500 font-semibold py-2 rounded-md hover:bg-blue-100  transition cursor-pointer">
                  Cancel
                </button>
                <button
                  className="hover:bg-blue-600 text-white font-semibold py-2 rounded-md bg-blue-500 transition cursor-pointer"
                  onClick={() => {
                    // needs to be changed in integration with backend
                    setShowWithdrawModal(false);
                    setShowOTPModal(true);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showOTPModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0008]"
          onKeyDown={async (e) => {
            if (showOTPModal) {
              if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                const text = await navigator.clipboard.readText();
                setOTP(text);
              }
            }
          }}
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
            <div className="flex text-center items-center pb-4 font-semibold text-xl">
              Sent a verification code on your registered email
            </div>
            <div className="flex items-center justify-center text-center text-gray-500 text-sm">
              Please enter your 6-digit authentication code from email
            </div>
            <div className="max-w-xl w-full space-y-4">
              <div className="flex items-center justify-center text-center font-semibold text-gray-900 text-xl">
                OTP
              </div>
              <div className="flex gap-2 justify-center items-center">
                {Array.from({ length: 6 }, (_, i) => i).map((_, i) => (
                  <input
                    readOnly
                    type="text"
                    key={i}
                    className="border border-gray-400 rounded-md p-2 w-12 h-12 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    value={otp[i] ?? ''}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center text-center text-green-400 text-xs">
                You can copy OTP code from your email to any inputs in the above.
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6">
                <button className="bg-blue-50 text-blue-500 font-semibold py-2 rounded-md hover:bg-blue-100  transition cursor-pointer">
                  Back
                </button>
                <button
                  className="hover:bg-blue-600 text-white font-semibold py-2 rounded-md bg-blue-500 transition cursor-pointer"
                  onClick={() => {
                    // needs to be changed in integration with backend
                    setShowSuccessModal(true);
                    setShowOTPModal(false);
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0008]">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
            <div className="flex text-center justify-center items-center pt-4 font-semibold text-xl">
              <CheckCircle className="text-green-600 text-lg font-bold" strokeWidth={3} />
            </div>
            <div className="flex text-center items-center pb-4 font-semibold text-xl">
              You have successfully withdrawn your balance
            </div>
            <div className="flex items-center justify-center text-center text-gray-500 text-sm">
              We have accepted your request. Our team will analyze it and you will receive your money in your bank
              account within one business day.
            </div>
            <div className="max-w-xl w-full space-y-4">
              <div className="grid grid-cols-1 gap-4 pt-6">
                <button
                  className="hover:bg-blue-600 text-white font-semibold py-2 rounded-md bg-blue-500 transition cursor-pointer"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashLayout>
  );
};

export default FinancePage;
