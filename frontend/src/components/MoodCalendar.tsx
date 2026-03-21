import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";


type Mood = "sad" | "stressed" | "ok" | "good" | "great";

type DayEntry = {
  mood?: Mood;
  note?: string;
  photoUri?: string;
};

type Entries = Record<string, DayEntry>;

const STORAGE_KEY = "moods.v1";

const moodStyle: Record<Mood, { emoji: string; bgColor: string }> = {
  sad: { emoji: "😢", bgColor: "rgba(255, 10, 10, 0.25)" },
  stressed: { emoji: "😟", bgColor: "rgba(249, 115, 22, 0.25)" },
  ok: { emoji: "😐", bgColor: "rgba(234, 179, 8, 0.25)" },
  good: { emoji: "🙂", bgColor: "rgba(34, 197, 94, 0.25)" },
  great: { emoji: "😄", bgColor: "rgba(59, 130, 246, 0.25)" },
};

const hasOverThreeDays = (entries: Entries) => {
  const today = new Date();
  let cnt = 7;

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const dateString = d.toISOString().slice(0, 10);
    const mood = entries[dateString]?.mood;

    if (mood !== "sad") {
      cnt --;
    }
  }

  return cnt > 3;
};



export default function MoodCalendar() {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [entries, setEntries] = useState<Entries>({});

  const navigation = useNavigation<any>();


  const isSadRiskDetected = hasOverThreeDays(entries);

  // Load saved moods
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    })();
  }, []);

  // Save moods whenever updated
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const markedDates = useMemo(() => {
    const marks: any = {};

    for (const date of Object.keys(entries)) {
        const entry = entries[date];
        const mood = entry?.mood;

        if (!mood) continue;

        marks[date] = {
        customStyles: {
            container: {
            backgroundColor: moodStyle[mood].bgColor, // transparent fill
            borderRadius: 10,
            },
            text: {
            fontWeight: "700",
            },
        },
        };
    }

    // Selected date border (so you can see what you tapped)
    marks[selectedDate] = {
        ...(marks[selectedDate] ?? {}),
        customStyles: {
        ...(marks[selectedDate]?.customStyles ?? {}),
        container: {
            ...(marks[selectedDate]?.customStyles?.container ?? {}),
            borderWidth: 2,
            borderColor: "#111827",
        },
        },
    };

    return marks;
    }, [entries, selectedDate]);

    const setMoodForSelected = (mood: Mood) => {
        setEntries((prev) => ({
            ...prev,
            [selectedDate]: { ...(prev[selectedDate] ?? {}), mood },
        }));
    };

    const selectedEntry = entries[selectedDate] ?? {};
    const selectedMood = selectedEntry.mood;

    const pickPhoto = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert("Permission required to access photos");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;

            setEntries((prev) => ({
            ...prev,
            [selectedDate]: {
                ...(prev[selectedDate] ?? {}),
                photoUri: uri,
            },
            }));
        }
        };


  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Mood Calendar</Text>

      <Calendar
        markingType="custom"
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        />

        

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {selectedDate} {selectedMood ? `• Current: ${moodStyle[selectedMood].emoji}` : "• No mood yet"}
        </Text>

        <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
          {(["sad", "stressed", "ok", "good", "great"] as Mood[]).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMoodForSelected(m)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 999,
                backgroundColor: selectedMood === m ? "#111827" : "#f3f4f6",
              }}
            >
              <Text style={{ fontSize: 18, color: selectedMood === m ? "white" : "black" }}>
                {moodStyle[m].emoji} {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMood ? (
          <TouchableOpacity
            onPress={() => {
              setEntries((prev) => {
                const copy = { ...prev };
                delete copy[selectedDate];
                return copy;
              });
            }}
            style={{
              marginTop: 8,
              paddingVertical: 10,
              borderRadius: 12,
              alignItems: "center",
              backgroundColor: "#fee2e2",
            }}
          >
            <Text style={{ color: "#991b1b", fontWeight: "700" }}>Remove mood for this day</Text>
          </TouchableOpacity>
        ) : null}

        {isSadRiskDetected && (
          <View
            style={{
              marginTop: 16,
              backgroundColor: "#FEF2F2",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#FECACA",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#B91C1C" }}>
              We noticed you may be having a hard week
            </Text>

            <Text
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: 22,
                color: "#7F1D1D",
              }}
            >
              You have logged feeling sad for over 3 days recently. You don’t have to go
              through this alone. Consider reaching out for support or exploring some
              calming resources.
            </Text>
                <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: "#B91C1C",
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
              }}
              onPress={() => navigation?.navigate?.("Hotline")}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>
                View Hotline Support
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 10 }}>
    Notes for {selectedDate}
    </Text>

    <TextInput
    value={entries[selectedDate]?.note ?? ""}
    onChangeText={(text) =>
        setEntries((prev) => ({
        ...prev,
        [selectedDate]: {
            ...(prev[selectedDate] ?? {}),
            note: text,
        },
        }))
    }
    placeholder="Write something about today..."
    multiline
    style={{
        minHeight: 80,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "white",
        textAlignVertical: "top",
    }}
    />

    <TouchableOpacity
        onPress={pickPhoto}
        style={{
            marginTop: 10,
            padding: 12,
            backgroundColor: "#111827",
            borderRadius: 10,
            alignItems: "center",
        }}
        >
        <Text style={{ color: "white", fontWeight: "600" }}>
            Upload Photo 📷
        </Text>
    </TouchableOpacity>

    {entries[selectedDate]?.photoUri && (
        <Image
            source={{ uri: entries[selectedDate].photoUri }}
            style={{
            width: "100%",
            height: 200,
            marginTop: 10,
            borderRadius: 12,
            }}
        />
        )}
      </View>
    </View>
  );
}