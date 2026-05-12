import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ChromeIcon } from "lucide-react";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, loginWithEmail, signUpWithEmail } =
    useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      toast({
        title: "Welcome!",
        description: "Logged in successfully with Google",
      });
      setIsAuthModalOpen(false); // Close modal after login
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await loginWithEmail(loginEmail, loginPassword);
      toast({
        title: "Welcome back!",
        description: "Logged in successfully",
      });
      setIsAuthModalOpen(false); // Close modal after login
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Failed to log in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupEmail || !signupPassword || !signupName || !signupConfirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await signUpWithEmail(signupEmail, signupPassword, signupName);
      toast({
        title: "Account Created!",
        description: "Welcome to Shades by Mahie",
      });
      setIsAuthModalOpen(false); // Close modal after signup
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent className="w-full max-w-md mx-auto border-0 bg-amber-50 shadow-2xl rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-serif font-bold text-amber-900 mb-2">Welcome</h2>
          <p className="text-amber-700 font-light">Continue your handmade journey with us</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-amber-100 rounded-xl p-1 mb-6">
            <TabsTrigger
              value="login"
              className="rounded-lg data-[state=active]:bg-amber-800 data-[state=active]:text-amber-50 transition-all text-amber-900"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-lg data-[state=active]:bg-amber-800 data-[state=active]:text-amber-50 transition-all text-amber-900"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4 mt-6">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-amber-300 rounded-xl hover:border-amber-500 hover:bg-amber-100 transition-all duration-300 font-medium text-amber-900 disabled:opacity-50"
            >
              <ChromeIcon size={20} className="text-amber-700" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-amber-200"></div>
              <span className="text-sm text-amber-700">OR</span>
              <div className="flex-1 h-px bg-amber-200"></div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email" className="text-amber-900 font-medium mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500 focus:ring-amber-200"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="login-password" className="text-amber-900 font-medium mb-2 block">
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500 focus:ring-amber-200"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold py-3 rounded-xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup" className="space-y-4 mt-6">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-amber-300 rounded-xl hover:border-amber-500 hover:bg-amber-100 transition-all duration-300 font-medium text-amber-900 disabled:opacity-50"
            >
              <ChromeIcon size={20} className="text-amber-700" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-amber-200"></div>
              <span className="text-sm text-amber-700">OR</span>
              <div className="flex-1 h-px bg-amber-200"></div>
            </div>

            {/* Email Signup Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name" className="text-amber-900 font-medium mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500 focus:ring-amber-200"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="signup-email" className="text-amber-900 font-medium mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500 focus:ring-amber-200"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="signup-password" className="text-amber-900 font-medium mb-2 block">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500 focus:ring-amber-200"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="signup-confirm" className="text-amber-900 font-medium mb-2 block">
                  Confirm Password
                </Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500 focus:ring-amber-200"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold py-3 rounded-xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
