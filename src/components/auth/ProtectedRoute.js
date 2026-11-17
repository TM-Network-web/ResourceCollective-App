
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        await authService.getCurrentUser();

        if (active) {
          setAuthorized(true);
        }
      } catch {
        if (active) {
          router.replace("/login");
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">
          Verifying your session...
        </p>
      </div>
    );
  }

  return children;
}
