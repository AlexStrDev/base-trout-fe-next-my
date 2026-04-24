import type {
  PaginatedResult,
  FarmItem,
  FarmSummary,
  FundoItem,
  FundoSummary,
  SectorItem,
  SectorSummary,
  CohortItem,
  CohortSummary,
  SamplingItem,
  WeightPredictionPoint,
} from './types';
import { getAccessToken } from './session';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// ── Base fetcher con tipado genérico ───────────────────────────────

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetcher<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> },
): Promise<T> {
  const { params, ...fetchOpts } = options || {};

  let url = `${API_URL}${path}`;
  if (params) {
    url += `?${new URLSearchParams(params)}`;
  }

  // Adjuntar Bearer token desde la sesión (sólo en server components / server actions)
  const token = await getAccessToken();

  const res = await fetch(url, {
    ...fetchOpts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOpts.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || `Error ${res.status}`);
  }

  return res.json();
}

// ── Farm ───────────────────────────────────────────────────────────

export async function getFarms(
  page = 1,
  pageSize = 10,
): Promise<PaginatedResult<FarmItem>> {
  return fetcher('/trout/farm', {
    params: { page: String(page), page_size: String(pageSize) },
    next: { tags: ['farms'] },
  });
}

export async function getFarmSummary(farmId: string): Promise<FarmSummary> {
  return fetcher('/trout/farm/summary', {
    params: { farm_id: farmId },
    next: { tags: [`farm-${farmId}`] },
  });
}

export async function createFarm(
  data: { name: string; location: string },
): Promise<{ farm_id: string }> {
  return fetcher('/trout/farm', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Fundo ──────────────────────────────────────────────────────────

export async function getFundos(
  farmId: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResult<FundoItem>> {
  return fetcher('/trout/fundo', {
    params: {
      farm_id: farmId,
      page: String(page),
      page_size: String(pageSize),
    },
    next: { tags: [`fundos-${farmId}`] },
  });
}

export async function getFundoSummary(
  farmId: string,
  fundoId: string,
): Promise<FundoSummary> {
  return fetcher('/trout/fundo/summary', {
    params: { farm_id: farmId, fundo_id: fundoId },
    next: { tags: [`fundo-${fundoId}`] },
  });
}

export async function createFundo(
  data: { farm_id: string; name: string },
): Promise<{ fundo_id: string }> {
  return fetcher('/trout/fundo', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Sector ─────────────────────────────────────────────────────────

export async function getSectors(
  farmId: string,
  fundoId: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResult<SectorItem>> {
  return fetcher('/trout/sector', {
    params: {
      farm_id: farmId,
      fundo_id: fundoId,
      page: String(page),
      page_size: String(pageSize),
    },
    next: { tags: [`sectors-${fundoId}`] },
  });
}

export async function getSectorSummary(sectorId: string): Promise<SectorSummary> {
  return fetcher('/trout/sector/summary', {
    params: { sector_id: sectorId },
    next: { tags: [`sector-${sectorId}`] },
  });
}

export async function createSector(
  data: {
    fundo_id: string;
    name: string;
    type_cultivation: string;
    type_lote: string;
    area: number;
  },
): Promise<{ sector_id: string }> {
  return fetcher('/trout/sector', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Cohort ─────────────────────────────────────────────────────────

export async function getCohorts(
  sectorId: string,
  page = 1,
  pageSize = 10,
): Promise<PaginatedResult<CohortItem>> {
  return fetcher('/trout/cohort', {
    params: {
      sector_id: sectorId,
      page: String(page),
      page_size: String(pageSize),
    },
    next: { tags: [`cohorts-${sectorId}`] },
  });
}

export async function getCohortBySector(sectorId: string): Promise<CohortSummary> {
  return fetcher('/trout/cohort/by-sector', {
    params: { sector_id: sectorId },
    next: { tags: [`cohort-sector-${sectorId}`] },
  });
}

export async function getCohortSummary(cohortId: string): Promise<CohortSummary> {
  return fetcher('/trout/cohort/summary', {
    params: { cohort_id: cohortId },
    next: { tags: [`cohort-${cohortId}`] },
  });
}

export async function createCohort(
  data: {
    sector_id: string;
    start_date: string;
    initial_num: number;
    initial_weight_min_g: number;
    initial_weight_max_g: number;
    current_stage?: string;
  },
): Promise<{ cohort_id: string }> {
  return fetcher('/trout/cohort', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Sampling ───────────────────────────────────────────────────────

export async function getSamplings(
  cohortId: string,
  page = 1,
  pageSize = 20,
): Promise<PaginatedResult<SamplingItem>> {
  return fetcher('/trout/sampling', {
    params: {
      cohort_id: cohortId,
      page: String(page),
      page_size: String(pageSize),
    },
    next: { tags: [`samplings-${cohortId}`] },
  });
}

export async function getWeightPredictions(
  cohortId: string,
): Promise<WeightPredictionPoint[]> {
  return fetcher('/trout/weight-predictions', {
    params: { cohort_id: cohortId },
    next: { tags: [`weight-predictions-${cohortId}`] },
  });
}

export async function createSampling(
  data: {
    cohort_id: string;
    temperature_c: number;
    dead_trout: number;
    num_sampled: number;
    weight_min_g: number;
    weight_max_g: number;
    details?: string;
  },
): Promise<{ sampling_id: string; message: string }> {
  return fetcher('/trout/sampling', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
