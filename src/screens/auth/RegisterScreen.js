import { View, Text } from "react-native";

import ScreenContainer from "../../components/common/ScreenContainer";
import CustomInput from "../../components/common/CustomInput";
import PrimaryButton from "../../components/common/PrimaryButton";

export default function RegisterScreen(){

return(

<ScreenContainer>

<Text>

Créer un compte

</Text>

<CustomInput

placeholder="Nom"

/>

<CustomInput

placeholder="Email"

/>

<CustomInput

placeholder="Mot de passe"

secureTextEntry

/>

<PrimaryButton

title="Créer mon compte"

/>

</ScreenContainer>

)

}