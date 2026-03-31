import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCohorts, getCohortSummary, createCohort } from '@/lib/api.client';
import { queryKeys } from '@/lib/query-keys';
import type { PaginatedResult, CohortItem, CohortSummary } from '@/lib/types';

export function useCohortsList(
  sectorId: string,
  page: number,
  initialData?: PaginatedResult<CohortItem>,
) {
  return useQuery({
    queryKey: queryKeys.cohorts.list(sectorId, page),
    queryFn: () => getCohorts(sectorId, page),
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}

export function useCohortSummary(
  cohortId: string,
  initialData?: CohortSummary,
) {
  return useQuery({
    queryKey: queryKeys.cohorts.summary(cohortId),
    queryFn: () => getCohortSummary(cohortId),
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}

export function useCreateCohort() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCohort,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cohorts.all(variables.sector_id) });
    },
  });
}
