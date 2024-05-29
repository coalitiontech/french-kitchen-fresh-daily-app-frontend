import useSWR from "swr";
import axios from "@/plugins/axios";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const useAuth = ({ middleware, redirectIfAuthenticated = "" } = {}) => {
  const router = useRouter();
  const {
    data: settings,
    error,
    mutate,
  } = useSWR("/api/settings/show", () =>
    axios
      .get("/api/settings/show")
      .then((res) => ({ ...res?.data, config:res?.config }))
      .catch((error) => {
        console.log(error);
        // TODO: handle error.
      })
  );

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const load = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .get("/api/shopify/load", props)
      .then((res) => {
        console.log(res);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("shopify_url", res.data.shopify_url);
        return mutate();
      })
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && settings)
      router.push(redirectIfAuthenticated);
    if (middleware === "auth" && error) logout();
  }, [settings, error]);

  return {
    settings,
    load,
    logout,
  };
};
