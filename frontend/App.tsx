import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileProvider } from "./src/context/ProfileContext";
import Tabs from "./src/navigation/Tabs";
import BookingDetailScreen from "./src/screens/BookingDetailScreen";
import BookingRecordsScreen from "./src/screens/BookingRecordScreen";

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

          <Stack.Screen
            name="BookingDetail"
            component={BookingDetailScreen}
            options={{ title: "Booking" }}
          />

          <Stack.Screen
            name="BookingRecords"
            component={BookingRecordsScreen}
            options={{ title: "Record" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ProfileProvider>
  );
  
}

