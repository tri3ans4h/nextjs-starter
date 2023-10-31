import useUserService from '@/app/_services/useUserService';
import { SecretContext } from '@/context/secret-context';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useContext, useEffect, useState } from 'react';


export default function useValidate() {
  const { state, dispatch } = useContext(SecretContext);
  const userService = useUserService()
  const router = useRouter()
  const pathname = usePathname()

  const [isLogged, setIsLogged] = useState<boolean>(false)

  async function ValidateUser() {
    //strategi refresh token & check validation
    const resMe = await userService.me()
    if (resMe.status == 500) {
      return;
    }

    // alert(resMe.status)
    const dataMe = await resMe.json()
    if (resMe.status == 200) {
      //setUserProfile(dataMe)

      dispatch({
        type: 'set-user', payload: {
          id: dataMe.id,
          name: dataMe.UserProfile ? dataMe.UserProfile.firstName + ' ' + dataMe.UserProfile.lastName : "",
          first_name: dataMe.UserProfile ? dataMe.UserProfile.firstName : "",
          last_name: dataMe.UserProfile ? dataMe.UserProfile.lastName : "",
          photo: dataMe.photo,
          email: dataMe.email,
          birth_date: dataMe.UserProfile ? dataMe.UserProfile.birthDate : "",
          phone: dataMe.UserProfile ? dataMe.UserProfile.phone : "",
        }
      });
      //if (dataMe.UserProfile) {
      dispatch({
        type: 'setProfile', payload: dataMe.UserProfile ? dataMe.UserProfile : {}
      });
      //}
      if (dataMe.UserActivity) {
        dispatch({
          type: 'setUserActivity', payload: dataMe.UserActivity
        });
      }
      if (dataMe.securityUserActivity) {
        dispatch({
          type: 'setSecurityUserActivity', payload: dataMe.securityUserActivity
        });
      }
      //alert( dataMe.first_name )
      dispatch({ type: 'setLogin', payload: true });
      //setIsLogged(true)
      //alert('satu ' + isLogged)
      if (pathname == '/login') {
        router.push('/simple')
      }

      //dispatch({ type: 'setLoading', payload: false });
      return
    }

    if (resMe.status == 401) {
      const response = await userService.refreshToken()

      const data = await response.json()
      //dispatch({ type: 'setLoading', payload: false });
      if (response.status == 200) {
        localStorage.setItem('accessToken', data.accessToken)
        const response = await userService.me()
        if (response.status == 200) {
          //setUserProfile(response)
          dispatch({ type: 'set-user', payload: { id: response.id, name: response.first_name } });
          dispatch({ type: 'setLogin', payload: true });

          //setIsLogged(true)
          if (pathname == '/login') {
            router.push('/simple')
          }
          return
        }
        return
      }

      if (response.status == 401) {
        dispatch({ type: 'setLogin', payload: false });
        //setIsLogged(false)
        if (pathname == '/login') {
          return
        }
        router.push('/login')
      }

      if (response.status == 400) { //bad request, token expired
        dispatch({ type: 'setLogin', payload: false });
        //setIsLogged(false)
        if (pathname == '/login') {
          return
        }
        router.push('/login')
      }
      return
    }
  }
  useEffect(() => {
    const validate = async () => {
      await ValidateUser()
    }

    validate()
    //(async () => {
    //  await ValidateUser()
    // setIsLogged(true)
    //alert(isLogged)
    //   alert(state.isLogin)
    //   })();
  }, []);


  return {
    isLogged
  };
}