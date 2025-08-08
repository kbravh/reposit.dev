export type Repository = {
  repositoryInstance: {
    id: string;
    userId: string;
    repositoryId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  repository: {
    id: string;
    htmlUrl: string;
    org: string;
    name: string;
    description: string | null;
    private: boolean;
    provider: string;
    providerId: string;
    lastSyncedAt: Date | null;
    deletedAt: Date | null;
    createdAt: Date;
    primaryLanguage: string | null;
    updatedAt: Date;
  };
};
