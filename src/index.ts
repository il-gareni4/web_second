import express from "express";
import mongoose from "mongoose";
import User from "./models/User.js";

const app = express();
const port = parseInt(process.env.PORT || "3000");

app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "src/views");

mongoose
    .connect(
        `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/main?authSource=admin`
    )
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("Error while connecting to DB:", err));

app.get("/", (_, res) => {
    res.send("Hello World!");
});

app.get("/ejs", (req, res) => {
    res.render("layout", {
        title: "EJS",
        message: req.query.message || "No message sent",
        body: "index",
    });
});

// GET запрос на получение всех пользователей
app.get("/users", async (req, res) => {
    try {
        res.status(200).json(await User.find());
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
});

// POST запрос на создание нового пользователя
app.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
});

// DELETE запрос на удаление пользователя по id
app.delete("/users", async (req, res): Promise<any> => {
    try {
        const user = await User.findByIdAndDelete(req.body.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
