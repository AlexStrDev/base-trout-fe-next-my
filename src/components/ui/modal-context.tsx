'use client';

import { createContext, useContext } from 'react';

export const ModalCloseContext = createContext<() => void>(() => {});
export const useModalClose = () => useContext(ModalCloseContext);
