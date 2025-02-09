import {ReactNode} from "react";
import { Navigate } from 'react-router';
import useSession from "~/hooks/useSession";

export interface AuthorizedSectionProps {
  children: ReactNode;
}

const AuthorizedSection = ({ children }: AuthorizedSectionProps) => {
  const [sessionUser] = useSession();

  console.log(sessionUser);

  if (!sessionUser) {
    return (
      <Navigate replace to="/sign-in" />
    );
  }

  return (
    <>
      {children}
    </>
  )
};

export default AuthorizedSection;
