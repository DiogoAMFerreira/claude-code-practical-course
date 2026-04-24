import AuthForm from "./AuthForm";

interface AuthenticatePageProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function AuthenticatePage({ searchParams }: AuthenticatePageProps) {
  const { mode } = await searchParams;
  const isSignUp = mode === "signup";

  return <AuthForm isSignUp={isSignUp} />;
}
