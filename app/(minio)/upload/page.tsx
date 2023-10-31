'use client'

import useUserService from "@/app/_services/useUserService";
import { SecretContext } from "@/context/secret-context";
import { useUpload } from "@/hooks/use-minio";
import Link from "next/link";
import { useContext, useState } from "react";

export default function Upload() {
    const { uploadState, uploadError, uploadProgress, upload } = useUpload();

    const [fileUpload, setFileUpload] = useState<any>()
    const handleChange = (e: any): void => {
        // const files = Array.from(e.target.files)
        const files = e.target.files[0]
        console.log("files:", files)
        setFileUpload(files)
    }

    const hdlOnSuccess = async (key: string): Promise<void> => {
        console.log(key)
    }
    return (
        <>

            <div className="flex-1 flex flex-col ">
                <div className="mb-6 bg-white">
                    <div className="flex flex-col my-6 items-center text-center" >
                        <img src="https://source.unsplash.com/75x75/?portrait" alt="" className="self-center flex-shrink-0 w-16 h-16 border rounded-full md:justify-self-start " />
                        <h3 className=" text-2xl py-1">Selamat Datang Apri Triansah</h3>

                        <div className="mt-10">
                            <input type="file" id="selector" onChange={handleChange} />
                            <button className=" bg-green-500 h-8 w-24" onClick={() => upload(
                                fileUpload as File, async (uploadKey) => await hdlOnSuccess(uploadKey)
                            )}>Upload</button >
                            <br />
                            State :  {uploadState} <br />
                            Progress {uploadProgress} <br />
                            <br />
                            <div className="h-4 w-full bg-neutral-200 ">
                                <div className="h-4 bg-amber-400" style={{
                                    width: uploadProgress.toPrecision(2) + "%",
                                }} >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

}
