const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blocks',
});

app.get('/saveToMySQL', (req, res) => {
    // Access the query parameters from the request
    const blockchainDataString = req.query.data;
  
    // Check if the data parameter is defined and is a non-empty string
    if (blockchainDataString && typeof blockchainDataString === 'string' && blockchainDataString.trim() !== '') {
      try {
        // Parse the JSON data
        const blockchainData = JSON.parse(blockchainDataString);
  
        // Display blockchainData in the console log
        // console.log('Received Blockchain Data:', blockchainData);
  
        // Extract relevant information from blockchainData
        const index = blockchainData.chain[blockchainData.chain.length - 1].index;
        const timestamp = blockchainData.chain[blockchainData.chain.length - 1].timestamp;
        const data = JSON.stringify(blockchainData.chain[blockchainData.chain.length - 1].data);
        const previousHash = blockchainData.chain[blockchainData.chain.length - 1].previousHash;
        const hash = blockchainData.chain[blockchainData.chain.length - 1].hash;
  
        // Construct the SQL insert query
        const sql = `INSERT INTO blocks (block_index, timestamp, data, previousHash, hash) VALUES (?, ?, ?, ?, ?)`;
        const values = [index, timestamp, data, previousHash, hash];
  
        // Execute the insert query
        connection.query(sql, values, (err, result) => {
          if (err) {
            console.error('Error performing insert query:', err);
            res.status(500).send('Error saving data to MySQL');
          } else {
            console.log('Data saved to MySQL');
            res.send('Data saved to MySQL');
          }
        });
      } catch (error) {
        console.error('Error parsing JSON data:', error);
        res.status(400).send('Invalid JSON data');
      }
    }
  });
  

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
