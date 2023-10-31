'use client'

import { Suspense, useEffect, useState } from "react";
import { AbilityContext, defineAbilityFor } from "./_lib/casl";

export default function AbilityLayout({
    children
}: {
    children: React.ReactNode;
}) {
    //const role = { "role": "user" }
    const [role, setRole] = useState<any>({ "": "" });
    useEffect(() => {
        // (async () => {
        setRole({ role: "admin" })
        // })();
    }, []);
    return (
        <>
            <Suspense fallback={`<h1>load</h1>`}>
                <AbilityContext.Provider value={defineAbilityFor(role)}>
                    {children}
                </AbilityContext.Provider>
            </Suspense>
        </>
    );

}