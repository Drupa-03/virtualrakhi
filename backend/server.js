// const express = require('express');
// const cors = require('cors');
// const rakhiRoutes = require('./routes/rakhiRoutes');

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/rakhi', rakhiRoutes);

// const PORT = 3002;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

//backend-server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const rakhiRoutes = require('./routes/rakhiRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/api/rakhi', rakhiRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});