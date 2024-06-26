import type { ReactElement } from 'react';
import type { User } from './store';

export type GetParam = {
  filters?: string;
  page?: number;
  take?: number;
  search?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export type FileResponse = {
  data: {
    message: string;
    filePath: string;
    data: IFileImage;
  };
};

export type INavLink = {
  imgURL?: string;
  route: string;
  label: string;
  icon: ReactElements;
};

export type ILoginParam = {
  username: string;
  password: string;
};

export type ICreateUserParam = {
  username: string;
  email: string;
  password: string;
};

export type IUpdateProfileParam = {
  id: string | number;
  user: Partial<IUser>;
};

export type IUpdatePostParam = {
  id: string | number;
  post: Partial<IPostData>;
};

export type IUser = {
  id: number;
  username: string;
  email: string;
  password: string;
  name: string;
  bio?: string;
  avaUrl?: string;
  followers?: Partial<IUser[]>;
  following?: Partial<IUser[]>;
};

export type INewPost = {
  authorId: string | number | undefined;
  caption: string;
  media: string | null;
};

export type INewComment = {
  content: string;
};

export type IPostImage = {
  image: File;
  folder: string;
};

export type IPostData = {
  author: IUser;
  id: number;
  caption: string;
  media: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  likedBy: number[];
  comments: IComment[];
};

export type IComment = {
  id: number;
  content: string;
  author: Partial<IUser>;
  createdAt: Date;
};

export type ILikePost = {
  statusCode: string;
  message: string;
};

export type IFileImage = {
  createdAt: string;
  filename: string;
  id: number;
  path: string;
  updatedAt: string;
};
