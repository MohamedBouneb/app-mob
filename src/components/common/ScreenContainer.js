import { SafeAreaView } from "react-native-safe-area-context";
import GlobalStyles from "../../styles/globalStyles";

export default function ScreenContainer({ children }) {
  return (
    <SafeAreaView style={GlobalStyles.container}>
      {children}
    </SafeAreaView>
  );
}