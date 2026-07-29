import { RegisterForm } from '../components/register-form';

export function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Sign up to get started with wareX
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
