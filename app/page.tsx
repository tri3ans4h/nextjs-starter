"use client"

import Navigation from "@/components";
import { useContext, useEffect } from "react";
import useUserService from "./_services/useUserService";
import { SecretContext } from "@/context/secret-context";
import { useRouter } from "next/navigation";

/**
 * 
 * Default Home Page, check me, 
 */
export default function Home() {
  const userService = useUserService();
  const { state, dispatch } = useContext(SecretContext);
  const router = useRouter()
  useEffect(() => {
    (async () => {
      /* const response = await userService.me()
       if (response.status == 401) {
         dispatch({ type: 'set-user', payload: { id: response.id, name: response.first_name } });
         dispatch({ type: 'setLogin', payload: false });
         router.push('/login')
         return
       }
       if (response.status == 200) {
         //setUserProfile(response)
         dispatch({ type: 'set-user', payload: { id: response.id, name: response.first_name } });
         dispatch({ type: 'setLogin', payload: true });
         return;
       }*/
       router.push('./landing')
    })();
  }, []);

  return (
    <>
    
      {/*<Navigation />*/}
    </>
  );
}
