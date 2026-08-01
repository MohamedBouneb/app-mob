import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Theme from "../../styles/theme";

export default function PrimaryButton({
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  button:{

      backgroundColor:Theme.colors.primary,

      padding:16,

      borderRadius:12,

      alignItems:"center",

      marginTop:20,

  },

  text:{

      color:"#fff",

      fontWeight:"bold",

      fontSize:16,

  }

});