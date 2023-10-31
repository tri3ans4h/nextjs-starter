'use client'
import useUserService from "@/app/_services/useUserService";
import { SecretContext } from "@/context/secret-context";
import React from "react";
import { useContext, useState, useEffect } from "react";

import { TypeOf, object, string } from "zod";
import { Formik, Form, Field } from "formik";

import { toFormikValidationSchema } from "zod-formik-adapter";

import { Icon } from '@iconify/react';
import { useRouter } from "next/navigation";
import Link from "next/link";
interface IUserItem {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}


/*SCHEMA*/

const contactFormSchema = object({
    // defines a required field called name
    name: string({
        required_error: "Please enter your name",
    }),
    // defines a required field called email.
    // we use the built-in email validator from zod
    email: string().email("Please enter a valid email"),
    // defines a required field called message with length constraints of 150-1000 characters.
    message: string().min(150).max(1000),
});


type ContactFormInputs = TypeOf<typeof contactFormSchema>;


export default function RemUserPage({ params }: { params: { id: string } }) {

    const { state, dispatch } = useContext(SecretContext);
    const [usersData, SetUsersData] = useState<any>();
    const [validate, setValidate] = useState(false)
    const router = useRouter()
    const userService = useUserService()

    const [actionSuccess, setActionSuccess] = useState<boolean>(false)
    const [actionMessage, setActionMessage] = useState<string>("")

    const handleOnRemove = async (params: any) => {
        const response = await userService.delete(params.id)

        switch (response.status) {
            case 200:
                router.back()
                break;
            case 500:
                setActionSuccess(false)
                setActionMessage("Server error")
                break;
            default:
                const data = await response.json()
                setActionSuccess(false)
                setActionMessage(data.message)
                break;
        }


    };


    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isAccessError, setAccessError] = useState<boolean>(false)
    const [isServerError, setServerError] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            const response = await userService.getById(params.id)
            if (response.status == 500) {
                setIsLoading(false)
                setServerError(true)
                return;
            }
            if (response.status == 401) {
                const validateResponse = await userService.revalidate()
                if (validateResponse.status == 200) {
                    setValidate(true)
                }
                setIsLoading(false)
                return;
            }
            if (response.status == 403) {
                setAccessError(true)
                setIsLoading(false)
                return
            }
            if (response.status == 200) {
                const jsonResponse = await response.json()
                SetUsersData(jsonResponse)
                setIsLoading(false)
                return
            }
        })();
    }, []);


    if (isLoading) {
        return <>
            <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-slate-700 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                                <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-slate-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }

    if (isAccessError) {
        return <>
            <div className="flex-row bg-white flex flex-grow justify-center items-center">
                <Icon color="red" icon="solar:forbidden-circle-broken" width="48" height="48" />
                <div className="flex flex-col mx-3">
                    <h1>Forbidden</h1>
                    <p className="text-sm text-gray-600">You cannot access this page</p>
                    <Link className="text-sm" href="/simple/user">Back to User</Link>
                </div>
            </div>
        </>
    }
    if (isServerError) {
        return <>
            <div className="flex-row bg-white flex flex-grow justify-center items-center">
                <Icon color="red" icon="solar:forbidden-circle-broken" width="48" height="48" />
                <div className="flex flex-col mx-3">
                    <h1>Server Error</h1>
                    <p className="text-sm text-gray-600">Server Error, Fetch data failed</p>
                    <Link className="text-sm" href="/simple/user">Back to User</Link>
                </div>
            </div>
        </>
    }


    return <>
        <div className="flex-1 flex-col flex">
            <div className="border mb-6 bg-white ">
                <div className="flex flex-row mx-6 align-middle items-center">
                    <div className="flex justify-center w-8 h-8 align-middle items-center hover:bg-slate-300 cursor-pointer" onClick={() => { router.back() }}>
                        <Icon icon="radix-icons:arrow-left" width="24" height="24" />
                    </div>
                    <div className="flex-col mt-6 py-2 items-center ">
                        <div className="mx-3">
                            <h3 className="text-lg py-1">Remove User </h3>
                            <p className=" text-sm text-gray-400 py-1">Review user before delete it, your data will be deleted and can't be recovered </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mb-6">
                    <div className="flex-col py-2 items-center ">
                        <div className="relative overflow-x-auto mx-16">

                            <div className="flex flex-row text-md mb-2">
                                <label className="flex-none font-bold w-24">Username</label>
                                <label className="flex-none w-4 text-end mx-1">:</label>
                                <label className="flex-1 w-24">{usersData.email}</label>
                            </div>

                            <div className="flex flex-row text-md mb-2">
                                <label className="flex-none font-bold w-24">Name</label>
                                <label className="flex-none w-4 text-end mx-1">:</label>
                                <label className="flex-1 w-24">{usersData.first_name}</label>
                            </div>
                            <div className="flex flex-row text-md mb-2">
                                <label className="flex-none font-bold w-24">Role</label>
                                <label className="flex-none w-4 text-end mx-1">:</label>
                                <label className="flex-1 w-24">{usersData.role?.name}</label>
                            </div>
                            <div className="flex flex-row text-md mb-2">
                                <label className="flex-none font-bold w-24">Organization</label>
                                <label className="flex-none w-4 text-end mx-1">:</label>
                                <label className="flex-1 w-24">{usersData.org?.name}</label>
                            </div>
                            <div className="flex flex-row text-md mb-2">
                                <label className="flex-none font-bold w-24"></label>
                                <label className="flex-none w-4 text-end mx-1"></label>
                                <label className="flex-1 w-24">
                                    <div className="flex flex-col">
                                        <button onClick={() => { handleOnRemove(params) }} className="w-24 p-2 h-8 text-xs rounded-sm bg-red-500 text-white hover:bg-red-300" type="submit">
                                            remove it
                                        </button>
                                        {actionSuccess ? <></> : <>
                                            <label className="">
                                                <span className="text-red-500 text-xs">
                                                    {actionMessage}
                                                </span>
                                            </label></>}
                                    </div>
                                </label>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>

}