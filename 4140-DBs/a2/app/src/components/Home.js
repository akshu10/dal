import * as React from "react";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

function Home() {
  return (
    <div>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Typography variant="h5">
          Assignment 2 web app. Use the navigation bar above to move across
          screens.
          <br />
          <p>
            The <em>Purchase</em> screen allows you to create a purchase order
          </p>
          <p>
            The <em>Orders</em> screen allows you to view a the line given a
            purchase order
          </p>
        </Typography>
      </Grid>
    </div>
  );
}
export default Home;
