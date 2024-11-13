import { MongoClient, ObjectId } from "mongodb";
import express from "express";
const app = express();
const port = 3000;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/todo/all", async (req, res) => {
  try {
    const todo = await client.db("todo").collection("todo").find({}).toArray();
    res.send(todo);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.get("/todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await client
      .db("todo")
      .collection("todo")
      .findOne({ _id: new ObjectId(id) });
    res.send(todo);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.post("/todo/create", async (req, res) => {
  try {
    const body = req.body;
    const todo = { name: body.name, status: "incomplete" };
    await client.db("todo").collection("todo").insertOne(todo);
    res.send("Inserted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.post("/todo/:id/update", async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;

    const updatedTodo = {
      ...(body.name && { name: body.name }),
      ...(body.status && { status: body.status }),
    };

    const result = await client
      .db("todo")
      .collection("todo")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedTodo });
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.delete("/todo", async (req, res) => {
  try {
    const body = req.body;
    await client
      .db("todo")
      .collection("todo")
      .deleteOne({ _id: new ObjectId(body.id) });
    res.send("Deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
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
