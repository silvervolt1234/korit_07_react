import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataGrid, GridColDef, GridToolbar, GridCellParams } from "@mui/x-data-grid";
import { Snackbar, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { getTodo, deleteTodo, Todo as TodoType } from "./api/todoapi";
import { useState } from "react";

function Todo() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  
  const { data, isSuccess, error } = useQuery<TodoType[], Error>({
    queryKey: ["todos"],
    queryFn: async () => {
      console.log("JWT in sessionStorage:", sessionStorage.getItem("jwt"));
      return getTodo();
  }
  });

  const { mutate: removeTodo } = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      setOpen(true);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err: unknown) => console.error(err)
  });

  const columns: GridColDef[] = [
    { field: 'text', headerName: 'Todo', flex: 1 },
    {
      field: 'delete',
      headerName: '',
      renderCell: (params: GridCellParams) => (
        <IconButton onClick={() => removeTodo(params.row.id as number)}>
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  if (!isSuccess) return <span>Loading...</span>;
  if (error) return <span>데이터 불러오기 실패</span>;

  return (
    <>
      <DataGrid
        rows={data || []}
        columns={columns}
        getRowId={row => row.id}
        slots={{ toolbar: GridToolbar }}
      />
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message="삭제되었습니다"
      />
    </>
  );
}

export default Todo;
