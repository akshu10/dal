import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import * as Service from "../lib/service";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ClientOrders() {
  const [clientId, setClientId] = React.useState("");
  const [showAlert, setShowAlert] = React.useState("none");
  const [toggleAlerType, setToggleAlertType] = React.useState("info");
  const [toggleAlertText, setToggleAlertText] = React.useState("");
  const [toggleAlertTitle, setToggleAlertTitle] = React.useState("");
  const [rows, setRows] = React.useState([]);

  const handleTextInputOnChange = (event) => {
    setClientId(event.target.value);

    console.log(clientId);
  };

  const handleOnClick = async () => {
    if (clientId === "") {
      triggerAlert("info", "ClientId is required", "Info");
      return;
    }
    const response = await Service.getClientOrders(clientId);

    console.log(response);

    setRows(response);
  };

  const triggerAlert = (alertType, alertText, alertTitle) => {
    setToggleAlertTitle(alertTitle);
    setToggleAlertText(alertText);
    setToggleAlertType(alertType);
    setShowAlert("");
    setTimeout(
      () => {
        setShowAlert("none");
      },
      alertType === "error" ? 5000 : 3000
    );
  };

  return (
    <div>
      <Grid container justifyContent="center">
        <Stack
          sx={{
            width: "25%",
            marginTop: "15px",
            marginBottom: "0px",
            paddingBottom: "0px",
          }}
          spacing={2}
          display={showAlert}
        >
          <Alert severity={toggleAlerType}>
            <AlertTitle style={{ justifyContent: "start" }}>
              {toggleAlertTitle}
            </AlertTitle>
            {toggleAlertText}
          </Alert>
        </Stack>
      </Grid>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch", marginBlock: "40px" },
        }}
        noValidate
        autoComplete="off"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <TextField
          label="Client Id"
          id="outlined-size-normal"
          placeholder="Input Client ID"
          onChange={handleTextInputOnChange}
        />
        <Button variant="contained" color="success" onClick={handleOnClick}>
          Submit
        </Button>
      </Box>

      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Client ID</StyledTableCell>
                <StyledTableCell align="right">Po No.</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {row.clientId471}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.poNo471}</StyledTableCell>
                  <StyledTableCell align="right">
                    {row.status471}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
