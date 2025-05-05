import mongoose from "mongoose";

export default function setupMongoose() {
    mongoose
        .connect(
            `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/main?authSource=admin`
        )
        .then(() => console.log("База данных подключена"))
        .catch((err) => console.log("Ошибка подключения к БД:", err));
}