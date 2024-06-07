import { useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/router";

export default function Load() {
  const { load } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/locations",
  });
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    const params = router.query;

    load({
      setErrors: () => {},
      setStatus: () => {},
      params,
    });
  }, [router.isReady]);

  return <>Loading...</>;
}
