'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { AuthProvider } from '@/contexts/auth-context';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      // Get auth status from localStorage
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const staffId = localStorage.getItem('staffId');
      const hasValidAuth = isLoggedIn === 'true' && staffId;

      

      if (pathname === '/login') {
        // On login page - always allow access
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        // On other pages - check authentication
        if (hasValidAuth) {
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          setIsAuthenticated(false);
          setIsLoading(false);
          router.push('/login');
        }
      }
    };

    // Check immediately and after a short delay to handle localStorage timing
    checkAuth();
    const timeoutId = setTimeout(checkAuth, 200);

    return () => clearTimeout(timeoutId);
  }, [router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect to login)
  if (!isAuthenticated) {
    return null;
  }

  // Render based on current page
  if (pathname === '/login') {
    // Login page - render without MainLayout but with AuthProvider
    return <AuthProvider>{children}</AuthProvider>;
  } else {
    // All other pages - render with MainLayout and AuthProvider
    return (
      <AuthProvider>
        <MainLayout>{children}</MainLayout>
      </AuthProvider>
    );
  }
} 