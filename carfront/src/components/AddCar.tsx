import { Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
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
    const modelYearNum = Number(car.modelYear);
    const priceNum = Number(car.price);

    if (
      !car.brand ||
      !car.model ||
      !car.color ||
      !car.registrationNumber ||
      !modelYearNum || modelYearNum <= 0 ||
      !priceNum || priceNum <= 0
    ) {
      alert("모든 필수값을 올바르게 입력해야 합니다.");
      return;
    }

    mutate({
      ...car,
      modelYear: modelYearNum,
      price: priceNum
    });
    // 이 위로 전체
    // mutate(car);
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
      <Button onClick={handleClickOpen} variant="outlined">New Car</Button>
      <Dialog open={open}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // 기본 submit 이벤트 방지
            handleSave();       // Save + 다이얼로그 닫기
          } else if (e.key === "Escape") {
            e.preventDefault();
            handleClickClose(); // Cancel + 다이얼로그 닫기
          }
        }}
      >
        <DialogTitle>New Car</DialogTitle>
        <CarDialogContent car={car} handleChange={handleChange}/>
        <DialogActions>
          <Button onClick={handleSave}>Save | 저장</Button>
          <Button onClick={handleClickClose}>Cancel | 취소</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddCar