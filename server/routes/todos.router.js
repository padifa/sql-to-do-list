const router = require("express").Router();
const pool = require("../modules/pool");

// GET all Todos
router.get("/", (req, res) => {
  console.log("handling GET");
  pool
    .query('SELECT * FROM todos ORDER BY "text"')
    .then((response) => {
      res.send(response.rows);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

// POST a new Todo
router.post("/", (req, res) => {
  const { text, isComplete } = req.body;
  const queryText = `
    INSERT INTO todos ("text", "isComplete")
    VALUES ($1, $2);
  `;
  pool
    .query(queryText, [text, isComplete])
    .then(() => res.sendStatus(201))
    .catch((error) => {
      console.error(error);
      res.sendStatus(400);
    });
});

// PUT (Edit) a Todo
router.put("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { text, isComplete } = req.body;
  console.log("PUT edit route", req.body);

  const query = `UPDATE todos SET "text" = $1, "isComplete" = $2 WHERE id = $3;`;
  pool
    .query(query, [text, isComplete, id])
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log("Error Updating through PUT", error);
      res.sendStatus(500);
    });
});

// PUT to change the completion status of a todo
router.put("/:id", (req, res) => {
  const reqId = req.params.id;
  const query = `UPDATE todos SET "isComplete" = NOT "isComplete" WHERE id = $1;`;

  pool
    .query(query, [reqId])
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log("Error updating status", error);
      res.sendStatus(500);
    });
});

// DELETE a Todo
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const queryText = `DELETE FROM todos WHERE id = $1;`;

  pool
    .query(queryText, [id])
    .then(() => res.sendStatus(202))
    .catch((error) => {
      console.log("Error Deleting Todo", error);
      res.sendStatus(500);
    });
});

module.exports = router;
