'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Staff } from '@/lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Query Firestore for staff with matching email
      const staffCollection = collection(db, 'staff');
      const q = query(staffCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Email hoặc mật khẩu không đúng');
        return;
      }

      // Check if password matches (in real app, passwords should be hashed)
      let isValidLogin = false;
      querySnapshot.forEach((doc) => {
        const staffData = doc.data() as Staff;
        // For demo purposes, we'll assume password is stored as plain text
        // In production, you should hash passwords and compare hashes
        if (staffData.email === email && staffData.password === password) {
          isValidLogin = true;
          // Store login state (you might want to use proper auth here)
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('staffId', staffData.id);
          localStorage.setItem('staffName', staffData.name);
        }
      });

      if (isValidLogin) {
        setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
        // Keep loading state and delay redirect
        setTimeout(() => {
          router.push('/');
        }, 1500);
        // Don't set loading to false for success case
      } else {
        setError('Email hoặc mật khẩu không đúng');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 border border-border bg-card">
        <CardHeader className="text-center pb-2">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="https://i.postimg.cc/6ptfnpqy/clinic-8217926.png"
              alt="Clinic Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          
          {/* App Name */}
          <h1 className="text-3xl font-headline font-bold text-foreground tracking-wide mb-8">
            QUẢN LÝ PHÒNG KHÁM
          </h1>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="mb-4 border-primary/20 bg-primary/10 shadow-lg">
              <AlertDescription className="text-primary font-medium">{success}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Tên đăng nhập (Email)
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Mật khẩu
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base focus:ring-ring"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{success ? 'Đang chuyển hướng...' : 'Đang đăng nhập...'}</span>
                </div>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm text-foreground font-medium mb-2">Thông tin demo:</p>
            <p className="text-xs text-muted-foreground mb-1">
              Email: <span className="font-mono bg-background px-1 rounded">minh.bs@clinic.com</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Mật khẩu: <span className="font-mono bg-background px-1 rounded">111</span>
            </p>
          </div>
        </CardContent>
        
        {/* Footer */}
        <CardFooter className="justify-center pt-4 pb-6">
          <p className="text-xs text-muted-foreground">
            Phát triển bởi <span className="font-medium text-foreground">Nguyễn Thiện Chí</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 