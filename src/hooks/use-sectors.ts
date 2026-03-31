import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSectors, getSectorSummary, createSector } from '@/lib/api.client';
import { queryKeys } from '@/lib/query-keys';
import type { PaginatedResult, SectorItem, SectorSummary } from '@/lib/types';

export function useSectorsList(
  userId: string,
  farmId: string,
  fundoId: string,
  page: number,
  initialData?: PaginatedResult<SectorItem>,
) {
  return useQuery({
    queryKey: queryKeys.sectors.list(fundoId, page),
    queryFn: () => getSectors(userId, farmId, fundoId, page),
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}

export function useSectorSummary(
  userId: string,
  sectorId: string,
  initialData?: SectorSummary,
) {
  return useQuery({
    queryKey: queryKeys.sectors.summary(sectorId),
    queryFn: () => getSectorSummary(userId, sectorId),
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}

export function useCreateSector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSector,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sectors.all(variables.fundo_id) });
    },
  });
}
