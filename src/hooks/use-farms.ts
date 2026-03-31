import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFarms, getFarmSummary, createFarm } from '@/lib/api.client';
import { queryKeys } from '@/lib/query-keys';
import type { PaginatedResult, FarmItem, FarmSummary } from '@/lib/types';

export function useFarmsList(
  userId: string,
  page: number,
  initialData?: PaginatedResult<FarmItem>,
) {
  return useQuery({
    queryKey: queryKeys.farms.list(userId, page),
    queryFn: () => getFarms(userId, page),
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}

export function useFarmSummary(
  userId: string,
  farmId: string,
  initialData?: FarmSummary,
) {
  return useQuery({
    queryKey: queryKeys.farms.summary(userId, farmId),
    queryFn: () => getFarmSummary(userId, farmId),
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFarm,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.farms.all(variables.user_id) });
    },
  });
}
