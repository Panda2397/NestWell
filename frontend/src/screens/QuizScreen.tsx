import React, { useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType, UserProfile } from "../types/user";
import { styles } from "./QuizScreen.styles";
import { QUESTIONS, RESULT_COPY, OPTIONS } from "./QuizScreen.data";

const { width } = Dimensions.get("window");


export default function QuizScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const scoreProfile = (allAnswers: Record<number, number>): UserProfile => {
    const scores: Record<UserType, number> = {
      anxiety: 0,
      lowMood: 0,
      isolation: 0,
      stable: 0,
    };

    QUESTIONS.forEach((q) => {
      const value = allAnswers[q.id] ?? 0;
      scores[q.type] += value;
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]) as [
      UserType,
      number
    ][];

    const totalScore = scores.anxiety + scores.lowMood + scores.isolation;

    if (totalScore <= 8) {
      return {
        primaryType: "stable",
      };
    }

    return {
      primaryType: sorted[0][0],
      secondaryType: sorted[1]?.[0],
    };
  };

  const handleAnswer = async (value: number) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };

    setAnswers(updatedAnswers);

    const isLast = currentIndex === QUESTIONS.length - 1;

    if (isLast) {
      const result = scoreProfile(updatedAnswers);
      setProfile(result);
      setFinished(true);
      await AsyncStorage.setItem("userProfile", JSON.stringify(result));
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const resultData = useMemo(() => {
    if (!profile) return null;
    return RESULT_COPY[profile.primaryType];
  }, [profile]);

  const restartQuiz = () => {
    setCurrentIndex(0);
    setAnswers({});
    setFinished(false);
    setProfile(null);
  };

  if (finished && profile && resultData) {
    return (
      <ScrollView style={styles.safe}>
        <View style={styles.container}>
          <View style={[styles.resultCard, { backgroundColor: resultData.bg }]}>
            <Text style={styles.resultEmoji}>{resultData.emoji}</Text>
            <Text style={styles.resultTitle}>{resultData.title}</Text>
            <Text style={styles.resultSubtitle}>{resultData.subtitle}</Text>

            <View style={styles.typeBox}>
              <Text style={styles.typeLabel}>Primary support type</Text>
              <Text style={[styles.typeValue, { color: resultData.color }]}>
                {resultData.title}
              </Text>
            </View>

            {profile.secondaryType ? (
              <View style={styles.typeBox}>
                <Text style={styles.typeLabel}>Secondary support type</Text>
                <Text style={styles.typeValue}>
                  {RESULT_COPY[profile.secondaryType].title}
                </Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: resultData.color }]}
            onPress={() => navigation?.navigate?.("Home")}
          >
            <Text style={styles.actionButtonText}>Continue to App</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={restartQuiz}>
            <Text style={styles.secondaryButtonText}>Retake Quiz</Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            If you're feeling persistently overwhelmed, {"\n"}consider reaching out to a professional for support.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Support Check-In</Text>
        <Text style={styles.headerSubtitle}>
          Let’s understand what kind of support may help you most right now.
        </Text>

        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {QUESTIONS.length}
          </Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionBadge}>Question {currentIndex + 1}</Text>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>

        <View style={styles.optionsWrap}>
          {OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.optionCard}
              activeOpacity={0.85}
              onPress={() => handleAnswer(option.value)}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </View>
              <View style={styles.optionCircle}>
                <Text style={styles.optionValue}>{option.value}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
