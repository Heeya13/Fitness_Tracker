import { create } from "zustand";
import { axiosInstance } from "../lin/axios.js";


const useProfileStore = create((set) => ({
    profile: null,
    userDetails: null,
    goals: [],
    activities: [],
    loading: false,
    error: null,

    fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
            console.log("Fetching profile data...");
            
            // Try each request individually to identify which one fails
            try {
                const profileResponse = await axiosInstance.get("/api/profile");
                console.log("Profile response:", profileResponse.data);
                set(state => ({ profile: profileResponse.data }));
            } catch (error) {
                console.error("Profile fetch error:", error);
                throw new Error(`Profile fetch failed: ${error.response?.data?.message || error.message}`);
            }
            
            try {
                const userResponse = await axiosInstance.get("/api/user/details");
                console.log("User response:", userResponse.data);
                set(state => ({ userDetails: userResponse.data }));
            } catch (error) {
                console.error("User details fetch error:", error);
                throw new Error(`User details fetch failed: ${error.response?.data?.message || error.message}`);
            }
            
            try {
                const goalsResponse = await axiosInstance.get("/api/goals/viewGoal");
                console.log("Goals response:", goalsResponse.data);
                set(state => ({ goals: goalsResponse.data.goals || [] }));
            } catch (error) {
                console.error("Goals fetch error:", error);
                throw new Error(`Goals fetch failed: ${error.response?.data?.message || error.message}`);
            }
            
            try {
                const activitiesResponse = await axiosInstance.get("/api/goals/allActivities");
                console.log("Activities response:", activitiesResponse.data);
                set(state => ({ activities: activitiesResponse.data.activities || [] }));
            } catch (error) {
                console.error("Activities fetch error:", error);
                throw new Error(`Activities fetch failed: ${error.response?.data?.message || error.message}`);
            }
            
            set({ loading: false });
        } catch (error) {
            console.error("Profile fetch error:", error);
            console.error("Error response:", error.response);
            set({ 
                error: error.message || "Failed to fetch profile data", 
                loading: false 
            });
        }
    },

    createProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post("/api/profile", profileData);
            set({ profile: response.data, loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to create profile", loading: false });
            throw error;
        }
    },

    updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.put("/api/profile", profileData);
            set({ profile: response.data, loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to update profile", loading: false });
            throw error;
        }
    }
}));

export default useProfileStore;
