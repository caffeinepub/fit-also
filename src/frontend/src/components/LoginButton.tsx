import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogIn, LogOut } from "lucide-react";
import React from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLanguage } from "../hooks/useLanguage";

export function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium opacity-70"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("nav.loggingIn")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAuth}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isAuthenticated
          ? "border border-border text-foreground hover:bg-muted"
          : "bg-primary text-primary-foreground hover:opacity-90 shadow-xs"
      }`}
    >
      {isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4" />
          {t("nav.logout")}
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          {t("nav.login")}
        </>
      )}
    </button>
  );
}
