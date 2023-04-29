export interface User {
  firstName: string;
  lastName: string;
  middleName: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
  gender: boolean;
  userId: number;
}

export interface Address {
  region: string;
  state: string;
  commune: string;
  hamlet: string;
}

export interface Post {
  hometown: Address;
  missingAddress: Address;
  id: number;
  userId: number;
  title: string;
  fullName: string;
  nickname: string;
  dateOfBirth: string;
  gender: number;
  relevantPosts?: any;
  photos: string[];
  relationship?: any;
  description: string;
  shareCount: number;
  updatedAt: Date;
  createdAt: Date;
  missingTime: Date;
  owner: User;
  found: boolean;
  similar?: number;
  user: User;
}

export interface UserEntity {
  id: number;

  accountId: number;

  firstName: string;

  middleName: string | null;

  lastName: string;

  isActive: boolean;

  avatar: string | null;

  social: string | null;

  phone: string | null;

  address: string | null;

  email: string | null;

  createdAt: Date;

  updatedAt: Date;

  posts: PostEntity[];
}

export interface PostEntity {
  id: number;

  userId: number;

  title: string | null;

  fullName: string | null;

  nickname: string | null;

  dateOfBirth: string | null;

  gender: boolean | null;

  hometownRegion: string | null;

  hometownState: string | null;

  hometownCommune: string | null;

  hometownHamlet: string | null;

  relevantPosts: string | null;

  missingRegion: string | null;

  missingState: string | null;

  missingHamlet: string | null;

  missingTime: string | null;

  photos: string | null;

  missingCommune: string | null;

  relationship: string | null;

  description: string | null;

  shareCount: number | null;

  updatedAt: Date;

  createdAt: Date;

  user: UserEntity;
}
