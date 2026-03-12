import type { Metadata } from "next";
import { getLoginImageUrl } from "@/lib/config";

import doctorsMonitor from "@/public/assets/images/login/login-banner.jpg";
import { LogInForm } from "./components/login-form";
import { LoginImageSection } from "./components/login-image-section";

export const metadata: Metadata = {
  title: "E-Medical Record/ Login",
  description: "E-Medical Record/ Login",
};

export default function Login() {
  const loginImageUrl = getLoginImageUrl();
  const imageSrc = loginImageUrl || doctorsMonitor;

  return (
    <section className="flex h-screen flex-col overflow-x-hidden bg-white sm:flex-row">
      <LoginImageSection imageSrc={imageSrc} />
      <section className="flex h-full w-full max-w-3xl translate-y-0 transform flex-col items-center justify-center overflow-x-hidden bg-white opacity-100 transition-all duration-500 ease-in-out lg:max-w-lg px-4">
        <LogInForm />
      </section>
    </section>
  );
}
