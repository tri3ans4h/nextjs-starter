'use client';

import React, { useContext, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';

import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';

import siteMuseLogo from '../../../public/sitemuse.svg';
import { SecretContext } from '@/context/secret-context';
import useUserService from '@/app/_services/useUserService';
const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  const userService = useUserService();
  const { state, dispatch } = useContext(SecretContext);
  const router = useRouter()
  const hdlLogout = async (e: any) => {
    e.preventDefault();
    localStorage.clear()
    dispatch({ type: 'setLogin', payload: false });
    await userService.logout()
    router.push('/login')
  }
  const hdlClickUserIcon = async (e: any) => {
    e.preventDefault();
    setIsOpen(!isOpen)
    dispatch({ type: 'setStateMenuDropDown', payload: !isOpen });

  }

  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    setIsOpen(state.isMenuDropDown)
  }, [state.isMenuDropDown]);

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
        {
          'border-b border-gray-200 bg-white/75 backdrop-blur-lg': scrolled,
          'border-b border-gray-200 bg-white': selectedLayout,
        },
      )}
    >

      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
            <span className="font-bold text-xl text-black flex ">Logo</span>
          </Link>


        </div>


        <div className="hidden md:flex">
          {/*<div className="h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center text-center">
            <span className="font-semibold text-sm">HQ</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center text-center">
            <span className="font-semibold text-sm">HQ</span>
          </div>*/}
          <div className="relative inline-block text-left">
            <button
              onClick={hdlClickUserIcon}
              type="button" className="mt-3 text-sm bg-gray-200 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
              <span className="sr-only">Open user menu</span>
              {
                (
                  state.user.photo ?
                    <>
                      <Image className="w-8 h-8 rounded-full" src={state.user.photo} width={32} height={32} alt='photo' />
                    </> :
                    <>
                      <Image className="w-8 h-8 rounded-full" src="/icons8-male-user-50.png" width={32} height={32} alt='photo' />
                    </>
                )
              }

              {/*
               <img className="w-8 h-8 rounded-full" src={state.user.photo} alt="user photo" />
              profile-picture-3.jpg
          state    
        */}
            </button>
            {isOpen && (
              <div className="absolute -left-48 z-10  w-56 rounded-md shadow-lg bg-white ">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Account settings</Link>
                  <Link href="/documentation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Documentation</Link>
                  <button onClick={hdlLogout} className=" text-left w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;