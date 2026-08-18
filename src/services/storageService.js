import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageService = {

    async saveToken(token){

        try{

            await AsyncStorage.setItem("token", token);

        }catch(error){

            console.log(error);

        }

    },

    async getToken(){

        try{

            return await AsyncStorage.getItem("token");

        }catch(error){

            console.log(error);

            return null;

        }

    },

    async removeToken(){

        try{

            await AsyncStorage.removeItem("token");

        }catch(error){

            console.log(error);

        }

    }

};

export default StorageService;