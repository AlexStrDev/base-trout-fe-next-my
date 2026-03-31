import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFundos, getFundoSummary, createFundo } from '@/lib/api.client';
import { queryKeys } from '@/lib/query-keys';
import type { PaginatedResult, FundoItem, FundoSummary } from '@/lib/types';

export function useFundosList(
  userId: string,
  farmId: string,
  page: number,
  initialData?: PaginatedResult<FundoItem>,
) {
  return useQuery({
    queryKey: queryKeys.fundos.list(farmId, page),
    queryFn: () => getFundos(userId, farmId, page),
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}

export function useFundoSummary(
  userId: string,
  farmId: string,
  fundoId: string,
  initialData?: FundoSummary,
) {
  return useQuery({
    queryKey: queryKeys.fundos.summary(farmId, fundoId),
    queryFn: () => getFundoSummary(userId, farmId, fundoId),
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}

export function useCreateFundo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFundo,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fundos.all(variables.farm_id) });
    },
  });
}
