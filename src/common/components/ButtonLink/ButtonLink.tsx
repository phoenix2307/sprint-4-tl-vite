import { Link, LinkProps } from "@mui/material"
import { Button, ButtonProps } from "@mui/material"

type ButtonLinkProps = LinkProps & {
  buttonProps?: ButtonProps
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({ children, buttonProps = {}, ...linkProps }) => {
  return (
    <Link
      {...linkProps}
      underline={"none"}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "10px",
      }}
    >
      <Button {...buttonProps}>{children}</Button>
    </Link>
  )
}
