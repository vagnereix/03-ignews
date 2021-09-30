import { signIn, signOut, useSession } from "next-auth/client";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";

export function SignInButton() {
  // useSession é usado para pegar uma sessão pelo lado do cliente
  const [session] = useSession();

  return session ? (
    <button
      type="submit"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <FaGithub color="#84d361" />
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="submit"
      className={styles.signInButton}
      onClick={() => signIn("github")}
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
}
