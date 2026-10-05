import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import "dotenv/config";
const app = express();
const port = 3000;
const db = new pg.Client({
  user:process.env.PG_USER,
  host:process.env.PG_HOST,
  database:process.env.PG_DATABASE,
  password:process.env.PG_PASSWORD,
  port:process.env.PG_PORT,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
 

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items");
    res.render("index.ejs", {
      listTitle: "TASKS",
      listItems: result.rows,
    });

  } catch (err) {
    console.error(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
    await db.query("insert into items (title) values ($1)",[item]);
  }
  catch(err){
    console.log(err.stack);
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  let updatedTitle =req.body.updatedItemTitle;
  let id = req.body.updatedItemId;
   try{
    await db.query("update items set title = ($1) where id = ($2);",[updatedTitle,id]);
  }
  catch(err){
    console.log(err.stack);
  }
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  
  console.log(`request to delete item of id:${req.body.deleteItemId}`);

  db.query("delete from items where id = ($1)",[req.body.deleteItemId]);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`server running on port:${port} link:http://localhost:${port}`);
});
