"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { login, register } from '@/api/auth-api';
import Logo from "@/app/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from 'lucide-react';
import CommonFooter from "@/app/components/CommonFooter";

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [firstName, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, currentPassword });

      toast({
        title: "Login Successful",
        description: "Redirecting to home page...",
        duration: 2000,
      });

      // Clear form fields
      setEmail('');
      setCurrentPassword('');

      // Determine redirect URL
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get('callbackUrl') || '/home';

      // Slight delay to show toast
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 1000);

    } catch (error: any) {
      console.error('Login failed:', error);

      const errorMessage = error.response?.data ||
          error.message ||
          "Login failed. Please check your credentials.";

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({ firstName, email, newPassword });

      toast({
        title: "Registration Successful",
        description: "Please login with your new account",
        duration: 5000,
      });

      // Clear form fields
      setName('');
      setEmail('');
      setNewPassword('');

      const tabsList = document.querySelector('[role="tablist"]');
      const loginTab = tabsList?.querySelector('[value="login"]') as HTMLElement;
      loginTab?.click();

    } catch (error: any) {
      console.error('Registration failed:', error);

      const errorMessage = error.response?.data ||
          error.message ||
          "Registration failed. Please check your information.";

      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'login' | 'register') => {
    if (field === 'login') {
      setShowPassword(!showPassword);
    } else {
      setShowRegisterPassword(!showRegisterPassword);
    }
  };

  return (
      <div className="flex-col">
        <div className={"flex relative min-h-screen items-center justify-center bg-neutral-100"}>
          <div className="absolute top-10 lg:w-96 lg:left-[37%]">
          <Logo />
        </div>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="w-[350px] rounded-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-gray-800">Welcome</CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-none">
                    <TabsTrigger className="rounded-none" value="login">Login</TabsTrigger>
                    <TabsTrigger className="rounded-none" value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="relative">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-none"
                            disabled={loading}
                            required
                        />
                      </div>
                      <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="rounded-none pr-10"
                            disabled={loading}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('login')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
                            disabled={loading}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <Button
                          type="submit"
                          className="w-full rounded-none"
                          disabled={loading}
                      >
                        {loading ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <Input
                          type="text"
                          placeholder="Name"
                          value={firstName}
                          onChange={(e) => setName(e.target.value)}
                          className="rounded-none"
                          disabled={loading}
                          required
                      />
                      <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-none"
                          disabled={loading}
                          required
                      />
                      <div className="relative">
                        <Input
                            type={showRegisterPassword ? "text" : "password"}
                            placeholder="Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="rounded-none pr-10"
                            disabled={loading}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('register')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
                            disabled={loading}
                        >
                          {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <Button
                          type="submit"
                          className="w-full rounded-none"
                          disabled={loading}
                      >
                        {loading ? "Creating account..." : "Register"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-center text-red-500 font-semibold w-full">
                  This Site is made for Test Purpose Only. All Products in This site are Fake.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        <footer>
          <CommonFooter height={"h-14"}/>
        </footer>
      </div>
  );
};

export default AuthForm;