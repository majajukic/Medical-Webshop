import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'


const BaseDialog = ({
  open,
  onClose,
  title,
  onSubmit,
  children,
  submitLabel = 'Sačuvaj',
  cancelLabel = 'Otkaži',
  maxWidth = 'sm',
  fullWidth = true,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <form onSubmit={handleSubmit}>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            {cancelLabel}
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default BaseDialog
