// import { CarResponse } from "../types"   // table 태그에서는 data.map()에 의해 필요하지만 x-data-grid 사용 이후는 x
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCars, deleteCar } from "../api/carapi";
import { DataGrid, GridColDef, GridCellParams, GridToolbar } from "@mui/x-data-grid";
import { Snackbar, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import AddCar from "./AddCar";
import EditCar from "./EditCar";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

function Carlist() {
  const [ open, setOpen ] = useState(false);
  const queryClient =  useQueryClient();
  const {data, error, isSuccess} = useQuery({
    queryKey: ["cars"],
    queryFn: getCars
  });

  const { mutate } = useMutation(deleteCar, {
    onSuccess: () => {
      setOpen(true);
      queryClient.invalidateQueries({ queryKey: ["cars"]});   // 이 부분은 useQuery()를 정의한 부분과 연관
    },
    onError: err => {
      console.log(err);
    }
  })

  const columns: GridColDef[] = [
    {field: 'brand', headerName: 'Brand', width: 200},
    {field: 'model', headerName: 'Model', width: 200},
    {field: 'color', headerName: 'Color', width: 200},
    {field: 'registrationNumber', headerName: 'Reg.num', width: 150},
    {field: 'modelYear', headerName: 'ModelYear', width: 150},
    {field: 'price', headerName: 'Price', width: 150},
    {
      field: 'edit', 
      headerName: '', 
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => 
        <EditCar cardata={params.row}/>
    },
    {
      field: 'delete',
      headerName: '',
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <Tooltip title='Delete'>
        <IconButton aria-label="delete" size="small"
          onClick={() => {
            if (window.confirm(`${params.row.brand}의 ${params.row.model} 자동차를 삭제하시겠습니까?`)) 
            mutate(params.row._links.self.href)}}
        >
          <DeleteForeverRoundedIcon fontSize="small"/>
        </IconButton>
        </Tooltip>
      )
    }
  ];

  if(!isSuccess) {
    return <span>Loading...</span>
  }

  if (error) {
    return <span>자동차를 불러오는데 실패했습니다.</span>
  }
  else {
    return (
      // <table>
      //   <tbody>
      //     {
      //       data.map((car: CarResponse) =>
      //         <tr key={car._links.self.href}>
      //           <td>{car.brand}</td>
      //           <td>{car.model}</td>
      //           <td>{car.color}</td>
      //           <td>{car.registrationNumber}</td>
      //           <td>{car.modelYear}</td>
      //           <td>{car.price}</td>
      //         </tr>
      //       )
      //     }
      //   </tbody>
      // </table>
      <>
        <AddCar />
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={row => row._links.self.href}
          slots= {{ toolbar: GridToolbar }}
        />
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
          message='선택한 자동차 정보가 삭제되었습니다'
        />
      </>
    )
  }
}

export default Carlist