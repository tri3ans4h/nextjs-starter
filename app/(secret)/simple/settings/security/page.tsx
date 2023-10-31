"use client"

import useUserService from "@/app/_services/useUserService";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"



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

interface IUserDeviceItem {
    uaOSName: string
}


export default function SecurityPage() {

    const router = useRouter()
    const userService = useUserService()

    const [activeDevice, setActiveDevice] = useState<any[]>([]);
    useEffect(() => {
        (async () => {
            //strategi refresh token & check validation
            const RES_activeDevice = await userService.activeDeviceSummary()
            if (RES_activeDevice.status == 500) {
                return;
            }
            const data = await RES_activeDevice.json()
            setActiveDevice(data)
        })();
    }, []);




    const hdlClickDevice = (item: IUserDeviceItem): any => {
        router.push('./security/devices/' + item.uaOSName)
    }


    const hdlSignOutAllDevice = async () => {
        const response = await userService.removeAllDevice()
    }
    return (
        <>
            <div className="flex-1 flex-col flex">
                <div className="mb-1 md:mb-3 bg-white -mx-1 md:mx-0 -mt-2 md:mt-0">
                    <div className="flex flex-row align-middle justify-center items-center">
                        <div className="flex-0">
                            <img src="/icon/cyber-security.png" className="w-16" />
                        </div>
                        {/*<div className="flex flex-col my-3 mx-3 md:my-6" >*/}
                        <div className="flex-initial w-64 md:w-4/6 flex flex-col my-6 mx-6" >
                            <h3 className="text-xl md:text-2xl py-1">Security</h3>
                            <p className="text-xs md:text-sm text-gray-400 py-1">Settings and recommendations to help you keep your account secure</p>
                        </div>
                    </div>
                </div>
                <div className="border mb-6 bg-white">
                    <div className="flex flex-col mb-6">
                        <div className="flex-col mt-6 py-2 items-center ">
                            <div className="mx-6"><h3 className="text-lg py-1">Your devices</h3>
                                <p className=" text-sm text-gray-400 py-1">Where you're signed in</p>
                            </div>
                        </div>

                        {React.Children.toArray(
                            activeDevice?.map((item, index) => (
                                <>
                                    <div className="hover:bg-sky-100" onClick={() => hdlClickDevice(item as unknown as IUserDeviceItem)}>
                                        <div className="flex items-center mx-6 py-4 border-b-2 ">
                                            <div className="flex-none w-14">

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
                                            <div className="flex-1 w-24"><span className="text-sm">{item._count.uaOSName} Sesi pada {item.uaOSName} </span></div>

                                            <div className="flex-none w-14">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div >
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

                    <div className="flex flex-col mb-6">
                        <div className="flex-col py-2 items-center ">
                            <div className="mx-6">
                                <button onClick={() => hdlSignOutAllDevice()} className="z-50 mr-2 w-48 py-2 text-white  rounded-md bg-red-400 hover:bg-red-300">
                                    <span className=" text-sm ">Sign Out All Devices</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
};