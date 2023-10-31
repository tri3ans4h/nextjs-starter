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
import { UserFormInputs, userFormSchema } from "../../_schema/user-form-schema";
interface IUserItem {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}


/*SCHEMA*/
/*
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
*/

export default function ModUserPage({ params }: { params: { id: string } }) {

    const { state, dispatch } = useContext(SecretContext);
    // const [usersData, SetUsersData] = useState<IUserItem[]>();
    const [validate, setValidate] = useState(false)
    const router = useRouter()
    const userService = useUserService()
    const [usersData, SetUsersData] = useState<any>();


    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isAccessError, setAccessError] = useState<boolean>(false)
    const [isServerError, setServerError] = useState<boolean>(false)


    const [saveSuccess, setSaveSuccess] = useState<boolean>(false)
    const [saveMessage, setSaveMessage] = useState<string>("")

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

        </>
    }

    if (isAccessError) {
        return <>
            <div className="flex-row bg-white flex flex-grow justify-center items-center">
                <Icon color="red" icon="solar:forbidden-circle-broken" width="48" height="48" />
                <div className="flex flex-col mx-3">
                    <h1>Forbidden</h1>
                    <p className="text-sm text-gray-600">You cannot access this page</p>
                    {/*<a className="text-sm cursor-pointer" onClick={() => { router.back() }} >Back to Home</a> */}
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
                    {/*<a className="text-sm cursor-pointer" onClick={() => { router.back() }} >Back to Home</a>*/}
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
                            <h3 className="text-lg py-1">Modify User</h3>
                            <p className=" text-sm text-gray-400 py-1">Modify existing user </p>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col mb-6">
                    <div className="flex-col py-2 items-center ">
                        <div className="relative overflow-x-auto mx-6">

                            {
                                <>
                                    <Formik<UserFormInputs>
                                        initialValues={{
                                            name: usersData.first_name,
                                            email: usersData.email,
                                            role: usersData.role_id,
                                            org: usersData.org_id,
                                            password: "",
                                            ver_password: ""
                                        }}
                                        onSubmit={async (values) => {
                                            // call api
                                            const response = await userService.update(params.id, {
                                                firstName: values.name,
                                                lastName: "",
                                                username: values.email,
                                                password: values.password,
                                                role_id: Number(values.role),
                                                org_id: Number(values.org)
                                            })
                                            switch (response.status) {
                                                case 200:
                                                    setSaveSuccess(true)
                                                    router.back()
                                                    break;
                                                case 500:
                                                    setSaveSuccess(false)
                                                    setSaveMessage("Server error")
                                                    break;
                                                default:
                                                    const data = await response.json()
                                                    setSaveSuccess(false)
                                                    setSaveMessage(data.message)
                                                    break;
                                            }
                                        }}
                                        validationSchema={toFormikValidationSchema(userFormSchema)}
                                    >
                                        {(formikState) => {
                                            const errors = formikState.errors;
                                            return (
                                                <Form className="p-2">
                                                    {/* use the Field component instead of input we leave all props as is */}
                                                    {/* note that the name property should match the formik initialValues */}
                                                    {/* use as property to transform the field into a textarea */}
                                                    <div className="relative mb-4 ">
                                                        <Field
                                                            type="text"
                                                            name="name"
                                                            className="peer w-full border pl-4  border-gray-300 placeholder:text-transparent h-10 focus:outline-sky-500 focus:border-none rounded-md text-sm"
                                                            placeholder="name" />
                                                        <label htmlFor="name" className="absolute z-50 left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                                                            Name
                                                        </label>
                                                        {errors.name && (
                                                            <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                                                {errors.name}
                                                            </div>
                                                        )}
                                                    </div>


                                                    <div className="relative mb-4">
                                                        <Field
                                                            type="text"
                                                            name="email"
                                                            className="peer w-full border pl-4  border-gray-300 placeholder:text-transparent h-10 focus:outline-sky-500 focus:border-none rounded-md text-sm"
                                                            placeholder="email" />
                                                        <label htmlFor="email" className="absolute z-50 left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                                                            Email
                                                        </label>
                                                        {errors.email && (
                                                            <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                                                {errors.email}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="relative mb-4">
                                                        <Field
                                                            type="password"
                                                            name="password"
                                                            className="peer  w-full border pl-4 border-gray-300 placeholder:text-transparent h-10 focus:outline-sky-500 focus:border-none rounded-md text-sm"
                                                            placeholder="password" />
                                                        <label htmlFor="password" className="absolute z-50 left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                                                            Password
                                                        </label>

                                                        {errors.password && (
                                                            <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                                                {errors.password}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="relative mb-4">
                                                        <Field
                                                            type="password"
                                                            name="ver_password"
                                                            className="peer w-full border pl-4  border-gray-300 placeholder:text-transparent h-10 focus:outline-sky-500 focus:border-none rounded-md text-sm"
                                                            placeholder="ver_password" />
                                                        <label htmlFor="ver_password" className="absolute z-50 left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                                                            Verify Password
                                                        </label>
                                                        {errors.ver_password && (
                                                            <>
                                                                <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                                                    {errors.ver_password}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="relative mb-4 ">
                                                        <Field
                                                            as="select"
                                                            name="role"
                                                            className="peer w-full border pl-4 bg-white  border-gray-300 placeholder:text-transparent h-10 focus:outline-sky-500 focus:border-none rounded-md text-sm"
                                                            placeholder="role" >
                                                            <option value={1}>Super Admin</option>
                                                            <option value={2}>Admin</option>
                                                            <option value={3}>User</option>
                                                        </Field>
                                                        <label htmlFor="name" className="absolute z-50 left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                                                            Role
                                                        </label>
                                                        {errors.role && (
                                                            <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                                                {errors.role}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="relative mb-4 ">
                                                        <Field
                                                            as="select"
                                                            name="org"
                                                            className="peer w-full border pl-4 bg-white  border-gray-300 placeholder:text-transparent h-10 focus:outline-sky-500 focus:border-none rounded-md text-sm"
                                                            placeholder="organization" >
                                                            <option value={1}>Orgz 1</option>
                                                            <option value={2}>Orgz 2</option>
                                                            <option value={3}>Orgz 3</option>
                                                        </Field>
                                                        <label htmlFor="name" className="absolute z-50 left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                                                            Organizaton
                                                        </label>
                                                        {errors.org && (
                                                            <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                                                {errors.org}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/*<div className="relative mb-4 hidden">
                                                        <Field
                                                            as="textarea"
                                                            type="text"
                                                            name="message"
                                                            className="peer w-full border pl-4 pt-2 pr-2 pb-2  border-gray-300 placeholder:text-transparent focus:outline-sky-500 focus:border-none rounded-md h-24 text-sm"
                                                            placeholder="message" />


                                                        <label htmlFor="message" className="absolute z-50 left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                                                            Message
                                                        </label>
                                                        {errors.message && (
                                                            <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                                                {errors.message}
                                                            </div>
                                                        )}
                                                        </div>*/}
                                                    <div className="flex">
                                                        <button className="p-2 rounded-sm bg-green-500 text-white hover:bg-green-300" type="submit">
                                                            Submit
                                                        </button>
                                                    </div>
                                                    {saveSuccess ? <></> :
                                                        <>
                                                            <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                                                {saveMessage}
                                                            </div>
                                                        </>
                                                    }
                                                </Form>
                                            );
                                        }}
                                    </Formik>

                                </>
                            }


                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>

}