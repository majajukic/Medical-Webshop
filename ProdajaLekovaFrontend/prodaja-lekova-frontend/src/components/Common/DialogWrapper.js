import React, { memo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { DIMENSIONS, SPACING } from '../../constants/themeConstants'

const DialogWrapper = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'md',
  fullWidth = true,
  showCloseButton = true,
  onSubmit,
  submitText = 'Sačuvaj',
  cancelText = 'Otkaži',
  showDefaultActions = false,
  disableSubmit = false,
}) => {
  const handleSubmit = (e) => {
    if (onSubmit) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          minWidth: DIMENSIONS.DIALOG_MIN_WIDTH,
          maxWidth: DIMENSIONS.DIALOG_MAX_WIDTH,
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {title}
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ padding: SPACING.MEDIUM }}>
        {children}
      </DialogContent>
      {(actions || showDefaultActions) && (
        <DialogActions sx={{ padding: SPACING.MEDIUM }}>
          {actions || (
            <>
              <Button onClick={onClose} variant="outlined">
                {cancelText}
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={disableSubmit}
              >
                {submitText}
              </Button>
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  )
}

export default memo(DialogWrapper)
