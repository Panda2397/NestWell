export type UserType = "emotional" | "practical" | "resource";

export type UserProfile = {
  primaryType: UserType;
  secondaryType?: UserType;
};