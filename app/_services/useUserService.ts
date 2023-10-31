'use client'
import { useSearchParams, useRouter } from "next/navigation";
import { create } from "zustand";

interface IUser {
    id: string,
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    isDeleting?: boolean
}

interface IUserStore {
    users?: IUser[],
    user?: IUser,
    currentUser?: IUser
}

interface IUserService extends IUserStore {
    login: (username: string, password: string) => Promise<any>,
    me: () => Promise<any>,
    refreshToken: () => Promise<any>,
    logout: () => Promise<any>,
    register: (user: IUser) => Promise<void>,
    profile: () => Promise<any>,
    changePhoto: (photo: string) => Promise<any>,
    getAll: (page?: any) => Promise<any>,
    filter: (param?: any) => Promise<any>,
    getById: (id: string) => Promise<any>,
    getCurrent: () => Promise<void>,
    create: (user: any) => Promise<any>,
    update: (id: string, params: any) => Promise<any>,
    updateProfile: (id: string, params: any) => Promise<any>,
    changePassword: (params: any) => Promise<any>,
    //update: (id: string, params: Partial<IUser>) => Promise<any>,
    delete: (id: string) => Promise<any>,
    revalidate: () => Promise<any>,
    activeDevice: () => Promise<any>,
    activeDeviceSummary: () => Promise<any>,
    activeDeviceByOSName: (ua_osname: string) => Promise<any>,
    activeDeviceInfo: (device_unique_id: string) => Promise<any>,
    removeDevice: (device_unique_id: string) => Promise<any>,
    removeAllDevice: () => Promise<any>,


}

const initialState = {
    users: undefined,
    user: undefined,
    currentUser: undefined
};
const userStore = create<IUserStore>(() => initialState);


