import { useAppSelector } from "@/common/hooks"
import { selectThemeMode } from "@/app/app-slice"
import { getTheme } from "@/common/theme"
import Grid from "@mui/material/Grid2"
import { FormControl, FormControlLabel, FormGroup, FormLabel } from "@mui/material"
import TextField from "@mui/material/TextField"
import Checkbox from "@mui/material/Checkbox"
import Button from "@mui/material/Button"
import { SubmitHandler, useForm } from "react-hook-form"

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)
  // added useForm
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })
  type Inputs = {
    email: string
    password: string
    rememberMe: boolean
  }
  //
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
  }
  //
  return (
    <Grid container justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href="https://social-network.samuraijs.com"
                target={"_blank"}
                rel={"noreferrer"}
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>
              <b>Email:</b> free@samuraijs.com
            </p>
            <p>
              <b>Password:</b> free
            </p>
          </FormLabel>
          <FormGroup>
            <TextField label={"Email"} margin={"normal"} />
            <TextField type={"password"} label={"Password"} margin={"normal"} />
            <FormControlLabel control={<Checkbox {...register("rememberMe")} />} label={"Remember me"} />
            <Button type={"submit"} variant={"contained"} color={"primary"}>
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
