import { SignUp } from "@clerk/nextjs";

const RegisterPage = () => {
  return (
    <div className="flex  items-center justify-center">
      <SignUp signInUrl="/login" />
    </div>
  );
};

export default RegisterPage;
