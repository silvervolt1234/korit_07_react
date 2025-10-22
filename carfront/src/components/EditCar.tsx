import { ChangeEvent, useState } from "react"
import { Car, CarResponse, CarEntity } from "../types"
import { Dialog, DialogActions, DialogTitle, Button, IconButton, Tooltip } from "@mui/material";
import CarDialogContent from "./CarDialogContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCar } from "../api/carapi";
import EditRoundedIcon from '@mui/icons-material/EditRounded';

type FormProps = {
  cardata: CarResponse
}

function EditCar({cardata}: FormProps) {
  const queryClient = useQueryClient();
  const [ open, setOpen ] = useState(false);
  const [ car, setCar ] = useState<Car>({
    brand: '',
    model: '',
    color: '',
    registrationNumber: '',
    modelYear: 0,
    price: 0
  });

  const { mutate } = useMutation(updateCar, {
    onSuccess: () => {
      queryClient.invalidateQueries(["cars"])
    },
    onError: err => {
      console.log(err);
    }
  });

  const handleClickOpen = () => {
    // Modal이 열릴 때 특정 id 값에 맞는 정보를 불러오길 원해서 AddCar의 handleClickOpen()과 코드라인의 차이 발생
    setCar({
      brand: cardata.brand,
      model: cardata.model,
      color: cardata.color,
      registrationNumber: cardata.registrationNumber,
      modelYear: cardata.modelYear,
      price: cardata.price
    });
    setOpen(true);
  }

  const handleClickClose = () => {
    setOpen(false);
  }

  const handleSave = () => {
    // const url = cardata._links.self.href;
    // const CarEntity: CarEntity = { car, url };

    // 여기서부터
    const url = cardata._links.self.href;
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

    const CarEntity: CarEntity = { 
      car: { ...car, modelYear: modelYearNum, price: priceNum }, 
      url 
    };
    // 여기까지
    
    mutate(CarEntity);
    setCar({
      brand: '',
      model: '',
      color: '',
      registrationNumber: '',
      modelYear: 0,
      price: 0
    });
    setOpen(false);
  }

  // AddCar.tsx의 것을 사용
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCar({...car, [event.target.name]: event.target.value});
  }

  return(
    <>
      <Tooltip title='Edit Car'>
      <IconButton onClick={handleClickOpen}>
        <EditRoundedIcon fontSize="small"/>
      </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClickClose}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // 기본 Enter 동작 방지
            handleSave();       // 저장 + 창 닫기
          } else if (e.key === "Escape") {
            e.preventDefault();
            handleClickClose(); // 취소 + 창 닫기
          }
        }}
      >
        <DialogTitle>Edit Car</DialogTitle>
        <CarDialogContent car={car} handleChange={handleChange}/>
        <DialogActions>
          <Button onClick={handleSave}>Save | 저장</Button>
          <Button onClick={handleClickClose}>Cancel | 취소</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditCar