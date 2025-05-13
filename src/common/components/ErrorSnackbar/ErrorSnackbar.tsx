import { SyntheticEvent } from "react"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { selectAppError, setAppErrorAC } from "@/app/app-slice"

export const ErrorSnackbar = () => {
  const errorApp = useAppSelector(selectAppError)
  const dispatch = useAppDispatch()

  const handleClose = (_: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }
    dispatch(setAppErrorAC({ error: null }))
  }

  return (
    <Snackbar open={errorApp !== null} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
        {errorApp}
      </Alert>
    </Snackbar>
  )
}
