import RegistrationContainer from "@/components/organisms/auth/registerContainer/RegisterContainer";
 
const SignUpScreen = () => {
  return (
    <div className="min-h-screen  bg-primary-hex flex flex-col  items-center justify-center py-[35px]">
      <RegistrationContainer />
    </div>
  );
};
 
export default SignUpScreen;