import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db= new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "navneet",
  port: 5432
});
db.connect();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async(req, res) => {
  const result= await db.query("SELECT * FROM items ORDER BY id ASC");
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: result.rows
  });
});

app.post("/add",async(req,res)=>{
    const newItem= req.body.newItem;
    await db.query("INSERT INTO items (title) VALUES ($1)", [newItem]);
    res.redirect("/");
});

app.post("/edit", async(req, res) => {
  const id = parseInt(req.body.updatedItemId);
  const updatedTitle = req.body.updatedItemTitle;
  await db.query("UPDATE items SET title = $1 WHERE id = $2", [updatedTitle, id]);
  res.redirect("/");
});

app.post("/delete",async(req,res)=>{
  const deleteId=parseInt(req.body.deleteItem);
  await db.query("DELETE FROM items WHERE id = $1", [deleteId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log("server running on port", port);
});
