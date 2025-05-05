import {create} from "zustand"

type ErrorData = {
    error: string | null
    setError: (message: string) => void
    clearError: () => void
}

export const useErrorStore = create<ErrorData>((set) => ({
    error: null,
    setError: (msg) => set({error: msg}),
    clearError: () => ({error: null})
}));