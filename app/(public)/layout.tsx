'use client'
import Navigation from "@/components";
import { SecretContext } from "@/context/secret-context";
import { useContext, useEffect, useState } from "react";
import useUserService from "../_services/useUserService";
import { usePathname, useRouter } from "next/navigation";

import { ToastContainer } from "react-toastify";
import ToastContainerWrapper from "@/components/wrapper/toast-wrapper";
export default function PublicLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const { state, dispatch } = useContext(SecretContext);
    const userService = useUserService()
    const [userProfile, setUserProfile] = useState<any>();
    const pathname = usePathname()
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        (async () => {
            let skip = 1;
            if (skip) {
                const resMe = await userService.me()
                if (resMe.status == 500) {
                    setLoading(false)
                    return;
                }
                const dataMe = await resMe.json()
                if (resMe.status == 200) {
                    setUserProfile(dataMe)
                    dispatch({ type: 'set-user', payload: { id: resMe.id, name: resMe.first_name } });
                    dispatch({ type: 'setLogin', payload: true });
                    if (pathname == '/login') {
                        router.push('/simple')
                    }
                    return
                }

                if (resMe.status == 401) {
                    const response = await userService.refreshToken()
                    const data = await response.json()
                    if (response.status == 200) {
                        localStorage.setItem('accessToken', data.accessToken)
                        const response = await userService.me()
                        if (response.status == 200) {
                            setUserProfile(response)
                            dispatch({ type: 'set-user', payload: { id: response.id, name: response.first_name } });
                            dispatch({ type: 'setLogin', payload: true });
                            if (pathname == '/login') {
                                router.push('/simple')
                            }

                            setLoading(false)
                            return
                        }

                        setLoading(false)
                        return
                    }

                    if (response.status == 401) {
                        if (pathname == '/login') {
                            setLoading(false)
                            return
                        }
                        router.push('/login')
                    }

                    setLoading(false)
                    return
                }
            }

            /*if (response) {
                setUserProfile(response)
                dispatch({ type: 'set-user', payload: { id: response.id, name: response.first_name } });
                dispatch({ type: 'setLogin', payload: true });
            }*/
        })();
    }, []);

    if (loading) {
        return ""
    }

    if (pathname == '/login') {
        return (
            <>
                {!state.isLogin ? <></> : <><Navigation /></>}
                {children}
            </>
        );
    }
    return (
        <>
            <Navigation />
            {children}
        </>
    );

}