"use client"

import useUserService from "@/app/_services/useUserService";
import React, { useEffect, useState } from "react"
import { Icon } from '@iconify/react';
import { useRouter } from "next/navigation";


import { useCookies } from 'next-client-cookies';

interface IUserDeviceLogged {
    id: number;
    device_type: string
    session: number
}
const UserDeviceLogged: IUserDeviceLogged[] = [
    { id: 1, device_type: "android", session: 2 },
    { id: 2, device_type: "apple", session: 1 },
    { id: 3, device_type: "window", session: 2 },
    { id: 4, device_type: "mac os", session: 2 }
]



export default function DeviceListByOSNamePage({ params }: { params: { id: string } }) {
    const userService = useUserService()
    const [activeDevice, setActiveDevice] = useState<any[]>([]);
    const [activeMyDevice, setActiveMyDevice] = useState<any>({});
    const router = useRouter()
    const cookies = useCookies();
    useEffect(() => {
        (async () => {

            //strategi refresh token & check validation
            const RES_activeDevice = await userService.activeDeviceByOSName(decodeURI(params.id))
            if (RES_activeDevice.status == 500) {
                return;
            }
            const data = await RES_activeDevice.json()
            setActiveDevice(data.all_device)
            setActiveMyDevice(data.my_device)
        })();
    }, []);


    const hdlClickDevice = (item: any): any => {
        router.push('/simple/settings/security/device-info/' + item.deviceUniqueID)
    }
    return (
        <>
            <div className="flex-1 flex-col flex">
                {/*<div className=" mb-6 bg-white">
                    <div className="flex flex-col my-6 items-center text-center" >
                        <h3 className=" text-2xl py-1">Security</h3>
                        <p className=" text-sm text-gray-400 py-1">Settings and recommendations to help you keep your account secure</p>

                    </div>
    </div>*/}
                <div className="border mb-6 bg-white">
                    <div className="flex flex-col mb-6">
                        {
                            activeDevice.length == 0 ?
                                <>
                                    <div className="flex-col mt-6 py-2 items-center ">
                                        <div className="mx-6"><h3 className="text-lg py-1">No device detected</h3>
                                        </div>
                                    </div>
                                </> :
                                <>
                                    <div className="flex flex-row mx-6 align-middle items-center">
                                        <div className="flex justify-center w-8 h-8 align-middle items-center hover:bg-slate-300 cursor-pointer" onClick={() => { router.back() }}>
                                            <Icon icon="radix-icons:arrow-left" width="24" height="24" />
                                        </div>
                                        <div className="flex-col mt-6 py-2 items-center ">
                                            <div className="mx-3">

                                                <h3 className="text-lg py-1">Your {decodeURI(params.id)} devices</h3>
                                                <p className=" text-sm text-gray-400 py-1">Where you're signed in</p>
                                            </div>
                                        </div>
                                    </div>

                                </>
                        }


                        {React.Children.toArray(
                            activeDevice?.map((item, index) => (
                                <>
                                    <div className="hover:bg-sky-100" >
                                        <div className="flex items-center mx-6 py-4 border-b-2 ">
                                            <div className="flex-none w-12" onClick={() => hdlClickDevice(item)}>

                                                {(() => {
                                                    switch (item.uaOSName) {
                                                        case 'Mac OS':
                                                            return <img className="h-10 w-10" src="/device/mac.png" />
                                                        case 'Android':
                                                            return <img className="h-10 w-10" src="/device/smartphone.png" />
                                                        case 'iOS':
                                                            //return <Won handleClick={handleClick} />
                                                            return <img className="h-10 w-10" src="/device/apple.png" />
                                                        case 'Windows':
                                                            //return <Won handleClick={handleClick} />
                                                            return <img className="h-10 w-10" src="/device/pc-win.png" />
                                                        case 'lost':
                                                        //return <Lost handleClick={handleClick} />
                                                        default:
                                                            return null
                                                    }
                                                })()}


                                            </div>
                                            <div className="flex-1 w-24 " onClick={() => hdlClickDevice(item)}>
                                                <div className="flex flex-col">
                                                    <span className="text-sm">{item.uaBrowserName} {(item.uaDeviceType ? "(" + (item.uaDeviceType) + ")" : "")} pada perangkat {item.uaOSName}
                                                    </span>
                                                    <span className="text-sm text-green-500">
                                                        {
                                                            (activeMyDevice?.deviceUniqueID == item.deviceUniqueID ? "Your current session" : "")
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-none w-24">
                                                <button onClick={async () => {
                                                    //   console.log(item.deviceUniqueID)
                                                    const response = await userService.removeDevice(item.deviceUniqueID)
                                                    const data = await response.json()
                                                    const tmp = activeDevice;
                                                    let tmp2 = []
                                                    if (data.count > 0) {
                                                        tmp2 = tmp.filter((itm) => itm.deviceUniqueID !== item.deviceUniqueID)
                                                        console.log(tmp2)
                                                        setActiveDevice(tmp2)
                                                    }
                                                }} className="z-50 mr-2 w-24 py-2 text-white  rounded-md bg-red-400 hover:bg-red-300"><span className=" text-sm text-stone-700">Sign Out</span></button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )))}


                        {/*<div className="hover:bg-sky-100">
                            <div className="flex items-center mx-6 py-4 border-b-2 ">
                                <div className="basis-1/12">
                                    <img className="h-16 w-16" src="/smartphone.png" />

                                </div>
                                <div className="basis-8/12"><span className="text-sm">2 Sesi pada PC</span></div>
                                <div className="basis-1/12"></div>
                                <div className="basis-1/12">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="hover:bg-sky-100">
                            <div className="flex items-center mx-6 py-4 border-b-2 ">
                                <div className="basis-1/12">
                                    <img className="h-16 w-16" src="/smartphone.png" />
                                </div>
                                <div className="basis-8/12"><span className="text-sm">1 Sesi pada Android </span></div>
                                <div className="basis-2/12"><img src="https://source.unsplash.com/75x75/?portrait" alt="" className="self-center flex-shrink-0 w-16 h-16 border rounded-full md:justify-self-start " /></div>
                            </div>
                        </div>*/}
                    </div>

                </div>
            </div>
        </>
    )
};