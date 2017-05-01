const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const app = express();

const port = process.env.PORT || 3000;

// static file server
app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
