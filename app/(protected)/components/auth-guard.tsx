"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useAuthStore } from "@/stores/useAuthStore";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const { setJwtToken, hasAcceptedTerms, hasJustLoggedIn, setHasJustLoggedIn } = useAuthStore();

  const {
    error,
    isError,
    isPending,
    data: userDetails,
  } = useGetUserDetailsQuery();

  useEffect(() => {
    const currentToken = useAuthStore.getState().jwtToken;

    if (!currentToken) {
      router.push("/login");
      return;
    }

    if (isError) {
      setJwtToken(null);
      router.push("/login");
    }
  }, [isError, error, router, setJwtToken]);

  useEffect(() => {
    if (userDetails && hasJustLoggedIn && !hasAcceptedTerms) {
      const frameId = requestAnimationFrame(() => {
        setHasJustLoggedIn(false);
      });

      return () => {
        cancelAnimationFrame(frameId);
      };
    }
  }, [userDetails, hasJustLoggedIn, hasAcceptedTerms, setHasJustLoggedIn]);

  const currentToken = useAuthStore.getState().jwtToken;

  if (!currentToken) {
    return null;
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-gray-600">Loading Workspace</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return null;
  }

  if (userDetails) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-gray-600">Loading Workspace</p>
      </div>
    </div>
  );
}
