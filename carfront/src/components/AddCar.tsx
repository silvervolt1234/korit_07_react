<<<<<<< HEAD
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
=======
import { Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
>>>>>>> HEAD@{1}
import { ChangeEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCar } from "../api/carapi";
import CarDialogContent from "./CarDialogContent";

function AddCar() {
  const [ open, setOpen ] = useState(false);
  const [ car, setCar ] = useState({
    brand: '',
    model: '',
    color: '',
    registrationNumber: '',
    modelYear: 0,
    price: 0
  });

  const handleClickOpen = () => setOpen(true);

  const handleClickClose = () => setOpen(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCar({...car, [event.target.name]: event.target.value});
  }

  const queryClient = useQueryClient();

  const { mutate } = useMutation(addCar, {
    onSuccess: () => {
      queryClient.invalidateQueries(["cars"]);
    },
    onError: err => {
      console.log(err);
    },
  });

  const handleSave = () => {
    mutate(car);
    setCar({
      brand: '',
      model: '',
      color: '',
      registrationNumber: '',
      modelYear: 0,
      price: 0
    });
    handleClickClose();
  }

  return(
    <>
<<<<<<< HEAD
      <button onClick={handleClickOpen}>New Car</button>
=======
      <Button onClick={handleClickOpen} variant="outlined">New Car</Button>
>>>>>>> HEAD@{1}
      <Dialog open={open} >
        <DialogTitle>New Car</DialogTitle>
        <CarDialogContent car={car} handleChange={handleChange}/>
        <DialogActions>
<<<<<<< HEAD
          <button onClick={handleSave}>Save | 저장</button>
          <button onClick={handleClickClose}>Cancel | 취소</button>
=======
          <Button onClick={handleSave}>Save | 저장</Button>
          <Button onClick={handleClickClose}>Cancel | 취소</Button>
>>>>>>> HEAD@{1}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddCar