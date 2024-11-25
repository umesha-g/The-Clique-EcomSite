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

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [firstName, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, currentPassword });

      toast({
        title: "Login successful!",
        description: "Redirecting to homepage...",
        duration: 2000,
      });

      setEmail('');
      setCurrentPassword('');

      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get('callbackUrl') || '/home';

      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 1000);

    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
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
        title: "Registration successful!",
        description: "Please login with your new account",
        duration: 3000,
      });

      // Clear form
      setName('');
      setEmail('');
      setNewPassword('');

      // Switch to log in tab
      const tabsList = document.querySelector('[role="tablist"]');
      const loginTab = tabsList?.querySelector('[value="login"]') as HTMLElement;
      loginTab?.click();

    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your information and try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex relative items-center justify-center min-h-screen bg-neutral-100">
        <div className={"absolute top-10 lg:w-96 lg:left-[37%]"}>
          <Logo/>
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
                  <TabsTrigger className={"rounded-none"} value="login">Login</TabsTrigger>
                  <TabsTrigger className={"rounded-none"} value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-none"
                        disabled={loading}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="rounded-none"
                        disabled={loading}
                        required
                    />
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
                    <Input
                        type="password"
                        placeholder="Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="rounded-none"
                        disabled={loading}
                        required
                    />
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
              <p className="text-sm text-center text-gray-500 w-full">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
  );
};

export default AuthForm;