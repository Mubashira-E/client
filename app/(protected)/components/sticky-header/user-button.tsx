"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useLogoutMutationQuery } from "@/queries/auth/useLogoutMutationQuery";
import { useAuthStore } from "@/stores/useAuthStore";

export function UserButton() {
  const router = useRouter();

  const { mutate: logout, isPending } = useLogoutMutationQuery();
  const {
    data: userDetails,
    isPending: isUserDetailsPending,
    error: userDetailsError,
  } = useGetUserDetailsQuery();

  if (isUserDetailsPending) {
    return (
      <section className="flex h-full items-center gap-3">
        <div className="h-8 items-center border-l" />
        <div className="flex w-full items-center gap-3 pr-4">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </section>
    );
  }

  if (userDetailsError && isAxiosError(userDetailsError)) {
    if (
      userDetailsError.response?.status === 401
      || userDetailsError.response?.status === 403
    ) {
      useAuthStore.getState().setJwtToken(null);
      router.push("/login");
    }
  }

  if (!userDetails) {
    return null;
  }

  const { firstName, lastName } = userDetails;
  const displayFirstName = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
    : "";
  const displayLastName = lastName
    ? lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
    : "";
  const displayInitial = (firstName?.charAt(0) || "?").toUpperCase();

  return (
    <section className="flex h-full items-center gap-3">
      <div className="h-8 border-l" />
      <div className="flex w-full items-center gap-3 pr-4">
        <Avatar className="size-8">
          <AvatarFallback className="flex items-center justify-center bg-primary text-primary-foreground font-bold">
            {displayInitial}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-start items-start">
          <p className="line-clamp-1 text-sm font-medium text-primary">
            {`${displayFirstName} ${displayLastName}`}
          </p>
          <button
            type="button"
            onClick={() => logout()}
            disabled={isPending}
            aria-label={isPending ? "Logging out" : "Logout"}
            className="text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </section>
  );
}
