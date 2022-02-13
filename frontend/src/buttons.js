import { Button } from "@mui/material";

export default function () {
  return (
    <div style={{ flex: "0.1" }} className="flex h-screen flex-col items-center justify-center">
      <div className="flex h-[20%] w-[100%] flex-col items-center justify-around">
        <Button variant="contained">Add</Button>
        <Button variant="outlined">Remove</Button>
      </div>
    </div>
  );
}
