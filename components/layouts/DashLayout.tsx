'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown } from 'lucide-react';
import { SidebarMerchant } from '../widgets';
import { useApiRequest } from '@/hooks';
import { notiUrl } from '@/consts/paths';
import { Notification } from '@/types';
import { mockNotiData } from '@/mock';
import Image from 'next/image';

const DashLayout: React.FC<{ children: ReactNode; titleArea: ReactNode; tools?: ReactNode }> = ({
  children,
  titleArea,
  tools,
}) => {
  const userInfo = {
    name: 'Nur Hasan',
    avatar: 'https://ui-avatars.com/api/?name=Nur%20Hasan',
    // role: 'Merchant',
  }; // this needs to be changed using local stroage interacted with backend

  const [notiShow, setNotiShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [notiList, setNotiList] = useState<Notification[]>([] as Notification[]);

  const {
    response: notiResponse,
    error: notiError,
    loading: notiLoading,
    sendRequest: sendNotiRequest,
  } = useApiRequest({
    endpoint: notiUrl,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer 124567890`, // this needs to be changed with the local storage key
    },
    method: 'GET',
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setNotiShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    sendNotiRequest();
  }, []);

  useEffect(() => {
    if (notiError) {
      setNotiList(mockNotiData); // remove this
    }
  }, [notiError]);

  useEffect(() => {
    if (notiResponse) {
      setNotiList(notiResponse.data);
    }
  }, [notiResponse]);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <SidebarMerchant />
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 transition-all space-y-6 md:ml-64 transform duration-300 ease-in-out max-w-full md:max-w-[calc(100%-16rem)]">
        <div className="flex justify-between items-center ml-12 md:ml-0 h-10">
          <div>{titleArea}</div>
          <div className="flex items-center gap-2 md:gap-4 transition">
            {tools}
            <div className="relative" ref={ref}>
              <button
                className="relative block rounded-full border-gray-300 border-1 p-1 cursor-pointer hover:bg-white transition"
                onClick={() => setNotiShow(!notiShow)}
              >
                <Bell className="w-5 h-5" />
                {notiList.length > 0 && (
                  <span className="absolute top-1 right-[7px] block h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>
              {notiShow && (
                <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="font-semibold py-2 px-4 border-b border-b-gray-300">Notifications</div>
                  <div className="p-4 text-sm text-gray-700">
                    {notiList.length === 0 && <p>No new notifications</p>}
                    {notiList.length > 0 &&
                      notiList.map((noti) => (
                        <div key={noti.id} className="flex items-center gap-2 mb-2">
                          <div>
                            <p className="font-medium text-sm truncate">{noti.title}</p>
                            <p className="text-gray-400 text-xs">
                              {noti.date.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </p>
                            <p className="text-gray-500 text-xs h-8">{noti.content}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <Link className="flex items-center gap-2 text-sm cursor-pointer" href="/merchant/settings?tab=security">
              <Image src={userInfo.avatar} alt="User Avatar" width={32} height={32} className="rounded-full" />
              <div className="md:flex hidden">
                <p className="font-medium truncate">{userInfo.name}</p>
                {/* <p className="text-gray-500 truncate">{userInfo.role}</p> */}
              </div>
            </Link>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashLayout;
