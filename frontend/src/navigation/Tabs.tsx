import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import QuizScreen from "../screens/QuizScreen";
import LetterScreen from "../screens/LetterScreen";
import LearnScreen from "../screens/LearnScreen";
import BookingListScreen from "../screens/BookingListScreen";
import NearbyScreen from "../screens/NearbyScreen";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#D1D5DB",
        tabBarStyle: {
          backgroundColor: "#1E3A8A",
          height: 110,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "ellipse-outline";

          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Quiz") iconName = "list-outline";
          else if (route.name === "Letters") iconName = "mail-outline";
          else if (route.name === "Learn") iconName = "book-outline";
          else if (route.name === "Booking") iconName = "calendar-outline";
          else if (route.name === "Nearby") iconName = "location-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Quiz" component={QuizScreen} />
      <Tab.Screen name="Letters" component={LetterScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Nearby" component={NearbyScreen} />
    </Tab.Navigator>
  );
}