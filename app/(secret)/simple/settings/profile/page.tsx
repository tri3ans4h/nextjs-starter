'use client'
import useUserService from "@/app/_services/useUserService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useContext, useEffect, useState } from "react";

import Image from 'next/image';
import ModalVideo from "@/app/(secret)/components/modal-video";

import VideoThumb from '@/public/modal-video/modal-video-thumb.jpg'
import { SecretContext } from "@/context/secret-context";
import { Icon } from "@iconify/react";
import React from "react";

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

export default function Tab1Page() {
  const router = useRouter()
  const userService = useUserService()
  const [validate, setValidate] = useState(false)
  const [UserProfileItem, SetUserProfileItem] = useState<IUserProfileItem[]>();
  const { state, dispatch } = useContext(SecretContext);
  useEffect(() => {
    (async () => {
      const response = await userService.profile()
      if (response.status == 500) {
        return;
      }
      if (response.status == 401) {
        const validateResponse = await userService.revalidate()
        if (validateResponse.status == 200) {
          setValidate(true)
        }
        return;
      }
      const jsonResponse = await response.json()
      dispatch({
        type: 'setProfile', payload: jsonResponse.UserProfile
      });
      //console.log(jsonResponse)
      SetUserProfileItem(jsonResponse)
    })();
  }, [validate]);


  const hdlChange = () => {
    router.push('./profile/change-profile')
  }
  const hdlChangePhoto = () => {
    router.push('./profile/change-photo')
  }

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);



  const onCancelFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!previewUrl && !file) {
      return;
    }
    setFile(null);
    setPreviewUrl(null);
  };

  const onUploadFile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    try {
      let formData = new FormData();
      formData.append("media", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const {
        data,
        error,
      }: {
        data: {
          url: string | string[];
        } | null;
        error: string | null;
      } = await res.json();

      if (error || !data) {
        alert(error || "Sorry! something went wrong.");
        return;
      }

      console.log("File was uploaded successfylly:", data);
    } catch (error) {
      console.error(error);
      alert("Sorry! something went wrong.");
    }
  };


  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      alert("No file was chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Files list is empty");
      return;
    }

    const file = fileInput.files[0];

    /** File validation */
    if (!file.type.startsWith("image")) {
      alert("Please select a valide image");
      return;
    }

    /** Setting file state */
    setFile(file); // we will use the file state, to send it later to the server
    setPreviewUrl(URL.createObjectURL(file)); // we will use this to show the preview of the image

    /** Reset file input */
    e.currentTarget.type = "text";
    e.currentTarget.type = "file";
  };


  return (
    <>
      <div className="flex-1 flex flex-col ">
        <div className="mb-1 md:mb-3 bg-white  -mx-1 md:mx-0 -mt-2 md:mt-0">
          <div className="flex flex-row align-middle justify-center items-center">
            <div className="flex-0">
              <img src="/icon/personal-information.png" className="w-16" />
            </div>
            <div className="flex-initial w-64 flex flex-col my-6 mx-6" >
              <h3 className="text-xl md:text-2xl py-1">Personal Info</h3>
              <p className="text-xs md:text-sm text-gray-400 py-1">Info about you and your preferences </p>
            </div>
          </div>
        </div>

        <div className="border mb-1 md:mb-3 bg-white">
          <div className="flex flex-col mb-6">
            <div className="flex-col mt-6 py-2 items-center ">
              <div className="mx-6"><h3 className="text-lg py-1">Basic Info</h3>
                <p className=" text-sm text-gray-400 py-1">Informasi Dasar Pengguna</p>
              </div>
            </div>
            <div className="hover:bg-sky-100" onClick={hdlChangePhoto}>
              <div className="flex items-center mx-6 py-4 border-b-2 ">
                <div className="basis-2/12"><span className="text-sm">Picture</span></div>
                <div className="basis-8/12"><span className="text-sm">Gambar Profil Anda</span></div>
                <div className="basis-2/12">
                  {
                    state.user.photo ?
                      <>
                        <Image src={state.user.photo as string} width={100} height={100} alt="" className="self-center flex-shrink-0 w-16 h-16 border rounded-full md:justify-self-start " />
                      </> :
                      <>
                        <Icon icon={"iconoir:profile-circle"} className="self-center flex-shrink-0 w-16 h-16 border rounded-full md:justify-self-start "></Icon>
                      </>
                  }
                  {/*
                     <Image src="https://source.unsplash.com/75x75/?portrait" width={100} height={100} alt="" className="self-center flex-shrink-0 w-16 h-16 border rounded-full md:justify-self-start " />
                      
                  <img src="https://source.unsplash.com/75x75/?portrait" alt="" className="self-center flex-shrink-0 w-16 h-16 border rounded-full md:justify-self-start " />*/}
                </div>

              </div>
            </div>
            <div className="hover:bg-sky-100" onClick={hdlChange}>
              <div className="flex items-center mx-6 py-4 border-b-2 ">
                <div className="basis-2/12"><span className=" text-sm">Name</span></div>
                <div className="basis-8/12">{state.profile?.firstName} {state.profile?.lastName}</div>
                <div className="basis-1/12"></div>
                <div className="basis-1/12">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="hover:bg-sky-100" onClick={hdlChange}>
              <div className="flex items-center mx-6 py-4 border-b-2 ">
                <div className="basis-2/12"><span className=" text-sm">Birth Day</span></div>
                <div className="basis-8/12">{(state.profile?.birthDate instanceof Date ? "yes" : "no")}
                  {/*state.profile.birthDate.toISOString()*/}
                </div>
                <div className="basis-1/12"></div>
                <div className="basis-1/12">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>

            </div>
            <div className="hover:bg-sky-100" onClick={hdlChange}>
              <div className="flex items-center mx-6 py-4 border-b-2 ">
                <div className="basis-2/12"><span className=" text-sm">Gender</span></div>
                <div className="basis-8/12">Male</div>
                <div className="basis-1/12"></div>
                <div className="basis-1/12">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="border mb-1 md:mb-3 bg-white">
          <div className="flex flex-col mb-6">
            <div className="flex-col mt-6 py-2 items-center ">
              <div className="mx-6"><h3 className="text-lg py-1">Contact Info</h3>
                <p className=" text-sm text-gray-400 py-1">Informasi Dasar Pengguna</p>
              </div>
            </div>
            <div className="hover:bg-sky-100" onClick={hdlChange}>
              <div className="flex items-center mx-6 py-4 border-b-2 ">
                <div className="basis-2/12"><span className=" text-sm">Email</span></div>
                <div className="basis-8/12">{state.profile?.email}</div>
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
                <div className="basis-2/12"><span className=" text-sm">Phone</span></div>
                <div className="basis-8/12">{state.profile?.phone}</div>
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
                <div className="basis-2/12"><span className=" text-sm">Alamat</span></div>
                <div className="basis-8/12">{state.profile?.address}</div>
                <div className="basis-1/12"></div>
                <div className="basis-1/12">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="border mb-1 md:mb-3 bg-white">
          <div className="flex flex-col mb-6">

            <div className="flex flex-row mt-6 ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-4 w-20 h-20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>

              <div className="flex-col py-2 items-center ">
                <div className=""><h3 className="text-lg py-1">Password</h3>
                  <p className="text-xs md:text-sm text-gray-400 py-1">Kata sandi yang kuat untuk melindungi akun anda</p>
                </div>
              </div>
            </div>

            <div className="hover:bg-sky-100" onClick={() => { router.push('./profile/change-password') }}>
              <div className="flex items-center mx-6 py-4 border-b-2 ">
                <div className="basis-10/12">
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm">********</span>
                    <span className="text-xs md:text-sm">
                      Last change at {
                        // state.securityUserActivity?.lastChangePassword instanceof Date ?
                        //state.securityUserActivity?.lastChangePassword?.toISOString() : new Date(state.securityUserActivity?.lastChangePassword).toLocaleString() 
                      }
                      {
                        new Date(state.securityUserActivity?.lastChangePassword as unknown as string).toLocaleString()
                      }
                    </span>
                  </div>
                </div>
                <div className="basis-8/12"></div>
                <div className="basis-1/12"></div>
                <div className="basis-1/12">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>




      </div>
      {/* <form
        className="w-full p-3 border border-gray-500 border-dashed"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col md:flex-row gap-1.5 md:py-4">
          <div className="flex-grow">
            {previewUrl ? (
              <div className="mx-auto w-80">
                <Image
                  alt="file uploader preview"
                  objectFit="cover"
                  src={previewUrl}
                  width={320}
                  height={218}
                  layout="fixed"
                />
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-full py-3 transition-colors duration-150 cursor-pointer hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-14 h-14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
                <strong className="text-sm font-medium">
                  Select an image
                </strong>
                <input
                  className="block w-0 h-0"
                  name="file"
                  type="file"
                  onChange={onFileUploadChange}
                />
              </label>
            )}
          </div>
          <div className="flex mt-4 md:mt-0 md:flex-col justify-center gap-1.5">
            <button
              disabled={!previewUrl}
              onClick={onCancelFile}
              className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-gray-700 rounded-sm md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-600"
            >
              Cancel file
            </button>
            <button
              disabled={!previewUrl}
              onClick={onUploadFile}
              className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-gray-700 rounded-sm md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-600"
            >
              Upload file
            </button>
          </div>
        </div>
      </form>

      <ModalVideo
        thumb={VideoThumb}
        thumbWidth={768}
        thumbHeight={432}
        thumbAlt="Modal video thumbnail"
        video="/modal-video/video.mp4"
        videoWidth={1920}
        videoHeight={1080} />
            */}
    </>
  )
};
