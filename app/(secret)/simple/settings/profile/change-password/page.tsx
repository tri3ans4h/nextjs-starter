'use client'
import useUserService from "@/app/_services/useUserService";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PasswordFormInputs, passwordFormSchema } from "./password-form-schema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { SecretContext } from "@/context/secret-context";

import { Icon } from '@iconify/react';

export default function ChangePasswordPage() {
  const router = useRouter()
  const userService = useUserService()
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)
  const [saveMessage, setSaveMessage] = useState<string>("")
  const { state, dispatch } = useContext(SecretContext);
  return (
    <>
      <div className="flex-1 flex flex-col ">
        {/*<div className="mb-6 bg-white">
          <div className="flex flex-col my-6 items-center text-center" >
            <h3 className=" text-2xl py-1">Change Password </h3>
            <p className=" text-sm text-gray-400 py-1">Info about you and your preferences </p>

          </div>
        </div>*/}




        <div className="border mb-6 bg-white">
          <div className="flex flex-row mx-6 align-middle items-center">
            <div className="flex justify-center w-8 h-8 align-middle items-center hover:bg-slate-300 cursor-pointer" onClick={() => { router.back() }}>
              <Icon icon="radix-icons:arrow-left" width="24" height="24" />
            </div>
            <div className="flex-col mt-6 py-2 items-center ">
              <div className="mx-3">
                <h3 className="text-lg py-1">Change Password</h3>
                <p className=" text-sm text-gray-400 py-1">Change your password securely</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col mb-6">
            <Formik<PasswordFormInputs>
              initialValues={{
                currentPassword: "",
                newPassword: "",
                verNewPassword: ""
              }}
              onSubmit={async (values) => {
                setIsSaving(true)
                const response = await userService.changePassword(values)
                switch (response.status) {
                  case 200:
                    setSaveSuccess(true)
                    dispatch({ type: "setSecurityUserActivity", payload: { lastChangePassword: new Date() } })
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
                setIsSaving(false)
              }}
              /*validate={(v) => {
                console.log(v)
              }}*/
              validationSchema={toFormikValidationSchema(passwordFormSchema)}
            >
              {(formikState) => {
                const errors = formikState.errors;
                return (
                  <>
                    <Form>
                      <div className="mx-6 mt-6 md:flex flex-row md:space-x-4 text-xs">
                        <div className="mb-3 space-y-2 w-full text-xs">
                          <label className="font-semibold text-gray-600 py-2">Current Password <abbr title="required">*</abbr></label>
                          <Field
                            type="text"
                            name="currentPassword"
                            placeholder="Current Password" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4" />
                          {errors.currentPassword && (
                            <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                              {errors.currentPassword}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mx-6 mt-6 md:flex flex-row md:space-x-4 text-xs">
                        <div className="mb-3 space-y-2 w-full text-xs">
                          <label className="font-semibold text-gray-600 py-2">New Password <abbr title="required">*</abbr></label>
                          <Field
                            type="text"
                            name="newPassword"
                            placeholder="New Password" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4" />
                          {errors.newPassword && (
                            <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                              {errors.newPassword}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mx-6 mt-6 md:flex flex-row md:space-x-4 text-xs">
                        <div className="mb-3 space-y-2 w-full text-xs">
                          <label className="font-semibold text-gray-600 py-2">Re Type New Password <abbr title="required">*</abbr></label>
                          <Field
                            type="text"
                            name="verNewPassword"
                            placeholder="Retype New Password" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4" />
                          {errors.verNewPassword && (
                            <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                              {errors.verNewPassword}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mx-6 mt-6 md:flex flex-row md:space-x-4 text-xs">
                        <div className="mb-3 space-y-2 w-full text-xs">
                          {/*<button
                            disabled={isSaving}
                          type="submit" className="w-24  py-3 rounded-xl bg-green-400 hover:bg-green-300">Save</button>*/}

                          <button
                            type="submit"
                            disabled={isSaving} className="z-50 mr-2 w-24 py-2 text-white  rounded-md bg-green-400 hover:bg-green-300">Submit</button>
                          <button type="button" onClick={(e) => { e.preventDefault(); router.back() }} className="z-50 mr-2 w-24 py-2 text-white  rounded-md bg-red-400 hover:bg-red-300">Cancel</button>

                        </div>
                      </div>
                      <div className="mx-6 md:flex flex-row md:space-x-4 text-xs">
                        {saveSuccess ? <></> :
                          <>
                            <div className="mt-1 leading-4 text-red-500 text-xs whitespace-pre-wrap">
                              {saveMessage}
                            </div>
                          </>
                        }
                      </div>
                    </Form>
                  </>)
              }}

            </Formik>



          </div>

        </div>

      </div>
    </>
  )
};