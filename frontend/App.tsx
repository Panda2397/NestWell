import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileProvider } from "./src/context/ProfileContext";
import Tabs from "./src/navigation/Tabs";

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <ProfileProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ProfileProvider>
  );
  
}

