import React, { useContext, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";
import { SecretContext } from "@/context/secret-context";
import { utilServerSideDeviceDetection } from "@/lib/utilServerSideDeviceDetection";
const Navbar = ({ toggle }: { toggle: () => void }) => {
  const { state, dispatch } = useContext(SecretContext);
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className="w-full h-20 bg-emerald-800 sticky top-0">
        <div className="container mx-auto px-4 h-full">

          <div className="flex justify-between items-center h-full">
            <Logo />
            <button
              type="button"
              className="inline-flex items-center md:hidden"
              onClick={toggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#fff"
                  d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"
                />
              </svg>
            </button>
            <ul className="hidden md:flex gap-x-6 text-white ">
              {state.isLogin ?
                <>
                  <li>
                    <Link href="/">
                      <p>Home</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard">
                      <p>Dashboard</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/user">
                      <p>User</p>
                    </Link>
                  </li>
                </> :
                <>
                </>
              }



              {!state.isLogin ?
                <>
                  <li>
                    <Link href="/">
                      <p>Home</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/about">
                      <p>About Us</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services">
                      <p>Services</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacts">
                      <p>Contacts</p>
                    </Link>
                  </li>
                </> :
                <>
                </>
              }


            </ul>

            <div className="relative inline-block text-left">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button" className="mt-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                <span className="sr-only">Open user menu</span>
                <img className="w-8 h-8 rounded-full" src="/profile-picture-3.jpg" alt="user photo" />
              </button>
              {isOpen && (
                <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Account settings</Link>
                    <Link href="/documentation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Documentation</Link>
                    <span className="block px-4 py-2 text-sm text-gray-700 opacity-50" role="menuitem">Invite a friend (coming soon!)</span>
                  </div>
                </div>
              )}
            </div>

      
            <div className="hidden md:block">
              <Button />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
