//'use client'

import { cookies } from "next/headers";
type Props = {
    params: {},
    searchParams: { [key: string]: string | string[] | undefined },
}
export default function SsoClientPage(props: Props) {
    const searchParams = props.searchParams;
    const key = searchParams.key;
    const cookieStore = cookies()
    const theme = cookieStore.get('refresh')
    // cookieStore.set({'key', page})
    /*cookieStore.set({
        name: 'key',
        value: key as string,
        httpOnly: true,
        path: '/',
    })*/
    return (
        <>
            Hello World {key} {theme}
        </>
    )
}
