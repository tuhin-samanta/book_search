import {config as dotenvConfig} from 'dotenv';
import express from 'express';
import cors from 'cors';
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
    const server = express();
    const port = process.env.PORT || 3000;

    const corsList= JSON.parse(process.env.CORS_LIST);
    if(!Array.isArray(corsList)){
      throw new Error("CORS list should be an array, please check the env file")
    }


    server.use(cors({
      origin(origin, callback){
        if(!origin || corsList.includes(origin)){
          callback(null, true);
        }
        else{
          callback(new Error("Not allowed by CORS"))
        }
      }
    }));

    // Middleware
    server.use(express.json());

    // Routes
    server.use('/api', authRoutes);
    server.use('/api', bookRoutes);

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

}

app.start()

