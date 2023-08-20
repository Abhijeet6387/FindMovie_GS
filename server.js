import express from 'express'
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connect from './config/index.js';
import routes from './routes/index.js';
dotenv.config();

//Instansiate App
const app = express();
const PORT = process.env.PORT || 5000;

//Apply middlewares
app.use(cors());
app.use(express.json());
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('short'));
}

//routes
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        data: {
            message: 'Server is running',
        },
    })
});

app.use('/', routes);

//Error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const error = err.error || 'Internal server error';
    res.status(status).json({
        ok: false,
        data: {},
        error: error,
    });
    (process.env.NODE_ENV === 'development')?console.log(err):null;
});

//Route not found
app.use((req, res, next) => {
    res.status(404).json({
        ok: false,
        data: {},
        error: 'Route does not exist',
    });
});

connect();

app.listen(PORT, () => {
    console.log(`Server listening @${process.env.PORT}`);
    (process.env.NODE_ENV === 'development')?console.log(`Click : http://localhost:${PORT}`):null;
});


export default app;

