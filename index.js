import { MongoClient } from "mongodb";
import express from "express";
const app = express();
const port = 3000;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", async (req, res) => {
  const query = req.query;
  const test = await client
    .db("test")
    .collection("test")
    .findOne({ name: query.name });
  res.send(test);
});

app.post("/test", async (req, res) => {
  const body = req.body;
  const test = { name: body.name, type: body.type };
  await client.db("test").collection("test").insertOne(test);
  res.send("Inserted");
});

app.post("/test/update", async (req, res) => {
  const body = req.body;
  const test = { name: body.name, type: body.type };
  await client
    .db("test")
    .collection("test")
    .updateOne({ name: body.name }, { $set: { type: body.type } });
  res.send("Updated");
});

client
  .connect()
  .catch((err) => console.log(`error connecting to MongoDB\n${err}`))
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  });
