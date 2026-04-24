'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createFarm,
  updateFarm,
  deleteFarm,
  createFundo,
  updateFundo,
  deleteFundo,
  createSector,
  updateSector,
  deleteSector,
  createCohort,
  updateCohort,
  deleteCohort,
  createSampling,
  updateSampling,
  deleteSampling,
} from '@/lib/api';

// ── Helpers ────────────────────────────────────────────────────────

export type ActionState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

/** Parsea un campo numérico del FormData. Retorna NaN si el valor no es convertible. */
function parseNumber(val: FormDataEntryValue | null): number {
  if (val === null || val === '') return NaN;
  const n = Number(val);
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

export async function updateFarmAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const farmId = formData.get('farm_id')?.toString();
  const name = formData.get('name')?.toString().trim();
  const location = formData.get('location')?.toString().trim();

  if (!farmId) return { success: false, error: 'Farm ID es requerido' };

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'El nombre es requerido';
  if (!location) fieldErrors.location = 'La ubicación es requerida';
  if (Object.keys(fieldErrors).length > 0) return { success: false, fieldErrors };

  try {
    await updateFarm(farmId, { name, location });
    revalidateTag('farms');
    revalidateTag(`farm-${farmId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al actualizar la granja' };
  }
}

export async function deleteFarmAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const farmId = formData.get('farm_id')?.toString();
  if (!farmId) return { success: false, error: 'Farm ID es requerido' };

  try {
    await deleteFarm(farmId);
    revalidateTag('farms');
    revalidateTag(`farm-${farmId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al eliminar la granja' };
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
    revalidateTag('farms');
    redirect(`/farms/${farmId}/fundos/${result.fundo_id}`);
  } catch (err: any) {
    if (isNextRedirect(err)) throw err;
    return { success: false, error: err.message || 'Error al crear el fundo' };
  }
}

export async function updateFundoAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fundoId = formData.get('fundo_id')?.toString();
  const farmId = formData.get('farm_id')?.toString();
  const name = formData.get('name')?.toString().trim();

  if (!fundoId) return { success: false, error: 'Fundo ID es requerido' };

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'El nombre es requerido';
  if (Object.keys(fieldErrors).length > 0) return { success: false, fieldErrors };

  try {
    await updateFundo(fundoId, { name });
    revalidateTag(`fundos-${farmId}`);
    revalidateTag(`fundo-${fundoId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al actualizar el fundo' };
  }
}

export async function deleteFundoAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fundoId = formData.get('fundo_id')?.toString();
  const farmId = formData.get('farm_id')?.toString();
  if (!fundoId) return { success: false, error: 'Fundo ID es requerido' };

  try {
    await deleteFundo(fundoId);
    revalidateTag(`fundos-${farmId}`);
    revalidateTag(`fundo-${fundoId}`);
    revalidateTag(`farm-${farmId}`);
    revalidateTag('farms');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al eliminar el fundo' };
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
  const typeCultivation = formData.get('type_cultivation')?.toString();
  const typeLote = formData.get('type_lote')?.toString();
  const area = parseNumber(formData.get('area'));

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'El nombre es requerido';
  if (!typeCultivation) fieldErrors.type_cultivation = 'El tipo de cultivo es requerido';
  if (!typeLote) fieldErrors.type_lote = 'El tipo de lote es requerido';
  if (isNaN(area)) fieldErrors.area = 'El área debe ser un número válido';
  else if (area <= 0) fieldErrors.area = 'El área debe ser mayor a 0';
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  try {
    const result = await createSector({
      fundo_id: fundoId!,
      name: name!,
      type_cultivation: typeCultivation!,
      type_lote: typeLote!,
      area,
    });
    revalidateTag(`sectors-${fundoId}`);
    revalidateTag(`fundo-${fundoId}`);
    revalidateTag(`farm-${farmId}`);
    revalidateTag('farms');
    redirect(`/farms/${farmId}/fundos/${fundoId}/sectors/${result.sector_id}`);
  } catch (err: any) {
    if (isNextRedirect(err)) throw err;
    return { success: false, error: err.message || 'Error al crear el sector' };
  }
}

export async function updateSectorAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const sectorId = formData.get('sector_id')?.toString();
  const fundoId = formData.get('fundo_id')?.toString();
  const farmId = formData.get('farm_id')?.toString();
  const name = formData.get('name')?.toString().trim();
  const typeCultivation = formData.get('type_cultivation')?.toString();
  const typeLote = formData.get('type_lote')?.toString();
  const area = parseNumber(formData.get('area'));
  const status = formData.get('status')?.toString();

  if (!sectorId) return { success: false, error: 'Sector ID es requerido' };

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'El nombre es requerido';
  if (!typeCultivation) fieldErrors.type_cultivation = 'El tipo de cultivo es requerido';
  if (!typeLote) fieldErrors.type_lote = 'El tipo de lote es requerido';
  if (isNaN(area)) fieldErrors.area = 'El área debe ser un número válido';
  else if (area <= 0) fieldErrors.area = 'El área debe ser mayor a 0';
  if (Object.keys(fieldErrors).length > 0) return { success: false, fieldErrors };

  try {
    await updateSector(sectorId, {
      name,
      type_cultivation: typeCultivation,
      type_lote: typeLote,
      area,
      status,
    });
    revalidateTag(`sectors-${fundoId}`);
    revalidateTag(`sector-${sectorId}`);
    revalidateTag(`fundo-${fundoId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al actualizar el sector' };
  }
}

export async function deleteSectorAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const sectorId = formData.get('sector_id')?.toString();
  const fundoId = formData.get('fundo_id')?.toString();
  const farmId = formData.get('farm_id')?.toString();
  if (!sectorId) return { success: false, error: 'Sector ID es requerido' };

  try {
    await deleteSector(sectorId);
    revalidateTag(`sectors-${fundoId}`);
    revalidateTag(`sector-${sectorId}`);
    revalidateTag(`fundo-${fundoId}`);
    revalidateTag(`farm-${farmId}`);
    revalidateTag('farms');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al eliminar el sector' };
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
  if (isNaN(initialNum)) fieldErrors.initial_num = 'Debe ser un número válido';
  else if (initialNum <= 0) fieldErrors.initial_num = 'Debe ser mayor a 0';
  if (isNaN(weightMin)) fieldErrors.initial_weight_min_g = 'Debe ser un número válido';
  else if (weightMin <= 0) fieldErrors.initial_weight_min_g = 'Debe ser mayor a 0';
  if (isNaN(weightMax)) fieldErrors.initial_weight_max_g = 'Debe ser un número válido';
  else if (weightMax < weightMin) fieldErrors.initial_weight_max_g = 'Debe ser >= peso mín.';
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
    revalidateTag(`cohort-sector-${sectorId}`);
    revalidateTag(`sector-${sectorId}`);
    redirect(`/farms/${farmId}/fundos/${fundoId}/sectors/${sectorId}`);
  } catch (err: any) {
    if (isNextRedirect(err)) throw err;
    return { success: false, error: err.message || 'Error al crear la cohorte' };
  }
}

export async function updateCohortAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const cohortId = formData.get('cohort_id')?.toString();
  const sectorId = formData.get('sector_id')?.toString();
  const startDate = formData.get('start_date')?.toString();
  const initialNum = parseNumber(formData.get('initial_num'));
  const weightMin = parseNumber(formData.get('initial_weight_min_g'));
  const weightMax = parseNumber(formData.get('initial_weight_max_g'));
  const stage = formData.get('current_stage')?.toString();
  const status = formData.get('status')?.toString();

  if (!cohortId) return { success: false, error: 'Cohort ID es requerido' };

  const fieldErrors: Record<string, string> = {};
  if (!startDate) fieldErrors.start_date = 'La fecha es requerida';
  if (isNaN(initialNum)) fieldErrors.initial_num = 'Debe ser un número válido';
  else if (initialNum <= 0) fieldErrors.initial_num = 'Debe ser mayor a 0';
  if (isNaN(weightMin)) fieldErrors.initial_weight_min_g = 'Debe ser un número válido';
  else if (weightMin <= 0) fieldErrors.initial_weight_min_g = 'Debe ser mayor a 0';
  if (isNaN(weightMax)) fieldErrors.initial_weight_max_g = 'Debe ser un número válido';
  else if (weightMax < weightMin) fieldErrors.initial_weight_max_g = 'Debe ser >= peso mín.';
  if (Object.keys(fieldErrors).length > 0) return { success: false, fieldErrors };

  try {
    await updateCohort(cohortId, {
      start_date: startDate,
      initial_num: initialNum,
      initial_weight_min_g: weightMin,
      initial_weight_max_g: weightMax,
      current_stage: stage || undefined,
      status: status || undefined,
    });
    revalidateTag(`cohort-sector-${sectorId}`);
    revalidateTag(`cohort-${cohortId}`);
    revalidateTag(`sector-${sectorId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al actualizar la cohorte' };
  }
}

export async function deleteCohortAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const cohortId = formData.get('cohort_id')?.toString();
  const sectorId = formData.get('sector_id')?.toString();
  if (!cohortId) return { success: false, error: 'Cohort ID es requerido' };

  try {
    await deleteCohort(cohortId);
    revalidateTag(`cohort-sector-${sectorId}`);
    revalidateTag(`cohort-${cohortId}`);
    revalidateTag(`sector-${sectorId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al eliminar la cohorte' };
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
  if (isNaN(temperatureC)) fieldErrors.temperature_c = 'Debe ser un número válido';
  else if (temperatureC < 0 || temperatureC > 30) fieldErrors.temperature_c = 'Debe estar entre 0 y 30 °C';
  if (isNaN(deadTrout)) fieldErrors.dead_trout = 'Debe ser un número válido';
  else if (deadTrout < 0) fieldErrors.dead_trout = 'Debe ser 0 o mayor';
  if (isNaN(numSampled)) fieldErrors.num_sampled = 'Debe ser un número válido';
  else if (numSampled <= 0) fieldErrors.num_sampled = 'Debe ser mayor a 0';
  if (isNaN(weightMin)) fieldErrors.weight_min_g = 'Debe ser un número válido';
  else if (weightMin <= 0) fieldErrors.weight_min_g = 'Debe ser mayor a 0';
  if (isNaN(weightMax)) fieldErrors.weight_max_g = 'Debe ser un número válido';
  else if (weightMax < weightMin) fieldErrors.weight_max_g = 'Debe ser >= peso mín.';
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

export async function updateSamplingAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const samplingId = formData.get('sampling_id')?.toString();
  const cohortId = formData.get('cohort_id')?.toString();
  const temperatureC = parseNumber(formData.get('temperature_c'));
  const deadTrout = parseNumber(formData.get('dead_trout'));
  const numSampled = parseNumber(formData.get('num_sampled'));
  const weightMin = parseNumber(formData.get('weight_min_g'));
  const weightMax = parseNumber(formData.get('weight_max_g'));
  const details = formData.get('details')?.toString().trim();

  if (!samplingId) return { success: false, error: 'Sampling ID es requerido' };

  const fieldErrors: Record<string, string> = {};
  if (isNaN(temperatureC)) fieldErrors.temperature_c = 'Debe ser un número válido';
  else if (temperatureC < 0 || temperatureC > 30) fieldErrors.temperature_c = 'Debe estar entre 0 y 30 °C';
  if (isNaN(deadTrout)) fieldErrors.dead_trout = 'Debe ser un número válido';
  else if (deadTrout < 0) fieldErrors.dead_trout = 'Debe ser 0 o mayor';
  if (isNaN(numSampled)) fieldErrors.num_sampled = 'Debe ser un número válido';
  else if (numSampled <= 0) fieldErrors.num_sampled = 'Debe ser mayor a 0';
  if (isNaN(weightMin)) fieldErrors.weight_min_g = 'Debe ser un número válido';
  else if (weightMin <= 0) fieldErrors.weight_min_g = 'Debe ser mayor a 0';
  if (isNaN(weightMax)) fieldErrors.weight_max_g = 'Debe ser un número válido';
  else if (weightMax < weightMin) fieldErrors.weight_max_g = 'Debe ser >= peso mín.';
  if (Object.keys(fieldErrors).length > 0) return { success: false, fieldErrors };

  try {
    await updateSampling(samplingId, {
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
    return { success: false, error: err.message || 'Error al actualizar la medición' };
  }
}

export async function deleteSamplingAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const samplingId = formData.get('sampling_id')?.toString();
  const cohortId = formData.get('cohort_id')?.toString();
  if (!samplingId) return { success: false, error: 'Sampling ID es requerido' };

  try {
    await deleteSampling(samplingId);
    revalidateTag(`samplings-${cohortId}`);
    revalidateTag(`cohort-${cohortId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al eliminar la medición' };
  }
}
