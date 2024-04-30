import { create } from 'zustand';
import { PersistStorage, persist } from 'zustand/middleware';

type State = {
    userId: string;
    nomeUnidade: string;
    numRounds: string;
    nEuros: string[];
    retribuicao: string[];
    qntRetribuicao: string[];
    groups: any[];
    messages: any[];
    setUser: (userId: string) => void;
    setNomeUnidade: (nome: string) => void;
    setNumRounds: (num: string) => void;
    setNEuros: (nEuros: string[]) => void;
    setRetribuicao: (retribuicao: string[]) => void;
    setQntRetribuicao: (qntRetribuicao: string[]) => void;
    setGroups: (groups: any[]) => void;
    setMessages: (messages: any[]) => void;
};

const store = (set: (state: Partial<State>) => void) => ({
    userId: '',
    nomeUnidade: '',
    numRounds: '',
    nEuros: [] as string[],
    retribuicao: [] as string[],
    qntRetribuicao: [] as string[],
    groups: [] as any[],
    messages: [] as any[],
    setUser: (userId: string) => set({ userId }),
    setNomeUnidade: (nome: string) => set({ nomeUnidade: nome }),
    setNumRounds: (num: string) => set({ numRounds: num }),
    setNEuros: (nEuros: string[]) => set({ nEuros }),
    setRetribuicao: (retribuicao: string[]) => set({ retribuicao }),
    setQntRetribuicao: (qntRetribuicao: string[]) => set({ qntRetribuicao }),
    setGroups: (groups: any[]) => set({ groups }),
    setMessages: (messages: any[]) => set({ messages }),
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
