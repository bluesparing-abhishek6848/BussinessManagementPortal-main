import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import { useState, type FC } from "react";

interface AdvancePopUpProps {
    isOpen: boolean;
    handleClose: () => void;
    onAdvanceClick: (loanId: string, paymentId: string, days: number,status:string) => void;
    loanId: string;
    paymentId: string;
    status:string;
  }
 const AdvancePopUp: FC<AdvancePopUpProps> = ({
    isOpen,
    handleClose,
    onAdvanceClick,
    loanId,
    paymentId,status
  }) => {
    const [days, setDays] = useState<number>(1);
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onAdvanceClick(loanId, paymentId, days,status);
      handleClose();
      setDays(1);
    };
  
    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSubmit,
          },
        }}
      >
        <DialogTitle>Advance Collection</DialogTitle>
        <DialogContent>
          <DialogContentText className="mb-4">
            Select how many days you want to collect EMI in advance.
          </DialogContentText>
  
          <Typography gutterBottom>Days: {days}</Typography>
          <Slider
            value={days}
            min={1}
            max={30}
            step={1}
            valueLabelDisplay="auto"
            onChange={(_, value) => setDays(value as number)}
          />
        </DialogContent>
  
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    );
  };
  export default AdvancePopUp;