"use client";

import type { LoginRequestPayload } from "@/queries/auth/useLoginMutationQuery";
import { AxiosError } from "axios";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useMount } from "react-use";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HoverPeek } from "@/components/ui/link-preview";
import { useLoginMutationQuery } from "@/queries/auth/useLoginMutationQuery";
import { useAuthStore } from "@/stores/useAuthStore";

type LoginErrorResponse = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  message?: string;
};

export function LogInForm() {
  const router = useRouter();
  const { jwtToken } = useAuthStore.getState();

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequestPayload>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isPendingNavigation, startTransition] = useTransition();
  const { mutateAsync: loginAsync, isPending, isSuccess, error } = useLoginMutationQuery();

  const loginErrorMessage = useMemo(() => {
    if (!error) {
      return null;
    }

    if (!(error instanceof AxiosError)) {
      return "We could not sign you in. Please try again.";
    }

    const responseData = error.response?.data as LoginErrorResponse | undefined;
    const status = error.response?.status ?? responseData?.status;
    const title = responseData?.title?.toLowerCase() ?? "";
    const detail = responseData?.detail?.toLowerCase() ?? "";
    const normalizedMessage = responseData?.message?.toLowerCase() ?? "";

    const invalidCredentialsHints = ["invalid credentials", "unauthorized"];
    const isInvalidCredentials
      = status === 401
        && invalidCredentialsHints.some(
          hint => title.includes(hint) || detail.includes(hint) || normalizedMessage.includes(hint),
        );

    if (isInvalidCredentials) {
      return "Incorrect username or password. Please try again.";
    }

    return "We are unable to process your request right now. Please try again later or contact support if the issue continues.";
  }, [error]);

  useMount(() => {
    if (jwtToken) {
      router.push("/");
    }
  });

  useEffect(() => {
    if (isSuccess) {
      startTransition(() => {
        router.push("./");
      });
    }
  }, [isSuccess, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setLoginError(loginErrorMessage);
  }, [loginErrorMessage]);

  const onSubmit = async (data: LoginRequestPayload) => {
    setLoginError(null);
    await loginAsync(data);
  };

  return (
    <section className="bg-white w-full flex flex-col items-center justify-center">
      <section className="w-full px-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 text-sm">Sign into your account to continue</p>
          </div>
          <div className="overflow-hidden transition-all duration-300">
            {loginError && (
              <div
                data-testid="error-message"
                className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3"
              >
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-red-600">
                  {loginError}
                </p>
              </div>
            )}
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <label htmlFor="username" className="text-gray-700 mb-2">
                Username
              </label>
              <Input
                id="username"
                {...register("username", {
                  required: "Username is required",
                })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {watch("password")?.length > 0 && (
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword
                      ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        )
                      : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button data-testid="login-button" className="h-9" type="submit" disabled={isPending || isPendingNavigation} isLoading={isPending || isPendingNavigation}>
              Log In
            </Button>
          </form>
        </div>
      </section>
      <section className="absolute bottom-0 w-full">
        <div className="text-center text-gray-600 text-sm py-4">
          <p>
            © 2026 RedSky Consultancy Services | All rights reserved | Version 1.0
          </p>
          <HoverPeek url="https://www.redskyconsultancy.com/">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm"
              href="https://www.redskyconsultancy.com/"
            >
              RedSky Consultancy Services
            </Link>
          </HoverPeek>
        </div>
      </section>
    </section>
  );
}
