import { create } from 'zustand';

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

export type ModelState = {
  status: ModelStatus;
  progress: number;
  id: string | null;
};

export type ModelName = 'parakeet' | 'medgemma' | 'embedding' | 'tts';

type ModelStore = {
  parakeet: ModelState;
  medgemma: ModelState;
  embedding: ModelState;
  tts: ModelState;
  setModelState: (model: ModelName, patch: Partial<ModelState>) => void;
  allReady: () => boolean;
  anyLoading: () => boolean;
};

const idle = (): ModelState => ({ status: 'idle', progress: 0, id: null });

export const useModelStore = create<ModelStore>((set, get) => ({
  parakeet: idle(),
  medgemma: idle(),
  embedding: idle(),
  tts: idle(),

  setModelState: (model, patch) =>
    set((s) => ({ [model]: { ...s[model], ...patch } })),

  allReady: () => {
    const s = get();
    return (
      s.parakeet.status === 'ready' &&
      s.medgemma.status === 'ready' &&
      s.embedding.status === 'ready' &&
      s.tts.status === 'ready'
    );
  },

  anyLoading: () => {
    const s = get();
    return [s.parakeet, s.medgemma, s.embedding, s.tts].some(
      (m) => m.status === 'loading'
    );
  },
}));
