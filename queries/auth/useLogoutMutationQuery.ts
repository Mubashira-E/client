import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";

export function useLogoutMutationQuery() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post(authEndpoints.logout);
      return response.data;
    },
    onSettled: () => {
      const authStore = useAuthStore.getState();
      authStore.setJwtToken(null);
      authStore.setHasAcceptedTerms(false);
      authStore.setHasJustLoggedIn(false);
      router.push("/login");
    },
  });
}
