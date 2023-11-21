import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import setupDB from './db/conn.js';
import routes from './routes/index.js';

const PORT = process.env.PORT || 5050
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

setupDB();
app.use('/api', routes);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})
