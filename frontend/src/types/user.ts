export type UserType = "anxiety" | "lowMood" | "isolation" | "stable" | "highRisk";

export type UserProfile = {
  primaryType: UserType;
  secondaryType?: UserType;
};