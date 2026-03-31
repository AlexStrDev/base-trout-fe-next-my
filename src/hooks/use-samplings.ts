import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSamplings, createSampling } from '@/lib/api.client';
import { queryKeys } from '@/lib/query-keys';
import type { PaginatedResult, SamplingItem } from '@/lib/types';

export function useSamplingsList(
  cohortId: string,
  page: number,
  initialData?: PaginatedResult<SamplingItem>,
) {
  return useQuery({
    queryKey: queryKeys.samplings.list(cohortId, page),
    queryFn: () => getSamplings(cohortId, page),
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}

export function useCreateSampling() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSampling,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.samplings.all(variables.cohort_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cohorts.summary(variables.cohort_id),
      });
    },
  });
}
