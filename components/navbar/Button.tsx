'use client'
import useUserService from "@/app/_services/useUserService";
import { SecretContext } from "@/context/secret-context";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const Button = () => {
  const userService = useUserService();
  const { state, dispatch } = useContext(SecretContext);
  const router = useRouter()
  const hdlLogout = async (e: any) => {
    e.preventDefault();
    localStorage.clear()
    dispatch({ type: 'setLogin', payload: false });

    await userService.logout()
    router.push('/login')
  }


  return (
    <>
      {
        state.isLogin ?
          <>
            <button onClick={hdlLogout} className="h-12 rounded-lg bg-white font-bold px-5">Sign Out</button>
          </> :
          <>
            <button onClick={() => router.push('/login')} className="h-12 rounded-lg bg-white font-bold px-5">Sign In</button>
          </>
      }

    </>
  );
};

export default Button;