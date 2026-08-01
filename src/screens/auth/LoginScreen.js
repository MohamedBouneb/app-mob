import { View, Text } from "react-native";

import ScreenContainer from "../../components/common/ScreenContainer";
import CustomInput from "../../components/common/CustomInput";
import PrimaryButton from "../../components/common/PrimaryButton";

export default function LoginScreen(){

return(

<ScreenContainer>

<Text>

Connexion

</Text>

<CustomInput

placeholder="Adresse email"

/>

<CustomInput

placeholder="Mot de passe"

secureTextEntry

/>

<PrimaryButton

title="Se connecter"

/>

</ScreenContainer>

)

}