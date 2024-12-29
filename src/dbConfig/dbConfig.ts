import mongoose from "mongoose";

export async function connectDB() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        //once connect it will return a connect id
        const connection = mongoose.connection;
        // console.log(connection);
        
        connection.on('connected' , ()=> {
            console.log("Mongo db connected successfully")
            console.log('Registered models:', mongoose.connection.modelNames());
        })

        connection.on('error', ()=> {
            console.log("MongoDb connection error, please make sure Mongodb is running");
            process.exit();
        })


    } catch (error) {
        console.log("something went wrong ");
        console.log(error);
    }
}