'use client'
import useUserService from "@/app/_services/useUserService";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ProfileFormInputs, profileFormSchema } from "./profile-form-schema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { SecretContext } from "@/context/secret-context";

import { Icon } from '@iconify/react';
interface IRole {


}

interface IOrganization {


}


interface IUserToken {


}

interface IUserProfileItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: IRole;
  org: IOrganization;
  user_token: IUserToken[]
}

export default function ChangeProfilePage() {
  const userService = useUserService()
  const [validate, setValidate] = useState(false)
  const [UserProfileItem, SetUserProfileItem] = useState<IUserProfileItem[]>();
  const router = useRouter()

  const { state, dispatch } = useContext(SecretContext);

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAccessError, setAccessError] = useState<boolean>(false)
  const [isServerError, setServerError] = useState<boolean>(false)


  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)
  const [saveMessage, setSaveMessage] = useState<string>("")
  const handleSaveProfile = async (): Promise<void> => {

  }
  return (
    <>
      <div className="flex-1 flex flex-col ">
        {/*<div className="hidden md:flex border mb-1 md:mb-3 bg-white">
          <div className="flex flex-row mx-6 align-middle items-center">
            <div className="flex justify-center w-8 h-8 align-middle items-center hover:bg-slate-300 cursor-pointer" onClick={() => { router.back() }}>
              <Icon icon="radix-icons:arrow-left" width="24" height="24" />
            </div>
            <div className="flex-col mt-6 py-2 items-center ">
              <div className="mx-3">
                <h3 className="text-lg py-1">Change Profile</h3>
                <p className=" text-sm text-gray-400 py-1">Change your personal data</p>
              </div>
            </div>
          </div>
        </div>*/}
        {/*<div className="mb-6 bg-white">
          <div className="flex flex-col my-6 items-center text-center" >
            <h3 className=" text-2xl py-1">Change Profile </h3>
            <p className=" text-sm text-gray-400 py-1">Info about you and your preferences </p>

          </div>
  </div>*/}


        {/*
        <div className="border mb-6 bg-white">
          <div className="flex flex-col mb-6">


            <div className="mx-6 mt-6 md:flex flex-row md:space-x-4 text-xs">
              <div className="mb-3 space-y-2 w-full text-xs">
                <label className="font-semibold text-gray-600 py-2">FULL NAME
                </label>
                <input placeholder="Full name" className="border-b-2 focus:outline-none block w-full bg-grey-lighter text-grey-darker  border-grey-lighter  h-10 " required={true} type="text" name="integration[shop_name]" id="integration_shop_name" />
                <p className="text-red text-xs hidden">Please fill out this field.</p>
              </div>
            </div>

            <div className="mx-6 mt-6 md:flex flex-row md:space-x-4 text-xs">
              <div className="mb-3 space-y-2 w-full text-xs">
                <label className="font-semibold text-gray-600 py-2">BIRTH DAY
                </label>
                <input placeholder="New Password" className="border-b-2 focus:outline-none block w-full bg-grey-lighter text-grey-darker  border-grey-lighter  h-10" required={true} type="text" name="integration[shop_name]" id="integration_shop_name" />
                <p className="text-red text-xs hidden">Please fill out this field.</p>
              </div>
            </div>

            <div className="mx-6 mt-6 md:flex flex-row md:space-x-4 text-xs">
              <div className="mb-3 space-y-2 w-full text-xs">
                <label className="font-semibold text-gray-600 py-2">Re Type New Password <abbr title="required">*</abbr></label>
                <input placeholder="Retype New Password" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4" required={true} type="text" name="integration[shop_name]" id="integration_shop_name" />
                <p className="text-red text-xs hidden">Please fill out this field.</p>
              </div>
            </div>

            <div className="mx-6 mt-6 md:flex flex-row md:space-x-4 text-xs">
              <div className="mb-3 space-y-2 w-full text-xs">
                <button onClick={() => {
                  router.back()
                }} className="w-24  py-3   rounded-xl bg-green-400 hover:bg-green-300">Save</button>
              </div>
            </div>


          </div>

        </div>*/
        }

        <div className="border mb-6 bg-white">
          <div className="flex flex-row mx-6 align-middle items-center">
            <div className="flex justify-center w-8 h-8 align-middle items-center hover:bg-slate-300 cursor-pointer" onClick={() => { router.back() }}>
              <Icon icon="radix-icons:arrow-left" width="24" height="24" />
            </div>
            <div className="flex-col mt-6 py-2 items-center ">
              <div className="mx-3">
                <h3 className="text-lg py-1">Change Profile</h3>
                <p className=" text-sm text-gray-400 py-1">Change your personal data</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mx-6 md:flex flex-row md:space-x-4 text-xs">
              <div className="mt-6 w-full text-xs flex-col">
                <Formik<ProfileFormInputs>
                  initialValues={{
                    firstName: state.profile.firstName,
                    lastName: state.profile.lastName,
                    email: state.profile.email,
                    address: state.profile.address,
                    phone: state.profile.phone,
                    birthDate: state.profile.birthDate
                  }}
                  onSubmit={async (values) => {
                    const response = await userService.updateProfile(state.user.id as unknown as string, {
                      user_id: state.profile.user_id,
                      firstName: values.firstName,
                      lastName: values.lastName,
                      email: values.email,
                      address: values.address,
                      phone: values.phone,
                      birthDate: values.birthDate,
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
                  /*validate={(v) => {
                    console.log(v)
                  }}*/
                  validationSchema={toFormikValidationSchema(profileFormSchema)}
                >
                  {(formikState) => {
                    const errors = formikState.errors;
                    return (
                      <>
                        <Form className="p-2">
                          <div className="relative mb-6">
                            <Field
                              type="text"
                              name="firstName"
                              className="peer w-full border pl-4  border-gray-300 placeholder:text-transparent h-10 focus:outline-sky-500 focus:border-none rounded-md" placeholder="fullname" />
                            <label htmlFor="firstName" className="absolute left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                              FIRST NAME
                            </label>
                            {errors.firstName && (
                              <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                {errors.firstName}
                              </div>
                            )}
                          </div>

                          <div className="relative mb-6">
                            <Field
                              type="text"
                              name="lastName"
                              className="peer w-full border pl-4  border-gray-300 placeholder:text-transparent h-10 focus:outline-sky-500 focus:border-none rounded-md" placeholder="fullname" />
                            <label htmlFor="lastName" className="absolute left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                              LAST NAME
                            </label>
                            {errors.lastName && (
                              <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                {errors.lastName}
                              </div>
                            )}
                          </div>

                          <div className="relative mb-6">
                            <Field
                              type="date"
                              name="birthDate"
                              className="peer w-full border pl-4  border-gray-300 placeholder:text-transparent h-10 focus:outline-sky-500 focus:border-none rounded-md" placeholder="fullname" />
                            <label htmlFor="birthDate" className="absolute left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                              BIRTHDAY
                            </label>
                            {errors.birthDate && (
                              <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                {errors.birthDate as string}
                              </div>
                            )}
                          </div>

                          <div className="relative mb-6">
                            <Field
                              type="text"
                              name="email"
                              className="peer w-full border pl-4  border-gray-300 placeholder:text-transparent h-10 focus:outline-sky-500 focus:border-none rounded-md" placeholder="email" />
                            <label htmlFor="email" className="absolute left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                              EMAIL
                            </label>
                            {errors.email && (
                              <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                {errors.email}
                              </div>
                            )}
                          </div>
                          <div className="relative mb-6">
                            <Field
                              type="text"
                              name="phone"
                              className="peer w-full border pl-4  border-gray-300 placeholder:text-transparent h-10 focus:outline-sky-500 focus:border-none rounded-md" placeholder="phone" />
                            <label htmlFor="phone" className="absolute left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                              PHONE
                            </label>
                            {errors.phone && (
                              <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                {errors.phone}
                              </div>
                            )}
                          </div>
                          <div className="relative mb-6">
                            <Field
                              type="text"
                              name="address"
                              className="peer w-full border pl-4  border-gray-300 placeholder:text-transparent h-10 focus:outline-sky-500 focus:border-none rounded-md" placeholder="address" />
                            <label htmlFor="address" className="absolute left-1 top-2 ml-1 -translate-y-5 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:text-sm  peer-focus:text-sky-600">
                              ADDRESS
                            </label>
                            {errors.address && (
                              <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                {errors.address}
                              </div>
                            )}
                          </div>
                          <div className="flex">
                            <button type="submit" className="z-50 mr-2 w-24 py-2 text-white  rounded-md bg-green-400 hover:bg-green-300">Submit</button>
                            <button type="button" onClick={(e) => { e.preventDefault(); router.back() }} className="z-50 mr-2 w-24 py-2 text-white  rounded-md bg-red-400 hover:bg-red-300">Cancel</button>
                            {/*<button className="p-2 rounded-sm bg-green-500 text-white hover:bg-green-300" type="submit">
                              Submit
                            </button>*/}
                          </div>
                          <div className="md:flex flex-row md:space-x-4 text-xs">
                            {saveSuccess ? <></> :
                              <>
                                <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                                  {saveMessage}
                                </div>
                              </>
                            }
                          </div>
                        </Form>

                      </>
                    )
                  }}
                </Formik>
              </div>
            </div>


            <div className="mx-6 md:flex flex-row md:space-x-4 text-xs">
              {/*
              
               <button type="submit" className="mr-2 w-24 py-3 rounded-xl bg-green-400 hover:bg-green-300"><span className=" text-sm text-stone-700">Save</span></button>

               <div className="mb-3 w-full text-xs">
                <button onClick={() => {
                  // handleSaveProfile()
                }} className="mr-2 w-24 py-3 rounded-xl bg-green-400 hover:bg-green-300"><span className=" text-sm text-stone-700">Save</span></button>

                <button onClick={() => {
                  router.back()
                }} className="mr-2 w-24  py-3 rounded-xl bg-red-400 hover:bg-red-300"><span className=" text-sm text-stone-700">Cancel</span></button>
              </div>

              {saveSuccess ? <></> :
                <>
                  <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                    {saveMessage}
                  </div>
                </>
              }*/}
            </div>
          </div>

        </div>
      </div>


      {/*
                <div className="relative mt-6">
                  <input type="password" className="peer w-full border  border-stone-950 placeholder:text-transparent h-10  focus:outline-none" placeholder="name" />
                  <label htmlFor="email" className="absolute left-1 top-2 ml-1 -translate-y-4 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-4 peer-focus:px-1 peer-focus:text-sm">EMAIL</label>
              </div> */}
      {
  /*    <div className="relative mt-6">
        <input type="password" className="peer w-full border-b placeholder:text-transparent" placeholder="name" />
        <label htmlFor="email" className="absolute left-0 ml-1 -translate-y-3 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:text-sm">PASSWORD</label>
      </div>
      <button className="mt-10 w-full rounded-md bg-slate-600 py-2 px-5 text-white">Submit</button>
*/}

    </>
  )
};