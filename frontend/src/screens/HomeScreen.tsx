import { View, Text, Button, ScrollView  } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { Animated, PanResponder, Pressable } from "react-native";
import MoodCalendar from "../components/MoodCalendar";
import { useProfile } from "../context/ProfileContext";

export default function HomeScreen() {
    const [mood, setMood] = useState<string | null>(null);
    const navigation = useNavigation<any>();

    const pan = useRef(new Animated.ValueXY({ x: 220, y: 520 })).current;
    const moved = useRef(false);

    const { profile } = useProfile();


    // This only be called when first mount


    const panResponder = useRef(
    PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_evt, gesture) =>
        Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,

        onPanResponderGrant: () => {
        moved.current = false;
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
        pan.setValue({ x: 0, y: 0 });
        },

        onPanResponderMove: (_evt, gesture) => {
        if (Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3) moved.current = true;
        pan.setValue({ x: gesture.dx, y: gesture.dy });
        },

        onPanResponderRelease: () => {
        pan.flattenOffset();
        },
    })
    ).current;
    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
            <MoodCalendar />

            </ScrollView>
        </View>
    );
}