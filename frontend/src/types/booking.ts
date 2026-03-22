export type ProviderType = "Doctor" | "Counselor";

export type TimeSlot = {
  id: string;
  label: string;
  available: boolean;
};

export type Provider = {
  id: string;
  name: string;
  type: ProviderType;
  specialty: string;
  location: string;
  languages: string[];
  image?: string;
  about: string;
  slots: TimeSlot[];
};