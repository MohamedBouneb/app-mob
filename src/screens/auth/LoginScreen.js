import { Text, View } from "react-native";
import PrimaryButton from "../../components/common/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import StorageService from "../../services/storageService";

export default function LoginScreen() {

  const { login, user } = useAuth();

  const handleFakeLogin = async () => {

    // 1. Simuler la connexion
    login(
      {
        id: 1,
        name: "Mohamed",
        email: "mohamed@gmail.com",
        role: "ADMIN",
      },
      "fake-jwt-token"
    );

    // 2. Sauvegarder le token
    await StorageService.saveToken("fake-jwt-token");

    // 3. Relire le token pour vérifier
    const token = await StorageService.getToken();

    console.log("Token enregistré :", token);

  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text>
        {user ? `Bienvenue ${user.name}` : "Aucun utilisateur connecté"}
      </Text>

      <PrimaryButton
        title="Tester AsyncStorage"
        onPress={handleFakeLogin}
      />
    </View>
  );
}