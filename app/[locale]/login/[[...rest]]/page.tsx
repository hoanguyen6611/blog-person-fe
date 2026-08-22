import { SignIn } from "@clerk/nextjs";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) => {
  const { redirect_url } = await searchParams;
  const fallbackRedirectUrl =
    redirect_url && redirect_url.startsWith("/") ? redirect_url : "/";

  return (
    <div
      className="flex justify-center items-center h-[calc(100vh-80px)]"
      data-testid="login-page"
    >
      <SignIn signUpUrl="/register" fallbackRedirectUrl={fallbackRedirectUrl} />
    </div>
  );
};

export default LoginPage;
