// ── Pagination ─────────────────────────────────────────────────────
export interface PaginatedResult<T> {
  count: number;
  page: number;
  page_size: number;
  num_pages: number;
  results: T[];
}

// ── Farm ───────────────────────────────────────────────────────────
export interface FarmItem {
  id: string;
  name: string;
  location: string;
  fundo_count: number;
  sector_count: number;
}

export interface FarmSummary {
  farm_id: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  fundo_count: number;
  sector_count: number;
}

export interface CreateFarmPayload {
  user_id: string;
  name: string;
  location: string;
}

// ── Fundo ──────────────────────────────────────────────────────────
export interface FundoItem {
  id: string;
  name: string;
  sector_count: number;
}

export interface FundoSummary {
  fundo_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  sector_count: number;
}

export interface CreateFundoPayload {
  farm_id: string;
  name: string;
}

// ── Sector ─────────────────────────────────────────────────────────
export type TypeCultivation = 'ciclo_completo' | 'por_etapa';
export type TypeLote = 'jaula' | 'poza';
export type SectorStatus = 'activo' | 'inactivo';

export interface SectorItem {
  id: string;
  name: string;
  type_cultivation: string;
  type_lote: string;
  area: number;
  status: string;
  cohort_id: string | null;
}

export interface SectorSummary {
  sector_id: string;
  name: string;
  type_cultivation: string;
  type_lote: string;
  area: number;
  status: string;
  created_at: string;
  updated_at: string;
  cohort_id: string | null;
}

export interface CreateSectorPayload {
  fundo_id: string;
  name: string;
  type_cultivation: TypeCultivation;
  type_lote: TypeLote;
  area: number;
  status?: SectorStatus;
}

// ── Cohort Trout ───────────────────────────────────────────────────
export type CohortStage = 'eggs' | 'fingerlings' | 'young_fish' | 'fattening';
export type CohortStatus = 'active' | 'harvested' | 'lost';

export interface CohortItem {
  id: string;
  start_date: string;
  initial_num: number;
  initial_weight_min_g: number;
  initial_weight_max_g: number;
  current_stage: string | null;
  status: string;
  sampling_count: number;
}

export interface CohortSummary {
  cohort_id: string;
  start_date: string;
  initial_num: number;
  initial_weight_min_g: number;
  initial_weight_max_g: number;
  current_stage: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  sampling_count: number;
  total_dead: number;
  alive: number;
  last_weight_average_g: number | null;
  last_temperature_c: number | null;
  last_sampling_date: string | null;
}

export interface CreateCohortPayload {
  sector_id: string;
  start_date: string;
  initial_num: number;
  initial_weight_min_g: number;
  initial_weight_max_g: number;
  current_stage?: CohortStage;
}

// ── Sampling ───────────────────────────────────────────────────────
export interface SamplingItem {
  id: string;
  timestamps: string;
  temperature_c: number;
  dead_trout: number;
  num_sampled: number;
  weight_min_g: number;
  weight_max_g: number;
  weight_average_g: number;
  details: string | null;
}

export interface CreateSamplingPayload {
  cohort_id: string;
  temperature_c: number;
  dead_trout: number;
  num_sampled: number;
  weight_min_g: number;
  weight_max_g: number;
  details?: string;
}

// ── Enums labels (para UI) ─────────────────────────────────────────
export const STAGE_LABELS: Record<string, string> = {
  eggs: 'Huevos',
  fingerlings: 'Alevines',
  young_fish: 'Juveniles',
  fattening: 'Engorde',
};

export const STATUS_LABELS: Record<string, string> = {
  active: 'Activa',
  harvested: 'Cosechada',
  lost: 'Perdida',
  activo: 'Activo',
  inactivo: 'Inactivo',
};

export const CULTIVATION_LABELS: Record<string, string> = {
  ciclo_completo: 'Ciclo completo',
  por_etapa: 'Por etapa',
};

export const LOTE_LABELS: Record<string, string> = {
  jaula: 'Jaula',
  poza: 'Poza',
};
