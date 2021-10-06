import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, ReactElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === rest.href ? activeClassName : '';

  return (
    // O cloneElement replica algo e modifica/adiciona uma propriedade
    <Link {...rest}>
      {cloneElement(children,
        {
          className
        }
      )}
    </Link>
  )
}
