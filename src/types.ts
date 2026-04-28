/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AchievementStatus = 'pending' | 'verified' | 'rejected';
export type AchievementCategory = 'Academic' | 'Skill' | 'Extracurricular' | 'Work Experience';

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: AchievementCategory;
  date: string;
  institution: string;
  status: AchievementStatus;
  verifiedBy?: string;
  verificationDate?: string;
  evidenceUrl?: string;
  aiAnalysis?: string;
  isAiVerified?: boolean;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'educator' | 'admin';
  institution: string;
  course?: string;
  country?: string;
  graduationYear?: number;
  avatar?: string;
  profileComplete?: boolean;
}
