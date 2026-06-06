export type UserRole = "patient" | "caregiver";

export type UserProfile = {
  name: string;
  age?: number;
  role: UserRole;
  conditions: string[];
  medications: string[];
};
