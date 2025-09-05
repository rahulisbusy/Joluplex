import express, { request } from "express";
import cors from "cors";
import pkg from "pg"; // PostgreSQL client
import dotenv from "dotenv";

dotenv.config();
const { Client } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Nile DB client
const client = new Client({
  connectionString: process.env.NILE_DB_URL, // set in .env
});

client.connect();




app.post("/api/user", async (req, res) => {
  try {
    const { name, email ,image} = req.body;
    console.log("Inserting:", name, email,image);

    const result = await client.query(
      `INSERT INTO users (name, email,image) VALUES ($1, $2, $3) RETURNING *`,
      [name, email,image || null]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Failed to insert user" });
  }
});

app.get("/api/user", async (req, res) => {
  const email = req.query.email;
  try {
    const result = await client.query(
      `SELECT * FROM users WHERE email=$1`,
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});
app.post("/api/post", async (req, res) => {
  const { content, imageurl, visiblein, createdby } = req.body;
  try {
    const result = await client.query(
      `INSERT INTO posts (content, imageurl, visiblein, createdby) VALUES ($1, $2, $3, $4) RETURNING *`,
      [content, imageurl, visiblein, createdby]
    );
    return res.json({ message: "Posted successfully", post: result.rows[0] });
  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ error: "Failed to post" });
  }
});
app.get("/api/getposts", async (req, res) => {
  let { visiblein, orderfield } = req.query;

  const allowedOrderFields = ["id", "created_at", "content"];
  if (!allowedOrderFields.includes(orderfield)) {
    orderfield = "id";
  }

  try {
    let query;
    let params = [];

    if (visiblein === "0") {
      // Public posts only
      query = `
        SELECT * FROM posts 
        INNER JOIN users 
        ON posts.createdby = users.email
        WHERE visiblein = $1
        ORDER BY posts.${orderfield} DESC
      `;
      params = ["0"];
    } else {
      // Group posts only (specific group id)
      query = `
        SELECT * FROM posts 
        INNER JOIN users 
        ON posts.createdby = users.email
        WHERE visiblein = $1
        ORDER BY posts.${orderfield} DESC
      `;
      params = [visiblein];
    }

    const result = await client.query(query, params);
    return res.json(result.rows);
  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.get("/api/clubs",async(req,res)=>{
await client.query(`SELECT * FROM clubs`).then((result)=>{
  return res.json(result.rows);
})
.catch((err)=>{
  console.error("DB Error:", err);
  return res.status(500).json({ error: "Failed to fetch clubs" });});
});
app.post("/api/followclub", async (req, res) => {
  const { u_email, club_id } = req.body;

  try {
    // Check if already followed
    const check = await client.query(
      `SELECT * FROM clubfollowers WHERE u_email=$1 AND club_id=$2`,
      [u_email, club_id]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ message: "Already following this club" });
    }

    // Insert new follow
    const result = await client.query(
      `INSERT INTO clubfollowers (u_email, club_id) VALUES ($1,$2) RETURNING *`,
      [u_email, club_id]
    );

    return res.json({
      message: "Followed club successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error following club" });
  }
});

app.get("/api/followclub", async (req, res) => {
  try {
    const u_email = req.query.u_email;


    const result = await client.query(
      `SELECT f.u_email, f.club_id, c.name 
       FROM clubfollowers f
       INNER JOIN clubs c ON f.club_id = c.id
       WHERE f.u_email = $1;`,
      [u_email]
    );

    return res.json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching followed clubs:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/unfollowclub", async (req, res) => {
  const { u_email, club_id } = req.body;

  try {
    const result = await client.query(
      `DELETE FROM clubfollowers WHERE u_email = $1 AND club_id = $2 RETURNING *`,
      [u_email, club_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No follow record found" });
    }

    return res.json({ message: "Unfollowed club successfully", data: result.rows[0] });
  } catch (err) {
    console.error("Error unfollowing club:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/events", async (req, res) => {
  
  try {
    const { name, banner, location, event_date, event_time, created_by ,details } = req.body;
    console.log(req.body);
if (!name || !location || !event_date || !event_time || !created_by) {
  return res.status(400).json({ error: "All fields are required" });
}

const query = `
  INSERT INTO events (name, banner, location, event_date, event_time, created_by, details)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
`;

const values = [name, banner, location, event_date, event_time, created_by, details];


    const result = await client.query(query, values);

    res.status(201).json({
      message: "Event created successfully",
      event: result.rows[0],
    });
  } catch (err) {
    console.error("Error inserting event:", err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/api/events",async(req,res)=>{
  const result = await client.query(
    `select events.*,users.name as username from events
     inner join users
     on events.created_by=users.email
     order by id desc ;`
  )
  return res.json(result.rows);

})
app.post("/api/eventregister", async (req, res) => {
  try {
    const { eventId, email } = req.body;

    const result = await client.query(
      `INSERT INTO eventregister (event_id, user_email) 
       VALUES ($1, $2) 
       RETURNING *`,
      [eventId, email]
    );

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database insert failed" });
  }
});
app.post("/api/checkregistration", async (req, res) => {
  const { eventId, email } = req.body;
  console.log("Query params:", req.body);

  const result = await client.query(
    `SELECT * FROM eventregister WHERE event_id = $1 AND user_email = $2`,
    [eventId, email]
  );

  if (result.rows.length > 0) {
    return res.json({ registered: true });
  }
  return res.json({ registered: false });
});
// update profile image
app.put("/api/updateProfileImage", async (req, res) => {
  try {
    const { email, image } = req.body;

    if (!email || !image) {
      return res.status(400).json({ error: "Email and image are required" });
    }

    const result = await client.query(
      `UPDATE users SET image = $1 WHERE email = $2 RETURNING *`,
      [image, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile image updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




const PORT =   8082;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
