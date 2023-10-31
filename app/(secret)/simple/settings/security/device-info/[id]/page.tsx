"use client"

import useUserService from "@/app/_services/useUserService";
import React, { useContext, useEffect, useMemo, useState } from "react"
import { Icon } from '@iconify/react';
import { useRouter } from "next/navigation";

import Image from "next/image";
import SamsungImage from "public/samsung.png"
import MyMap from "@/app/(secret)/components/map";
import dynamic from "next/dynamic";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { SecretContext } from "@/context/secret-context";
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
    const [activeDevice, setActiveDevice] = useState<any>({});
    const router = useRouter()
    const [activityDevice, setActivityDevice] = useState<any[]>([]);
    const { state, dispatch } = useContext(SecretContext);
    const MapWithNoSSR = dynamic(() => import("./../../../../../components/map"), {
        ssr: false
    });

    useEffect(() => {
        (async () => {
            const RES_activeDevice = await userService.activeDeviceInfo(decodeURI(params.id))
            if (RES_activeDevice.status == 500) {
                return;
            }
            const data = await RES_activeDevice.json()
            if (data != null) {
                const tmp = new Date(data.created_at)
                data.created_at_str = tmp.toLocaleString()
            }
            setActiveDevice(data)

            /*setActivityDevice([
                { "id": 1, "activity": "login", "date": "24 October 2023" },
                { "id": 1, "activity": "change password", "date": "16 October 2023" }
            ])*/

        })();
    }, []);
    useEffect(() => {
        if (state.userActivity)
            setActivityDevice(state.userActivity)

    }, [state.userActivity])

    const hdlClickDevice = (item: any): any => {
        router.push('/simple/settings/security/device-info/' + item.deviceUniqueID)
    }

    const hdlRemoveDevice = async (activeDevice: any) => {
        // router.push('/simple/settings/security/device-info/' + item.deviceUniqueID)
        const response = await userService.removeDevice(activeDevice.deviceUniqueID)
        const data = await response.json()
        if (data.count == 1) {
            //alert("success")
            //setActiveDevice(null)
            router.back()
        }
    }
    return (
        <>
            <div className="flex-1 flex-col flex">
                <div className="hidden mb-6 bg-white">
                    <div className="flex flex-col my-6 items-center text-center" >
                        <h3 className=" text-2xl py-1">Device Information</h3>
                        <p className=" text-sm text-gray-400 py-1">Your detail device information</p>
                        {

                            /*
                        
                                                            style={{
                                                                width: '100px',
                                                                height: 'auto',
                                                            }}
                            */
                        }
                    </div>
                </div>
                <div className="border mb-6 bg-white">
                    <div className="flex flex-row mx-6 align-middle items-center">
                        <div className="flex justify-center w-8 h-8 align-middle items-center hover:bg-slate-300 cursor-pointer" onClick={() => { router.back() }}>
                            <Icon icon="radix-icons:arrow-left" width="24" height="24" />
                        </div>
                        <div className="flex-col mt-6 py-2 items-center ">
                            <div className="mx-3">
                                <h3 className="text-lg py-1">Devices Information</h3>
                                <p className=" text-sm text-gray-400 py-1">Your device information and activities</p>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    activeDevice != null ?
                        <>
                            <div className="flex flex-wrap md:flex-row-reverse">
                                <div className="w-full border mb-3 p-3 bg-white flex-1">
                                    <div className="flex flex-row py-4">
                                        <div className="flex justify-center w-16 flex-shrink-0">
                                            <Image
                                                src={SamsungImage}
                                                sizes="100vh"
                                                className="w-auto h-auto"
                                                alt={"Phone Images"} />
                                        </div>

                                        <div className="flex flex-col mx-3">
                                            <h1 className="text-lg md:text-2xl">{activeDevice.uaOSName}</h1>
                                            <span className=" text-sm text-neutral-600">Login pertama kali : {activeDevice?.created_at_str} </span>
                                            <span className=" text-sm text-neutral-600">Brower {activeDevice.uaBrowserName}</span>
                                            <button onClick={() => { hdlRemoveDevice(activeDevice) }} className="mr-2 mt-2 w-24 py-1 rounded-sm bg-red-400 hover:bg-red-300">
                                                <span className="text-white  text-sm ">Sign Out</span>
                                            </button>

                                        </div>
                                    </div>

                                </div>

                                <div className="w-full border mb-3 mr-0 sm:mr-3 p-3 bg-white md:flex-none lg:w-96 md:w-48 flex-shrink-0">
                                    <div className="flex-shrink-0 h-40 w-auto">
                                        <MapWithNoSSR position={[37.56, 126.97]} zoom={13} />
                                    </div>
                                </div>

                            </div>
                        </>
                        :
                        <>
                        </>
                }

                {
                    activityDevice != null ?
                        <>
                            <div className="border mb-3 bg-white">
                                <div className="mx-6 py-2">
                                    <h1>Activity</h1>
                                    <div className="border-b py-1 mb-2"></div>
                                    {React.Children.toArray(
                                        activityDevice?.map((data, index) => (
                                            <>
                                                <p className="text-xs py-1 text-gray-500">{data.activity} at {new Date(data.created_at).toLocaleString()}</p>
                                            </>
                                        )))}
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="border mb-3 bg-white">
                                <div className="mx-6 py-2">
                                    No Activity Found
                                </div>
                            </div>
                        </>
                }

                { //style 1
                    activeDevice == 'hello' ?
                        <>
                            <div className="border mb-3 bg-white">
                                <div className="flex flex-col ">
                                    <div className="mx-6 py-2">
                                        <div className="flex flex-row py-4">
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={SamsungImage}
                                                    sizes="100vh"
                                                    className="w-auto h-auto"
                                                    alt={"Phone Images"} />
                                            </div>
                                            <div className="flex flex-col ml-8">
                                                <h1 className="text-lg md:text-2xl">{activeDevice.uaOSName}</h1>
                                                <span className=" text-sm text-neutral-600">Login pertama kali : {activeDevice?.created_at_str} </span>
                                                <span className=" text-sm text-neutral-600">Brower {activeDevice.uaBrowserName}</span>
                                                <button onClick={() => { hdlRemoveDevice(activeDevice) }} className="mr-2 mt-2 w-24 py-1 rounded-sm bg-red-400 hover:bg-red-300">
                                                    <span className="text-white  text-sm ">Sign Out</span>
                                                </button>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {/*h-[20rem]*/}
                            <div className="flex flex-wrap ">
                                <div className="w-full border mb-3 bg-white md:flex-1 md:mr-3">
                                    <div className="flex flex-col mx-6 py-2">
                                        <h3 className="py-2">Activity</h3>
                                        <div className="border-b"></div>
                                        <p className="text-xs py-2">Last login : 10 Oktober 2023</p>
                                    </div>
                                </div>
                                <div className="w-full border mb-3 bg-white md:flex-1">
                                    <div className="flex flex-col mx-6 py-2">
                                        <h3 className="py-2">Location</h3>
                                        <div className="border-b"></div>
                                        <div className="h-48 border-spacing-3 ">
                                            <MapWithNoSSR position={[37.56, 126.97]} zoom={13} />
                                        </div>
                                    </div>
                                </div>
                                {/* h-[calc(100%+2rem)]<div className="flex-1 w-full border mb-3 bg-white mr-3">
                                    <div className="flex flex-col ">
                                        <div className="mx-6 py-2">
                                            <h3>Activity</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 w-full border mb-3 bg-white">
                                    <div className="flex flex-col ">
                                        <div className="mx-6 py-2">
                                            <h3>Activity</h3>
                                        </div>
                                    </div>
                </div>*/}
                            </div>

                        </> :
                        <>
                            {
                                /*<div className="border mb-3 bg-white">
                                    <div className="mx-6 py-2">
                                        Device Not Found
                                    </div>
                                </div>*/
                            }
                        </>
                }


            </div>
        </>
    )
};