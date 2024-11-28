import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export function withAdminProtection<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function ProtectedRoute(props: T) {
    const { orgRole, isLoaded } = useAuth();

    // Wait for auth to be loaded
    if (!isLoaded) {
      return null; // or a loading spinner
    }

    const isAdmin = orgRole === "org:admin";

    if (!isAdmin) {
      redirect('/');
    }

    return <WrappedComponent {...props} />;
  };
}