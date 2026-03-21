import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import LearnScreen from "../screens/LearnScreen";
import NearbyScreen from "../screens/NearbyScreen";
import QuizScreen from "../screens/QuizScreen";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Quiz" component={QuizScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Nearby" component={NearbyScreen} />
    </Tab.Navigator>
  );
}