export default function useUserService(): IUserService {
    const router = useRouter();
    const { users, user, currentUser } = userStore();
    return {
        users,
        user,
        currentUser,
        login: async (username, password) => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "username": username,
                        "password": password
                    })
                })
                if (response.status == 200) {
                    const currentUser = await response.json()
                    localStorage.setItem('accessToken', currentUser.backendTokens.accessToken)
                    router.push('/simple');
                    return response
                }

                if (response.status == 401) {
                    router.push('/login');
                    return response
                }
                return response
            } catch (error: any) {
                return { status: 500, message: error.message }
            }
        },
        me: async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/me', {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    }
                })
                return response
            } catch (error) {
                return { 'status': 500 }
            }
        },
        refreshToken: async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/refresh-token', {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    }
                })
                return response
            } catch (error) {
                return { 'status': 500 }
            }
        },
        logout: async () => {
            //await fetch.post('/api/account/logout');
            //router.push('/account/login');
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/logout', {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    }
                })
                return response
            } catch (error) {
                return { 'status': 500 }
            }
        },
        register: async () => {
            try {
                //await fetch.post('/api/account/register', user);
                ///alertService.success('Registration successful', true);
                router.push('/account/login');
            } catch (error: any) {
                //alertService.error(error);
            }
        },

        profile: async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/profile', {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    }
                })
                switch (response.status) {
                    case 401:
                        return { 'status': 500 }
                    case 200:
                        //const data = await response.json()
                        //userStore.setState({ ...initialState, currentUser });
                        //router.push('/simple');
                        return response
                    default:
                        return { 'status': 500 }
                }
            } catch (error: any) {
                return { 'status': 500 }
            }
        },
        changePhoto: async (photo) => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/change-photo', {
                    method: 'PUT',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    },
                    body: JSON.stringify({
                        "photo": photo,
                    })
                })

                switch (response.status) {
                    case 401:
                        return { 'status': 500 }
                    case 200:
                        return response
                    default:
                        return { 'status': 500 }
                }
            } catch (error: any) {
                return { 'status': 500 }
            }
        },
        activeDevice: async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/active-device', {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    }
                })

                switch (response.status) {
                    case 401:
                        return { 'status': 500 }
                    case 200:
                        //const data = await response.json()
                        //userStore.setState({ ...initialState, currentUser });
                        //router.push('/simple');
                        return response
                    default:
                        return { 'status': 500 }
                }
            } catch (error: any) {
                return { 'status': 500 }
            }
        },
        activeDeviceSummary: async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/active-device-summary', {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    }
                })

                switch (response.status) {
                    case 401:
                        return { 'status': 500 }
                    case 200:
                        //const data = await response.json()
                        //userStore.setState({ ...initialState, currentUser });
                        //router.push('/simple');
                        return response
                    default:
                        return { 'status': 500 }
                }
            } catch (error: any) {
                return { 'status': 500 }
            }
        },
        activeDeviceByOSName: async (ua_osname) => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/active-device-osname', {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    },
                    body: JSON.stringify({
                        "ua_osname": ua_osname,
                    })
                })

                switch (response.status) {
                    case 401:
                        return { 'status': 500 }
                    case 200:
                        return response
                    default:
                        return { 'status': 500 }
                }
            } catch (error: any) {
                return { 'status': 500 }
            }
        },
        activeDeviceInfo: async (device_unique_id) => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/active-device-info', {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    },
                    body: JSON.stringify({
                        "device_unique_id": device_unique_id,
                    })
                })

                switch (response.status) {
                    case 401:
                        return { 'status': 500 }
                    case 200:
                        return response
                    default:
                        return { 'status': 500 }
                }
            } catch (error: any) {
                return { 'status': 500 }
            }
        },
        removeDevice: async (device_unique_id) => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/remove-device', {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    },
                    body: JSON.stringify({
                        "device_unique_id": device_unique_id,
                    })
                })

                switch (response.status) {
                    case 401:
                        return { 'status': 500 }
                    case 200:
                        return response
                    default:
                        return { 'status': 500 }
                }
            } catch (error: any) {
                return { 'status': 500 }
            }
        },
        removeAllDevice: async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/remove-all-device', {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    }
                })

                switch (response.status) {
                    case 401:
                        return { 'status': 500 }
                    case 200:
                        return response
                    default:
                        return { 'status': 500 }
                }
            } catch (error: any) {
                return { 'status': 500 }
            }
        },
        filter: async (params) => {
            //userStore.setState({ users: await fetch.get('/api/users') });
            // const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/filter?select=email first_name last_name' + (params.page ? '&page=' + params.page : '') + '&populate[0][path]=role&populate[0][select]=name&sort[criteria]=asc&sort[field]=email', {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/filter?' + params, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                }
            })
            return response
        },
        getAll: async (page) => {
            //userStore.setState({ users: await fetch.get('/api/users') });
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users' + (page ? "?page=" + page : ""), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                }
            })
            return response
        },
        getById: async (id) => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/' + id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    }
                })

                return response
            } catch (error: any) {
                return { status: 500, message: "server error" }
            }
            /*userStore.setState({ user: undefined });
            try {
                //userStore.setState({ user: await fetch.get(`/api/users/${id}`) });
            } catch (error: any) {
                //alertService.error(error);
            }*/
        },
        getCurrent: async () => {
            if (!currentUser) {
                //userStore.setState({ currentUser: await fetch.get('/api/users/current') });
            }
        },
        create: async (user) => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users', {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    },
                    body: JSON.stringify({
                        first_name: user.firstName,
                        last_name: user.lastName,
                        email: user.username,
                        role_id: user.role_id,
                        org_id: user.org_id,
                    })
                })
                return response;
            } catch (error: any) {
                return { status: 500, message: "server error" }
            }
        },
        update: async (id, params) => {

            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/' + id, {
                    method: 'PATCH',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    },
                    body: JSON.stringify({
                        first_name: params.firstName,
                        last_name: params.lastName,
                        email: params.username,
                        phone: params.phone,
                        address: params.address,
                        birth_date: params.birth_date,
                        role_id: params.role_id,
                        org_id: params.org_id,
                    })
                })
                return response;
            } catch (error: any) {
                return { status: 500, message: "server error" }
            }
            //await fetch.put(`/api/users/${id}`, params);

            // update current user if the user updated their own record

            //            if (id === currentUser?.id) {
            //              userStore.setState({ currentUser: { ...currentUser, ...params } })
            //        }
        },
        delete: async (id) => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/' + id, {
                    method: 'DELETE',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    },
                    body: JSON.stringify({
                        id: id
                    })
                })
                return response;
            } catch (error: any) {
                return { status: 500, message: "server error" }
            }
            return;
            // set isDeleting prop to true on user
            userStore.setState({
                users: users!.map(x => {
                    if (x.id === id) { x.isDeleting = true; }
                    return x;
                })
            });

            // delete user
            //const response = await fetch.delete(`/api/users/${id}`);

            // remove deleted user from state
            userStore.setState({ users: users!.filter(x => x.id !== id) });

            // logout if the user deleted their own record
            /*if (response.deletedSelf) {
                router.push('/account/login');
            }*/
        },
        revalidate: async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/refresh-token', {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    }
                })
                const data = await response.json()
                if (response.status == 200) {
                    localStorage.setItem('accessToken', data.accessToken)
                    return response
                }
                if (response.status == 400) {
                }
                //return response
                return { 'status': 401 }
            } catch (error) {
                return { 'status': 500 }
            }
        },
        updateProfile: async (id, params) => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/' + id + '/profile', {
                    method: 'PATCH',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    },
                    body: JSON.stringify({
                        user_id: id,
                        firstName: params.firstName,
                        lastName: params.lastName,
                        email: params.email,
                        phone: params.phone,
                        address: params.address,
                        birthDate: params.birthDate,
                        //role_id: params.role_id,
                        //org_id: params.org_id,
                    })
                })
                return response;
            } catch (error: any) {
                return { status: 500, message: "server error" }
            }
        },

        changePassword: async (params) => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/users/change-password', {
                    method: 'PATCH',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken'),
                    },
                    body: JSON.stringify(params)
                })
                return response;
            } catch (error: any) {
                return { status: 500, message: "server error" }
            }
        },
    }


}