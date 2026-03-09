import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { setToken, removeToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function useLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: typeof api.auth.login.input._type) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      setToken(data.token);
      toast({
        title: "Welcome back",
        description: "You have successfully logged in.",
      });
      setLocation("/admin");
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useLogout() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  return () => {
    removeToken();
    queryClient.clear();
    setLocation("/admin/login");
  };
}
