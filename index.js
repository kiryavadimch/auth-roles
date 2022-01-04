const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const authRouter = require('./authRouter');

const PORT = process.env.PORT || 5000;
const dbURI =
   'mongodb+srv://root:root@task2.m7z6e.mongodb.net/task2?retryWrites=true&w=majority';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/auth', authRouter);
// @post('/registration')
// @post('/login')
// @get('/users')

const start = async () => {
   try {
      await mongoose.connect(
         dbURI,
         { useNewUrlParser: true, useUnifiedTopology: true },
         () => {
            console.log('--connected to MongoDB');
         }
      );
      app.listen(PORT, () => console.log(`--server started on port ${PORT}`));
   } catch (e) {
      console.log(e);
   }
};

start();
