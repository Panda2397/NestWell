import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import LearnScreen from "../screens/LearnScreen";
import NearbyScreen from "../screens/NearbyScreen";
import QuizScreen from "../screens/QuizScreen";
import LetterScreen from "../screens/LetterScreen";
import BookingListScreen from "../screens/BookingListScreen";
import BookingDetailScreen from "../screens/BookingDetailScreen";

 // @ts-ignore
import { tabScreenOptions } from "./Tabs.styles";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    // @ts-ignore
    <Tab.Navigator screenOptions={tabScreenOptions}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Quiz" component={QuizScreen} />
      <Tab.Screen name="Letters" component={LetterScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Booking" component={BookingListScreen} />
      <Tab.Screen name="Nearby" component={NearbyScreen} />
    </Tab.Navigator>
  );
}