'use client';

import { useActionState, useRef, useEffect } from 'react';
import type { ActionState } from '@/actions/mutations';

type ServerAction = (prev: ActionState, data: FormData) => Promise<ActionState>;

interface UseFormActionOptions {
  resetOnSuccess?: boolean;
}

export function useFormAction(action: ServerAction, options?: UseFormActionOptions) {
  const resetOnSuccess = options?.resetOnSuccess ?? false;
  const [state, formAction] = useActionState(action, { success: false });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && state.success) {
      formRef.current?.reset();
    }
  }, [state, resetOnSuccess]);

  return { state, formAction, formRef };
}
