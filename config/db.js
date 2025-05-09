require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('MongoDB connection URI is not defined in environment variables');
}

const intializeMongooseConnection = async ()=> {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
  })
  .then(() => console.log('Connected to MongoDB via Mongoose'))
  .catch(err => console.error('Mongoose connection error:', err));
}

module.exports = intializeMongooseConnection;