import * as React from "react";
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

export default function CustomizedTables() {
  const [rows2, setRows2] = React.useState([]);

  React.useEffect(() => {
    Service.listParts().then((response) => {
      console.log(response);

      response.forEach((row) => {
        return {
          name: row.name471,
          calories: row.partNo471,
          fat: row.description471,
          carbs: row.currentPriceCents471,
          protein: row.quantityOnHand471,
        };
      });

      setRows2(response);
    });
  }, []);

  return (
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
          {rows2.map((row, index) => (
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
  );
}
