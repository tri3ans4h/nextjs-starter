'use client'
import useValidate from "@/hooks/use-validate";
import Header from "./components/header";
import HeaderMobile from "./components/header-mobile";
import MarginWidthWrapper from "./components/margin-width-wrapper";
import PageWrapper from "./components/page-wrapper";
import SideNav from "./components/side-nav";
import { useContext, useEffect, useRef } from "react";
import { SecretContext } from "@/context/secret-context";
import React from "react";


export default function SimpleLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const { isLogged } = useValidate()
    const { state, dispatch } = useContext(SecretContext);
    const ref = useRef(null);
    useEffect(() => {
        /*bugs  : tdk bisa logout karena kena klik komponen ini
        const handleOutSideClick = (event: any) => {
            // alert(ref.current)
            if (ref.current) {
                if (state.isMenuDropDown = true) {
                    dispatch({ type: 'setStateMenuDropDown', payload: false })
                }
            }
        };
        window.addEventListener("mousedown", handleOutSideClick,);
        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };*/
    }, [ref]);

    return (
        <>
            <div className="flex" ref={ref} >
                <SideNav />
                <main className="flex-1">
                    <MarginWidthWrapper>
                        <Header />
                        <HeaderMobile />
                        <PageWrapper >{children}</PageWrapper>
                    </MarginWidthWrapper>
                </main>
            </div>
        </>
    );

}