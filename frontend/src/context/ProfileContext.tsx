import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserType = "anxiety" | "lowMood" | "isolation" | "stable";

type UserProfile = {
  primaryType: UserType;
  secondaryType?: UserType;
};

type ContextType = {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
};

const ProfileContext = createContext<ContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: any) => {
  const [profile, setProfileState] = useState<UserProfile | null>(null);

  // Load from storage when app starts
  useEffect(() => {
    const loadProfile = async () => {
      const data = await AsyncStorage.getItem("userProfile");
      if (data) {
        setProfileState(JSON.parse(data));
      }
    };
    loadProfile();
  }, []);

  // Custom setter (updates both state + storage)
  const setProfile = async (p: UserProfile) => {
    setProfileState(p);
    await AsyncStorage.setItem("userProfile", JSON.stringify(p));
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside ProfileProvider");
  return context;
};