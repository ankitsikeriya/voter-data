import express from 'express';
import router from './routes/voter.routes.js';
import db from './db/db.js'; // Ensure DB connection is established
import dotenv from 'dotenv'; 
dotenv.config();
const app = express();

//parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
//Voter routes
app.use('/voter', router);

const PORT = process.env.PORT || 3060;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
