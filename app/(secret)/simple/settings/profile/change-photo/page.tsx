'use client'
import useUserService from "@/app/_services/useUserService";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

import Image from 'next/image';
import { useUpload } from "@/hooks/use-minio";
import useStorageService from "@/app/_services/useStorageService";


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

      console.log(jsonResponse)
      SetUserProfileItem(jsonResponse)
    })();
  }, [validate]);



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


  /*MINIO UPLOAD*/
  const { uploadState, uploadError, uploadProgress, setUploadState, upload } = useUpload();
  const hdlOnSuccess = async (key: string): Promise<void> => {
    console.log(key)
    setUploadState('idle')
    const response = await useStorage.presignedGetObject(file?.name as string)
    //console.log(response.url)
    //const data = await response.json()
    //console.log(data)
    const rchangephoto = await userService.changePhoto(file?.name as string)
    setpresignedGetObject_URL(response.url)
    //onsuccess save to db
  }

  const [presignedGetObject_URL, setpresignedGetObject_URL] = useState<string>("")
  const useStorage = useStorageService();
  return (
    <>
      <div className="flex-1 flex flex-col ">
        <div className="mb-6 bg-white">
          <div className="flex flex-col my-6 items-center text-center" >
            <h3 className=" text-2xl py-1">Change Photo</h3>
            <p className=" text-sm text-gray-400 py-1">Info about you and your preferences </p>

          </div>
        </div>
        <div className="border mb-6 bg-white">
          <div className="flex flex-col mb-6">
            <div className="hover:bg-sky-100" >
              <div className="flex items-center mx-6 py-4 mb-6">
                <form
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
                        className="w-1/2 px-4 py-2 text-sm font-normal text-white transition-colors duration-300 bg-red-700 rounded-md md:w-auto md:text-base disabled:bg-red-400 hover:bg-red-600"
                      >
                        Cancel file
                      </button>
                      <button
                        disabled={!previewUrl}
                        //onClick={onUploadFile}
                        onClick={() => upload(
                          file as File, async (uploadKey) => await hdlOnSuccess(uploadKey)
                        )}
                        className=" w-1/2 px-4 py-2 text-sm font-normal text-white transition-colors duration-300 bg-green-700 rounded-md md:w-auto md:text-base disabled:bg-green-400 hover:bg-green-600"
                      >
                        Upload file
                      </button>
                    </div>


                    {/*<button
                            type="submit"
                            disabled={isSaving} className="z-50 mr-2 w-24 py-2 text-white  rounded-md bg-green-400 hover:bg-green-300">Submit</button>
                          <button type="button" onClick={(e) => { e.preventDefault(); router.back() }} className="z-50 mr-2 w-24 py-2 text-white  rounded-md bg-red-400 hover:bg-red-300">Cancel</button>
                        */}
                  </div>

                </form>


              </div>
            </div>
            {
              uploadProgress > 0 ?
                < div className="mx-6 md:flex flex-row md:space-x-4 mb-3">
                  <div className="flex md:space-x-4  h-4 w-full  bg-neutral-200 ">
                    {/*uploadState*/}
                    <div className="h-4 bg-amber-400" style={{
                      width: uploadProgress.toPrecision(2) + "%",
                    }} >
                    </div>
                  </div>
                </div> : <></>

            }
            <div className="mx-6 md:flex flex-row md:space-x-4 text-xs">


              {/*<div className="mb-3 w-full text-xs">
                <button onClick={() => {
                  router.back()
                }} className="mr-2 w-24 py-3 rounded-xl bg-green-400 hover:bg-green-300"><span className=" text-sm text-stone-700">Save</span></button>

                <button onClick={() => {
                  router.back()
                }} className="mr-2 w-24  py-3 rounded-xl bg-red-400 hover:bg-red-300"><span className=" text-sm text-stone-700">Cancel</span></button>
              </div>*/}
            </div>
          </div>

        </div>
        {
          /*presignedGetObject_URL ? <>
            <img height="auto" width="auto" src={presignedGetObject_URL}></img>
          </> : <></>*/
        }


      </div >


    </>
  )
};