export type BaseTag = {
  id: string;
  title: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TagWithCount = BaseTag & {
  repositoryCount: number;
};
