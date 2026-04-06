'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createFarm,
  createFundo,
  createSector,
  createCohort,
  createSampling,
} from '@/lib/api';

// ── Helpers ────────────────────────────────────────────────────────

export type ActionState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseNumber(val: FormDataEntryValue | null): number {
  const n = Number(val);
  if (isNaN(n)) return 0;
  return n;
}

function isNextRedirect(err: unknown): boolean {
  return typeof (err as any)?.digest === 'string' && (err as any).digest.startsWith('NEXT_REDIRECT');
}

// ── Farm ───────────────────────────────────────────────────────────

export async function createFarmAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = formData.get('name')?.toString().trim();
  const location = formData.get('location')?.toString().trim();

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'El nombre es requerido';
  if (!location) fieldErrors.location = 'La ubicación es requerida';
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  try {
    const result = await createFarm({ name: name!, location: location! });
    revalidateTag('farms');
    redirect(`/farms/${result.farm_id}`);
  } catch (err: any) {
    if (isNextRedirect(err)) throw err;
    return { success: false, error: err.message || 'Error al crear la granja' };
  }
}

// ── Fundo ──────────────────────────────────────────────────────────

export async function createFundoAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const farmId = formData.get('farm_id')?.toString();
  const name = formData.get('name')?.toString().trim();

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'El nombre es requerido';
  if (!farmId) fieldErrors.farm_id = 'Farm ID es requerido';
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  try {
    const result = await createFundo({ farm_id: farmId!, name: name! });
    revalidateTag(`fundos-${farmId}`);
    revalidateTag(`farm-${farmId}`);
    redirect(`/farms/${farmId}/fundos/${result.fundo_id}`);
  } catch (err: any) {
    if (isNextRedirect(err)) throw err;
    return { success: false, error: err.message || 'Error al crear el fundo' };
  }
}

// ── Sector ─────────────────────────────────────────────────────────

export async function createSectorAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fundoId = formData.get('fundo_id')?.toString();
  const farmId = formData.get('farm_id')?.toString();
  const name = formData.get('name')?.toString().trim();
  const typeLote = formData.get('type_lote')?.toString();
  const area = parseNumber(formData.get('area'));

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'El nombre es requerido';
  if (!typeLote) fieldErrors.type_lote = 'El tipo es requerido';
  if (area <= 0) fieldErrors.area = 'El área debe ser mayor a 0';
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  try {
    const result = await createSector({
      fundo_id: fundoId!,
      name: name!,
      type_cultivation: 'trout',
      type_lote: typeLote!,
      area,
    });
    revalidateTag(`sectors-${fundoId}`);
    revalidateTag(`fundo-${fundoId}`);
    redirect(`/farms/${farmId}/fundos/${fundoId}/sectors/${result.sector_id}`);
  } catch (err: any) {
    if (isNextRedirect(err)) throw err;
    return { success: false, error: err.message || 'Error al crear el sector' };
  }
}

// ── Cohort ─────────────────────────────────────────────────────────

export async function createCohortAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const sectorId = formData.get('sector_id')?.toString();
  const farmId = formData.get('farm_id')?.toString();
  const fundoId = formData.get('fundo_id')?.toString();
  const startDate = formData.get('start_date')?.toString();
  const initialNum = parseNumber(formData.get('initial_num'));
  const weightMin = parseNumber(formData.get('initial_weight_min_g'));
  const weightMax = parseNumber(formData.get('initial_weight_max_g'));
  const stage = formData.get('current_stage')?.toString();

  const fieldErrors: Record<string, string> = {};
  if (!startDate) fieldErrors.start_date = 'La fecha es requerida';
  if (initialNum <= 0) fieldErrors.initial_num = 'Debe ser mayor a 0';
  if (weightMin <= 0) fieldErrors.initial_weight_min_g = 'Debe ser mayor a 0';
  if (weightMax < weightMin) fieldErrors.initial_weight_max_g = 'Debe ser >= peso mín.';
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  try {
    const result = await createCohort({
      sector_id: sectorId!,
      start_date: startDate!,
      initial_num: initialNum,
      initial_weight_min_g: weightMin,
      initial_weight_max_g: weightMax,
      current_stage: stage || undefined,
    });
    revalidateTag(`cohorts-${sectorId}`);
    revalidateTag(`sector-${sectorId}`);
    redirect(
      `/farms/${farmId}/fundos/${fundoId}/sectors/${sectorId}/cohorts/${result.cohort_id}`,
    );
  } catch (err: any) {
    if (isNextRedirect(err)) throw err;
    return { success: false, error: err.message || 'Error al crear la cohorte' };
  }
}

// ── Sampling ───────────────────────────────────────────────────────

export async function createSamplingAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const cohortId = formData.get('cohort_id')?.toString();
  const temperatureC = parseNumber(formData.get('temperature_c'));
  const deadTrout = parseNumber(formData.get('dead_trout'));
  const numSampled = parseNumber(formData.get('num_sampled'));
  const weightMin = parseNumber(formData.get('weight_min_g'));
  const weightMax = parseNumber(formData.get('weight_max_g'));
  const details = formData.get('details')?.toString().trim();

  const fieldErrors: Record<string, string> = {};
  if (temperatureC < 0 || temperatureC > 30)
    fieldErrors.temperature_c = 'Debe estar entre 0 y 30 °C';
  if (numSampled <= 0) fieldErrors.num_sampled = 'Debe ser mayor a 0';
  if (weightMin <= 0) fieldErrors.weight_min_g = 'Debe ser mayor a 0';
  if (weightMax < weightMin)
    fieldErrors.weight_max_g = 'Debe ser >= peso mín.';
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  try {
    await createSampling({
      cohort_id: cohortId!,
      temperature_c: temperatureC,
      dead_trout: deadTrout,
      num_sampled: numSampled,
      weight_min_g: weightMin,
      weight_max_g: weightMax,
      details: details || undefined,
    });
    revalidateTag(`samplings-${cohortId}`);
    revalidateTag(`cohort-${cohortId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al registrar la medición' };
  }
}
