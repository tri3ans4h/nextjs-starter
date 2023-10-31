'use client'
import useUserService from "@/app/_services/useUserService";
import { SecretContext } from "@/context/secret-context";
import React from "react";
import { useContext, useState, useEffect } from "react";


import {
    Query,
    Populate,
    Filter,
    QueryString
} from 'nestjs-prisma-querybuilder-interface';

import { Icon } from '@iconify/react';

interface IUserItem {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}


import Link from "next/link";
import { useRouter } from "next/navigation";
import { Can } from "./_lib/casl";
/*

const ability = new PureAbility<['read' | 'update', 'Article']>([
    { action: 'read', subject: 'Article' },
    { action: 'update', subject: 'Article' },
]);

type Abilities = ['read' | 'create' | 'update' | 'delete' | 'manage', 'User' | 'all'];
type AppAbility = MongoAbility<Abilities>;
type User = {
    role: string
}
export function defineAbilityFor(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    if (user.role === 'admin') {
        can('manage', 'all');
    }
    return build();
}

export const AbilityContext = React.createContext({} as AppAbility);
export const Can = createContextualCan(AbilityContext.Consumer);

*/
export default function UserPage() {

    const { state, dispatch } = useContext(SecretContext);
    const [usersData, SetUsersData] = useState<IUserItem[]>();
    const [metaData, SetMetaData] = useState<any>();
    const userService = useUserService()
    const [validate, setValidate] = useState(false)
    const router = useRouter()
    const [searchData, setSearchData] = useState<string>('');

    useEffect(() => {
        (async () => {
            const response = await userService.getAll()
            if (response.status == 500) {
                return;
            }
            if (response.status == 401) {
                //console.log('rvalidate')
                const validateResponse = await userService.revalidate()
                if (validateResponse.status == 200) {
                    console.log("refresh success")
                    setValidate(true)
                }
                return;
            }
            const jsonResponse = await response.json()
            SetUsersData(jsonResponse.data)
            SetMetaData(jsonResponse.meta)
            let tmp = []
            for (let i = 1; i <= jsonResponse.meta.lastPage; i++) {
                //pageNumbers.push(i);
                tmp.push(i)
            }
            setPageNumbers(tmp)
        })();
    }, [validate]);


    const [pageNumbers, setPageNumbers] = useState<any[]>();



    const handleOnPageChange = async (page: any) => {
        let query =
            {
                select: 'email first_name last_name',
                page: page,
                populate: [
                    {
                        path: 'role',
                        select: 'name'
                    }
                ],
                sort: {
                    field: "email",
                    criteria: "asc"
                },
                /*
                filter: [
                    {
                        path: 'plate',
                        value: 'XFS1T67'
                    }
                ]*/
            } as Query
        if (searchData != "") {
            query.filter = [
                {
                    or: [
                        {

                            path: 'email',
                            value: searchData,
                            operator: 'contains',
                            insensitive: true
                        },
                        {

                            path: 'first_name',
                            value: searchData,
                            operator: 'contains',
                            insensitive: true
                        },

                    ]
                }
            ] as Filter
        }
        const qry = QueryString(query);

        //console.log(qry)
        const response = await userService.filter(qry)
        if (response.status == 500) {
            return;
        }
        if (response.status == 401) {
            //console.log('rvalidate')
            const validateResponse = await userService.revalidate()
            if (validateResponse.status == 200) {
                console.log("refresh success")
                setValidate(true)
            }
            return;
        }
        const jsonResponse = await response.json()
        SetUsersData(jsonResponse.data)
        SetMetaData(jsonResponse.meta)
        let tmp = []
        for (let i = 1; i <= jsonResponse.meta.lastPage; i++) {
            //pageNumbers.push(i);
            tmp.push(i)
        }
        setPageNumbers(tmp)

    };

    return <>

        {/*<div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-700 rounded"></div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                            <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-slate-700 rounded"></div>
                    </div>
                </div>
            </div>
</div>*/}
        <Can I="read" a="User" passThrough>
            {(allowed) =>
                allowed ? (
                    <>
                        <div className="flex-1 flex-col flex">
                            <div className="mb-1 md:mb-3 bg-white  -mx-1 md:mx-0 -mt-2 md:mt-0">
                                <div className="flex flex-row align-middle justify-center items-center">
                                    <div className="flex-0">
                                        <img src="/icon/team.png" className="w-16" />
                                    </div>
                                    <div className="flex-initial w-64 flex flex-col my-6 mx-6" >
                                        <h3 className="text-xl md:text-2xl py-1">User Management</h3>
                                        <p className="text-xs md:text-sm text-gray-400 py-1">Manage user application</p>
                                    </div>
                                </div>
                            </div>
                            {/*<div className="mb-6 bg-white">
                                <div className="flex flex-col my-6 items-center text-center" >
                                    <h3 className=" text-2xl py-1">User Management</h3>
                                    <p className=" text-sm text-gray-400 py-1">Manage user application</p>
                                </div>
                </div>*/}
                            <div className="border mb-6 bg-white ">
                                <div className="flex flex-col mb-6">
                                    <div className="flex-col mt-6 py-2 items-center ">
                                        {/*w-screen overflow-y-hidden overflow-x-scroll*/}
                                        {/* <div className="relative overflow-x-auto mx-6 ">*/}
                                        <div className="w-screen md:w-full">
                                            <div className="flex flex-col  ">
                                                <div className="mb-3 flex flex-row w-full align-middle justify-end">
                                                    <Can I="create" a="User"  >
                                                        {(allowed) =>
                                                            allowed ? (
                                                                <button onClick={() => { router.push('./user/add') }} className="mt-2 mx-2 relative border h-10 w-16 rounded-sm bg-green-500 hover:bg-green-400  text-slate-200 hover:text-slate-900">Add</button>
                                                            ) : (
                                                                <p>Tak boleh</p>
                                                            )
                                                        }
                                                    </Can>
                                                    <div className="pt-2 relative text-gray-600">
                                                        <input className="border-2 border-gray-300 bg-white h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none"
                                                            type="search" name="search" placeholder="Search"

                                                            onChange={(e) => {
                                                                setSearchData(e.target.value)
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                handleOnPageChange(1)
                                                            }}


                                                            type="submit" className="absolute right-0 top-0 mt-4 mr-4">
                                                            <Icon color="red" icon="la:search" width="24" height="24" />

                                                        </button>
                                                    </div>


                                                    {/*<div className="flex w-full items-center p-1 space-x-1 bg-white rounded-md  ">
                                                        <div className="flex bg-gray-100 p-1 space-x-1 rounded-md">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                            </svg>
                                                            <input className="bg-gray-100 outline-none w-full " type="text" placeholder="Article name or keyword..." />
                                                        </div>

                                                        <button className="bg-red-600 p-1  text-white font-semibold rounded-sm  cursor-pointer">
                                                            Search
                                                        </button>
                                                </div>*/}
                                                </div>
                                                <div className="overflow-x-auto ">
                                                    <table className="table-auto w-full text-sm text-left text-gray-500" >
                                                        <thead className="text-xs overflow-x-scroll text-gray-700 uppercase bg-gray-50 ">
                                                            <tr>
                                                                <th className="px-6 py-6 w-4">#</th>
                                                                <th className="px-6 py-3">Username</th>
                                                                <th className="px-6 py-3">Name</th>
                                                                <th className="px-6 py-3">Role</th>
                                                                <th className="px-6 py-3">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {React.Children.toArray(
                                                                usersData?.map((data, index) => (
                                                                    <tr key={index} className="bg-white border-b hover:bg-slate-200">
                                                                        <td className="px-6 font-medium text-gray-900 whitespace-nowrap ">{index + 1}</td>
                                                                        <td className="px-6 font-medium text-gray-900 whitespace-nowrap ">{data.email}</td>
                                                                        <td className="px-6">{data.first_name}</td>
                                                                        <td className="px-6">{data.first_name}</td>
                                                                        <td className="flex flex-row px-6 py-2 space-x-2 justify-end">
                                                                            <button onClick={() => { router.push('./user/det/' + data.id) }}
                                                                                className="border p-2 rounded-sm  border-gray-400 hover:border-green-600 hover:text-green-600">
                                                                                <Icon icon="lucide:view" width="18" height="18" />
                                                                            </button>
                                                                            <Can I="update" a="User" passThrough >
                                                                                {(allowed) =>
                                                                                    allowed ? (
                                                                                        <button onClick={() => { router.push('./user/mod/' + data.id) }}
                                                                                            className="border p-2 rounded-sm border-gray-400 hover:border-yellow-600 hover:text-yellow-600">
                                                                                            <Icon icon="lucide:pencil" width="18" height="18" />
                                                                                        </button>
                                                                                    ) : (
                                                                                        <p>Tak boleh</p>
                                                                                    )
                                                                                }
                                                                            </Can>

                                                                            <Can I="delete" a="User"  >
                                                                                {(allowed) =>
                                                                                    allowed ? (
                                                                                        <button onClick={() => { router.push('./user/rem/' + data.id) }}
                                                                                            className="border p-2 rounded-sm border-gray-400 hover:border-red-600 hover:text-red-600">
                                                                                            <Icon icon="lucide:delete" width="18" height="18" />
                                                                                        </button>
                                                                                    ) : (
                                                                                        <p>Tak boleh</p>
                                                                                    )
                                                                                }
                                                                            </Can>
                                                                        </td>
                                                                    </tr>
                                                                )))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="flex flex-row justify-end mr-6 mt-3">
                                                    <div className="flex items-center justify-center mx-4">
                                                        <p> Total Data :  {metaData?.total}</p>
                                                    </div>
                                                    <button onClick={() => { handleOnPageChange(metaData?.prev) }//paginate(number)
                                                    }
                                                        disabled={(metaData?.prev == null ? true : false)}
                                                        className={`border-2 mx-1 hover:border-cyan-600 hover:text-gray-900 text-gray-900 px-3 w-auto h-10 rounded-sm disabled:hover:border-gray-300 disabled:bg-gray-300 disabled:text-gray-900 `}>
                                                        <Icon icon="lucide:arrow-left" width="18" height="18" />
                                                    </button>
                                                    {pageNumbers?.map((number) => (
                                                        metaData?.currentPage == number ?
                                                            <button
                                                                key={number}
                                                                onClick={() => { handleOnPageChange(number) }//paginate(number)
                                                                }
                                                                className="hover:bg-cyan-400 mx-1 bg-cyan-600 text-white w-10 h-10 rounded-sm"
                                                            >
                                                                {number}
                                                            </button> :
                                                            <button
                                                                key={number}
                                                                onClick={() => { handleOnPageChange(number) }//paginate(number)
                                                                }
                                                                className="border mx-1 text-gray-900  w-10 h-10 rounded-sm hover:border-cyan-600"
                                                            >
                                                                {number}
                                                            </button>
                                                    ))}
                                                    <button
                                                        onClick={() => { handleOnPageChange(metaData?.next) }//paginate(number)
                                                        }
                                                        disabled={(metaData?.next == null ? true : false)}
                                                        className={`border-2 mx-1 hover:border-cyan-600 hover:text-gray-900 text-gray-900 px-3 w-auto h-10 rounded-sm disabled:hover:border-gray-300 disabled:bg-gray-300 disabled:text-gray-900 `}>

                                                        <Icon icon="lucide:arrow-right" width="18" height="18" />
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex-row bg-white flex flex-grow justify-center items-center">
                            <Icon color="red" icon="solar:forbidden-circle-broken" width="48" height="48" />
                            <div className="flex flex-col mx-3">
                                <h1>Forbidden</h1>
                                <p className="text-sm text-gray-600">You cannot access this page</p>
                                <Link className="text-sm" href="./">Back to Home</Link>
                            </div>
                        </div>
                    </>
                )
            }
        </Can>
    </>

}