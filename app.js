import {config as dotenvConfig} from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import {authRoutes, bookRoutes} from './routes/index.js';
import { createTables, dropTables } from './config/index.js';

dotenvConfig()

const app= {

  start(){
    if(process.argv[2]==='--install')
    {this.install();}
    else if(process.argv[2]==='--uninstall'){
      this.unInstall()
    }
    else{
      this.createServer();
    }
  },

  install(){
    createTables()
  },

  unInstall(){
    dropTables()
  },

  createServer(){
    const app = express();
    const port = process.env.PORT || 3000;

    // Middleware
    app.use(bodyParser.json());

    // Routes
    app.use('/api', authRoutes);
    app.use('/api', bookRoutes);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

}

app.start()

