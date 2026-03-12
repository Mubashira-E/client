import { useMutation } from "@tanstack/react-query";
import { authEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";

export type LoginRequestPayload = {
  username: string;
  password: string;
};

export type LoginResponseModel = {
  accessToken: string;
  userName: string;
  expiryDate: string;
  refreshToken: string;
  refreshTokenExpiry: string;
};

export function useLoginMutationQuery() {
  return useMutation({
    mutationFn: async (data: LoginRequestPayload) => {
      const response = await api.post<LoginResponseModel>(
        authEndpoints.login,
        { email: "", password: data.password, userName: data.username },
      );
      return response.data;
    },
    onSuccess: (data) => {
      const authStore = useAuthStore.getState();
      authStore.setJwtToken(data.accessToken);
      authStore.setHasJustLoggedIn(true);
    },
  });
}
