import type { ReactElement } from 'react';

export type GetParam = {
  filters?: string;
  page?: number;
  take?: number;
  search?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
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

export type INewPost = {
  id: number;
  caption: string;
  media: string;
};

export type IPostData = {
  id: number;
  caption: string;
  media: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
};
