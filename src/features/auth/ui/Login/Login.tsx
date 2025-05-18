import { useAppSelector } from "@/common/hooks"
import { selectThemeMode } from "@/app/app-slice"
import { getTheme } from "@/common/theme"
import Grid from "@mui/material/Grid2"
import { FormControl, FormControlLabel, FormGroup, FormLabel } from "@mui/material"
import TextField from "@mui/material/TextField"
import Checkbox from "@mui/material/Checkbox"
import Button from "@mui/material/Button"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import styles from "./Login.module.css"
import { zodResolver } from "@hookform/resolvers/zod"
import { Inputs, loginSchema } from "@/features/auth/lib/schemas"

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
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  //
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
    reset()
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
            <TextField label={"Email 1"} margin={"normal"} error={!!errors.email} {...register("email")} />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
            <TextField type={"password"} label={"Password"} margin={"normal"} {...register("password")} />
            <FormControlLabel
              label={"Remember me"}
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox onChange={(e) => onChange(e.target.checked)} checked={value} />
                  )}
                />
              }
            />
            <Button type={"submit"} variant={"contained"} color={"primary"}>
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
