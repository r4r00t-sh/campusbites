import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function AuthPage() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/student/menu';

  const [loginAdm, setLoginAdm] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [regName, setRegName] = useState('');
  const [regAdm, setRegAdm] = useState('');
  const [regPass, setRegPass] = useState('');

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(loginAdm, loginPass);
    if (result.ok) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const result = register(regName, regAdm, regPass);
    if (result.ok) {
      toast.success('Account created. You are signed in.');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen pastel-gradient flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-foreground hover:opacity-80">
            <span className="text-4xl">🍽️</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground">Student access</h1>
          <p className="text-sm text-muted-foreground">Register once, then sign in with your admission number.</p>
        </div>

        <div className="glass rounded-2xl p-6 shadow-lg border border-border/50">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl mb-6">
              <TabsTrigger value="login" className="rounded-lg">
                Log in
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0 space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-adm">Admission number</Label>
                  <Input
                    id="login-adm"
                    autoComplete="username"
                    value={loginAdm}
                    onChange={e => setLoginAdm(e.target.value)}
                    placeholder="e.g. CS2024-001"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-pass">Password</Label>
                  <Input
                    id="login-pass"
                    type="password"
                    autoComplete="current-password"
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    placeholder="Your password"
                    className="rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl py-6 font-bold bg-primary text-primary-foreground">
                  Log in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-0 space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Name</Label>
                  <Input
                    id="reg-name"
                    autoComplete="name"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Your full name"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-adm">Admission number</Label>
                  <Input
                    id="reg-adm"
                    autoComplete="username"
                    value={regAdm}
                    onChange={e => setRegAdm(e.target.value)}
                    placeholder="e.g. CS2024-001"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-pass">Password</Label>
                  <Input
                    id="reg-pass"
                    type="password"
                    autoComplete="new-password"
                    value={regPass}
                    onChange={e => setRegPass(e.target.value)}
                    placeholder="Choose a password"
                    className="rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl py-6 font-bold bg-primary text-primary-foreground">
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          <Link to="/" className="underline hover:text-foreground">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
