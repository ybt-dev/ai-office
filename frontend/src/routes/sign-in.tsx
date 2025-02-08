import LoginForm from "~/components/LoginForm";
import useSendSessionLinkMutation from "~/hooks/mutations/useSendSessionLinkMutation";

const SignInPage = () => {
  const { mutateAsync: sendSessionLink } = useSendSessionLinkMutation();

  const handleSubmitLoginForm = async (email: string) => {
    await sendSessionLink(email);
  };

  return (
    <div className="flex flex-column h-full w-full">
      <LoginForm onSubmit={handleSubmitLoginForm} />
    </div>
  );
};

export default SignInPage;
