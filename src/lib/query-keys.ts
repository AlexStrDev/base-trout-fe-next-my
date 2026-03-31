export const queryKeys = {
  farms: {
    all: (userId: string) => ['farms', userId] as const,
    list: (userId: string, page: number) => ['farms', userId, 'list', page] as const,
    summary: (userId: string, farmId: string) => ['farms', userId, farmId, 'summary'] as const,
  },
  fundos: {
    all: (farmId: string) => ['fundos', farmId] as const,
    list: (farmId: string, page: number) => ['fundos', farmId, 'list', page] as const,
    summary: (farmId: string, fundoId: string) => ['fundos', farmId, fundoId, 'summary'] as const,
  },
  sectors: {
    all: (fundoId: string) => ['sectors', fundoId] as const,
    list: (fundoId: string, page: number) => ['sectors', fundoId, 'list', page] as const,
    summary: (sectorId: string) => ['sectors', sectorId, 'summary'] as const,
  },
  cohorts: {
    all: (sectorId: string) => ['cohorts', sectorId] as const,
    list: (sectorId: string, page: number) => ['cohorts', sectorId, 'list', page] as const,
    summary: (cohortId: string) => ['cohorts', cohortId, 'summary'] as const,
  },
  samplings: {
    all: (cohortId: string) => ['samplings', cohortId] as const,
    list: (cohortId: string, page: number) => ['samplings', cohortId, 'list', page] as const,
  },
} as const;
