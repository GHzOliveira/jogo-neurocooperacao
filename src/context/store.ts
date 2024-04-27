import { create } from 'zustand';
import { PersistStorage, persist } from 'zustand/middleware';

type State = {
    nomeUnidade: string;
    numRounds: number;
    nEuros: string[];
    retribuicao: string[];
    quantidadeRetribuicao: string[];
    setNomeUnidade: (nome: string) => void;
    setNumRounds: (num: number) => void;
    setNEuros: (nEuros: string[]) => void;
    setRetribuicao: (retribuicao: string[]) => void;
    setQuantidadeRetribuicao: (quantidadeRetribuicao: string[]) => void;
};

const store = (set: (state: Partial<State>) => void) => ({
    nomeUnidade: '',
    numRounds: 0,
    nEuros: [] as string[],
    retribuicao: [] as string[],
    quantidadeRetribuicao: [] as string[],
    setNomeUnidade: (nome: string) => set({ nomeUnidade: nome }),
    setNumRounds: (num: number) => set({ numRounds: num }),
    setNEuros: (nEuros: string[]) => set({ nEuros }),
    setRetribuicao: (retribuicao: string[]) => set({ retribuicao }),
    setQuantidadeRetribuicao: (quantidadeRetribuicao: string[]) =>
        set({ quantidadeRetribuicao }),
});

const customStorage: PersistStorage<State> = {
    getItem: (name) => {
        const item = localStorage.getItem(name);
        return item ? JSON.parse(item) : null;
    },
    setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
    removeItem: (name) => localStorage.removeItem(name),
};

export const useStore = create(
    persist(store, {
        name: 'my-app-storage',
        storage: customStorage,
    }),
);
