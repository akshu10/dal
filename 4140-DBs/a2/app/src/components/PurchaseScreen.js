import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

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

export default function CustomizedTables() {
  const [rows, setRows] = React.useState([]);
  const [partsNos, setPartNos] = React.useState([]);
  const [selectedPartNo, setSelectedPartNo] = React.useState("");
  const [toggleError, setToggleError] = React.useState(false);
  const [toggleClientIdError, setToggleClientIdError] = React.useState(false);
  const [clientIdSelected, setClientId] = React.useState(0);

  const [helperText, setHelperText] = React.useState("Input Quantity");
  const [clientIdHelperText, setClientIdHelperText] =
    React.useState("Input Client Id");
  const [quantitySelected, setQuantitySelected] = React.useState(0);

  // const [selectedQuantity, setSelectedQuantity] = React.useState(0);
  const [disableQuantityInput, setDisableQuantityInput] = React.useState(true);
  const [disableClientIdInput, setDisableClientIdInput] = React.useState(true);

  const [cart] = React.useState([]);

  const handlePartNoOnChange = (event) => {
    const newValue = event.target.value;
    setSelectedPartNo(newValue);

    setDisableQuantityInput(false);
  };

  const handleClientIdOnChange = (event) => {
    setClientId(event.target.value);
  };

  const handleQuantityOnChange = (event) => {
    for (const a of rows) {
      if (
        a.partNo471 === selectedPartNo &&
        event.target.value > a.quantityOnHand471
      ) {
        setHelperText("Quantity exceeds the quantity available");
        setDisableClientIdInput(true);
        setToggleError(true);

        return;
      } else {
        setHelperText("Input Quantity");
        setDisableClientIdInput(false);
        setToggleError(false);
        setQuantitySelected(event.target.value);
      }
    }
  };

  const handleAddToCart = () => {
    let price = "";
    for (const a of rows) {
      if (a.partNo471 === selectedPartNo) {
        price = a.currentPriceCents471;
      }
    }

    cart.push({
      partNo471: selectedPartNo,
      price,
      quantityOrdered471: quantitySelected,
    });

    console.log(cart);
  };

  React.useEffect(() => {
    Service.listParts().then((response) => {
      response.forEach((row) => {
        return {
          name471name: row.name471,
          partNo471: row.partNo471,
          description471: row.description471,
          currentPriceCents471: row.currentPriceCents471,
          proquantityOnHand471tein: row.quantityOnHand471,
        };
      });

      setRows(response);

      const mapped = response.map((row) => {
        return { value: row.partNo471, label: row.partNo471 };
      });

      setPartNos(mapped);
    });
  }, []);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="right">Part No.</StyledTableCell>
              <StyledTableCell align="right">Description</StyledTableCell>
              <StyledTableCell align="right">Current Price</StyledTableCell>
              <StyledTableCell align="right">Quantity on Hand</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {row.name471}
                </StyledTableCell>
                <StyledTableCell align="right">{row.partNo471}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.description471}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.currentPriceCents471}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.quantityOnHand471}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        style={{ marginTop: "50px" }}
      >
        <div>
          <TextField
            select
            label="Part No"
            value={selectedPartNo}
            onChange={handlePartNoOnChange}
            helperText="Select the Part No"
          >
            {partsNos.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            error={toggleError}
            id="outlined-basic"
            label="Enter Quantity"
            variant="outlined"
            onChange={handleQuantityOnChange}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            helperText={helperText}
            disabled={disableQuantityInput}
          />
          <br></br>
          <TextField
            error={toggleClientIdError}
            id="outlined-basic"
            label="Enter Client Id"
            variant="outlined"
            onChange={handleClientIdOnChange}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            helperText={clientIdHelperText}
            disabled={disableClientIdInput}
          />
        </div>

        <Button variant="outlined" onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button
          variant="contained"
          style={{ marginLeft: "20px" }}
          color="success"
        >
          Confirm Order
        </Button>
      </Box>
    </div>
  );
}
