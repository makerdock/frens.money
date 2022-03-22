import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { BellIcon } from '@heroicons/react/solid'
import { useMoralisData } from '../hooks/useMoralisData';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db, firestoreCollections } from '../utils/firebaseClient';
import {Notification, NotificationTypes} from '../contracts'
import human from 'human-time';
import { minimizeAddress } from '../utils';

export default function NotificationMenu() {

  const { account } = useMoralisData();

    const [notifications] = useCollectionData<Notification>(
            account &&
            db
                .collection(firestoreCollections.NOTIFICATIONS)
                .where("recipient", "==", account.toLowerCase())
    );


  return (
    <div>
      <Menu as="div" className="min-xs:relative inline-block text-left font-space">
        <div>
          <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <BellIcon className="w-6 h-6" color="#7D8AFF" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-10 overflow-y-auto max-h-154 xs:w-[97%] xs:right-2 right-0 xs:shadow w-96 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className='px-6 py-4'>
                <h1 className='text-2xl font-bold'>Notifications</h1>
            </div>
                {
                    notifications && notifications.map(notification => (
                        <Menu.Item>
                            <div className='px-6 py-4 hover:bg-gray-100'>
                                <div className='flex items-center justify-between mb-3'>
                                    <p className={`font-medium text-base text-red`}>{notification.type === NotificationTypes.Request ? 'Request' : 'Request To settle'}</p>
                                    <p className='text-gray-400'>{human(new Date(notification.timestamp))}</p>
                                </div>
                                <p className='text-base font-medium'>{!!notification?.from?.length ? `${minimizeAddress(notification?.from)} requested ${notification.amount} ETH from you.` : notification.message}</p>
                            </div>
                        </Menu.Item>
                    ))
                }
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}