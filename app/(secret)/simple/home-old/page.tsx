
'use client'

import { useContext } from "react";
import Tabs from "../../components/tabs";
import { SecretContext } from "@/context/secret-context";

export default function Home() {
    const { state, dispatch } = useContext(SecretContext);
    return (
        <>
            <div className="flex-1 flex flex-col ">
                <div className="mb-6 bg-white">
                    <div className="flex flex-col my-6 items-center text-center" >
                        <img src="https://source.unsplash.com/75x75/?portrait" alt="" className="self-center flex-shrink-0 w-16 h-16 border rounded-full md:justify-self-start " />
                        <h3 className=" text-2xl py-1">Selamat Datang {state.user.name}</h3>
                        <p className=" text-sm text-gray-400 py-1">Info about you and your preferences </p>

                    </div>
                </div>
            </div>
        </>
    );

}
