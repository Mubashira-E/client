import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useAuthStore } from "@/stores/useAuthStore";

export function useAuth() {
  const { jwtToken, setJwtToken } = useAuthStore();
  const {
    data: user,
    isPending: isLoading,
    error,
    isError,
  } = useGetUserDetailsQuery();

  const isAuthenticated = !!jwtToken && !!user && !isError;

  const logout = () => {
    setJwtToken(null);
  };

  return {
    user,
    jwtToken,
    isAuthenticated,
    isLoading,
    error,
    isError,
    logout,
  };
}
