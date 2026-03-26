import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import type { UserRole } from "@/types/firestore";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: UserRole;
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();
  const effectiveUser = user || auth.currentUser;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <p className="text-sm text-muted-foreground font-body">Checking your session...</p>
      </div>
    );
  }

  if (!effectiveUser) {
    const roleParam = role ? `?role=${role}` : "";
    return <Navigate to={`/login${roleParam}`} replace state={{ from: location }} />;
  }

  if (role && userProfile?.role && userProfile.role !== role) {
    return <Navigate to={userProfile.role === "investor" ? "/investor/dashboard" : "/startup/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
