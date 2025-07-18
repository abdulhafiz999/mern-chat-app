

import { create } from "zustand";
import api from "../lib/axios";


const useAuthHook = create((set) => ({
    authUser: null,

    isCheckingAuth: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await fetch("/auth/check" ); 
            set({ authUser: await response.json(), isCheckingAuth: false });
            } catch (error) {
            console.error("Error checking authentication:", error)
            set({ isCheckingAuth: false }); 
        }
    },
})); 

export default useAuthHook;