import { TextInput, StyleSheet } from "react-native";
import Theme from "../../styles/theme";

export default function CustomInput(props){

return(

<TextInput

style={styles.input}

placeholderTextColor={Theme.colors.placeholder}

{...props}

/>

)

}

const styles=StyleSheet.create({

input:{

borderWidth:1,

borderColor:Theme.colors.border,

borderRadius:12,

padding:14,

marginTop:15,

fontSize:16,

}

})