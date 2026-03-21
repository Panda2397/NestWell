export type UserType = "anxiety" | "lowMood" | "isolation" | "stable";

export type UserProfile = {
  primaryType: UserType;
  secondaryType?: UserType;
};