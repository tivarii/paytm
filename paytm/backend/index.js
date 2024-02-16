const express = require("express");
const App= express();
const cors=require("cors");
const mainRouter=require("./route/index")


App.use("/api/v1",mainRouter);
App.use(cors);
App.use(express.json());
App.listen(3001);