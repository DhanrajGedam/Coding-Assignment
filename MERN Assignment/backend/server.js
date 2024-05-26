const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql')

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'new_root',
  password: 'root',
  database: 'customerdb'
});

db.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('MySQL Connected...');
});

app.post('/api/save-data', (req, res) => {
  const data = req.body;
  
  // Construct SQL query to insert data
  let sql = 'INSERT INTO products (id, title, price, description, category, image, sold, dateOfSale) VALUES ?';
  let values = data.map(item => [
      item.id,
      item.title,
      item.price,
      item.description,
      item.category,
      item.image,
      item.sold,
      new Date(item.dateOfSale)
  ]);
    db.query(sql, [values], (err, result) => {
      if (err) throw err;
      res.send('Data inserted');
      });
});


// New endpoint to fetch products
app.get('/api/products', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Error fetching products' });
      return;
    }
    res.json(results);
  });
});


app.get('/proxy', async (req, res) => {
  try {
    const response = await axios.get(req.query.url);
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`CORS proxy server is running on http://localhost:${PORT}`);
});
