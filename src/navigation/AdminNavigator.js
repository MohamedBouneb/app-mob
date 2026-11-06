import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import CourseManagementScreen from "../screens/admin/CourseManagementScreen";
import ParentManagementScreen from "../screens/admin/ParentManagementScreen";
import StatisticsScreen from "../screens/admin/StatisticsScreen";
import TeacherManagementScreen from "../screens/admin/TeacherManagementScreen";

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{
        headerStyle: { backgroundColor: "#F52F46" },
        headerTintColor: "#FFFFFF",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: "#FFF8F6" },
      }}
    >
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: "فضاء الإدارة", headerBackVisible: false }}
      />
      <Stack.Screen
        name="ParentManagement"
        component={ParentManagementScreen}
        options={{ title: "أولياء الأمور" }}
      />
      <Stack.Screen
        name="TeacherManagement"
        component={TeacherManagementScreen}
        options={{ title: "إدارة المنشّطات" }}
      />

      <Stack.Screen
        name="CourseManagement"
        component={CourseManagementScreen}
        options={{ title: "إدارة الدروس" }}
      />

      <Stack.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ title: "الإحصائيات والتقارير" }}
      />
    </Stack.Navigator>
  );
}
