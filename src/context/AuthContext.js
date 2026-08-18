import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import StorageService from "../services/storageService";


const AuthContext = createContext();


export function AuthProvider({children}) {


    const [user,setUser] = useState(null);

    const [token,setToken] = useState(null);

    const [loading,setLoading] = useState(true);



    // Vérifier token au démarrage
    useEffect(()=>{

        checkLogin();

    },[]);



    const checkLogin = async()=>{

        try{

            const savedToken =
                await StorageService.getToken();


            if(savedToken){

                setToken(savedToken);


                // Pour le moment fake user
                setUser({

                    id:1,

                    name:"Mohamed",

                    email:"mohamed@gmail.com",

                    role:"ADMIN"

                });

            }


        }catch(error){

            console.log(error);

        }
        finally{

            setLoading(false);

        }

    };




    const login = async(userData,jwtToken)=>{


        setUser(userData);

        setToken(jwtToken);


        await StorageService.saveToken(jwtToken);


    };




    const logout = async()=>{


        setUser(null);

        setToken(null);


        await StorageService.removeToken();


    };





    return (

        <AuthContext.Provider

        value={{

            user,

            token,

            loading,

            login,

            logout

        }}

        >

        {children}

        </AuthContext.Provider>

    );


}




export function useAuth(){

    return useContext(AuthContext);

}