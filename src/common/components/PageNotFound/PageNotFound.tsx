import styles from "./PageNotFound.module.css"
//
import { Link, LinkProps } from "@mui/material"
import { Button, ButtonProps } from "@mui/material"

export const PageNotFound = () => {
  return (
    <>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>page not found</h2>
      <ButtonLink
        href={"/"}
        buttonProps={{
          variant: "contained",
        }}
      >
        Go to HomePage
      </ButtonLink>
    </>
  )
}

type ButtonLinkProps = LinkProps & {
  buttonProps?: ButtonProps
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ children, buttonProps = {}, ...linkProps }) => {
  return (
    <Link
      {...linkProps}
      underline={"none"}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button {...buttonProps}>{children}</Button>
    </Link>
  )
}
