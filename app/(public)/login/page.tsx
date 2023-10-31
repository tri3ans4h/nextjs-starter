'use client'

import useUserService from "@/app/_services/useUserService";
import { SecretContext } from "@/context/secret-context";
import Link from "next/link";
import { useContext, useState } from "react";
import { Icon } from '@iconify/react';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Login() {
    const userService = useUserService();

    const [user, setUser] = useState<string>('admin01@mail.com')
    const [pwd, setPwd] = useState<string>('123456')
    const [LoginProgress, SetLoginProgress] = useState<boolean>(false);
    const { state, dispatch } = useContext(SecretContext);
    const router = useRouter()
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (LoginProgress == true) {
            return
        }
        if (user == '' && pwd == '') {
            return
        }
        const response = await userService.login(user, pwd)
        SetLoginProgress(false)
        //response with code 2XX, 4XX contain data json
        if (response.status == 200) {
            toast.success("Login success");
            return
        }
        if (response.status == 401) {
            const jsonResp = await response.json()
            toast.error("Login gagal : " + jsonResp.message);
            return
        }
        //response with code 500, 
        //sometime error in network, that cannot parse response
        //try parse
        try {
            const jsonResp = await response.json()
            toast.error("Login gagal : " + jsonResp.message);
        } catch (error) {
            //return original
            toast.error("Login gagal : " + response.message);
        }
        return


        /*
        if (response.status == 500) {
            toast.error(response.message);
            return
        }
        toast.warning("Login gagal status " + response.message);
        if (response.status == 401) {
            toast.warning("Login gagal status " + response.message);
            return
        }

        if (response.status == 200) {
            toast.success("Login success");
            router.push('/simple')
            return
        }*/
    }
    return (
        <>
            <div className="h-screen flex flex-row justify-center text-[#34364A]  ">
                <div className="hidden w-7/12 bg-[url('/natural-grass-close-up.jpg')] bg-cover  text-white md:flex md:flex-col justify-between font-sans">
                    <div className="px-8 pt-8">
                        <h2 className="text-3xl"><i className="material-icons text-sm[36px]" >map</i>TRAVELLING</h2>
                    </div>
                    <div className="bg-gradient-to-t from-black pl-8 pb-8 pr-[25%]">
                        <p className="text-6xl mb-6 font-medium leading-[75px] tracking-wide">TIME TO TRAVEL THE WORLD</p>
                        <p className="text-md text-slate-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Non dignissimos nam optio eius delectus possimus nostrum dolores amet maiores corporis!</p>
                    </div>
                </div>

                <div className="w-full md:w-5/12  flex flex-col justify-center items-center">
                    <h1 className="text-center mb-8 text-3xl font-bold"><span className="text-xl">Welcome Back! </span><br />Journey Begins Here</h1>
                    <div id="Forms" className="flex flex-col gap-y-6 text-center w-7/12">
                        <form className="text-left font-medium flex flex-col gap-[16px]" >
                            <div className="flex flex-col">
                                <label className="mb-2" htmlFor="email">Email</label>
                                <input
                                    onChange={(e) => setUser(e.target.value)}
                                    value={user}

                                    type="email" id="email" className="border rounded-md border-gray-400 hover:border-black focus:border-black p-[8px_10px]" name="email" placeholder="Enter your email" required />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2" htmlFor="password">Password</label>
                                <div className="relative">
                                    <input
                                        onChange={(e) => setPwd(e.target.value)}
                                        value={pwd}
                                        type="password" id="password" className="border rounded-md border-gray-400 hover:border-black focus:border-black p-[8px_10px] w-full" name="password" placeholder="Enter your password" required />
                                    {/*<i className="material-icons absolute top-[33%] right-[15px] text-sm/[17px]" >visibility</i>*/}

                                    <Icon icon="material-symbols:visibility" className="material-icons absolute top-[25%] right-[15px] text-sm/[17px]" width="24" height="24"></Icon>

                                </div>
                            </div>

                            <button onClick={handleSubmit}
                                type="submit" className="text-center text-white p-[8px_10px] w-full bg-blue-700 rounded-md">Login</button>
                        </form>
                        <div>or</div>
                        <a href="#" className="border rounded border-gray-400 hover:border-black focus:border-black p-[8px_10px]"><img src="ic_google.svg" alt="google" className="inline mr-[6px]" width="18px" /> Sign-in with Google</a>
                        <div>
                            <p>Don't have an account? <a href="#" className="text-blue-700">Register here</a></p>
                        </div>
                    </div>
                </div>
                {/*<Link href={"/"}>Back to Home</Link>*/}
            </div>
        </>
    );

}
