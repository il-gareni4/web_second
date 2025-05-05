import express from "express";
import setupSwagger from "./setup/swagger.js";
import setupMongoose from "./setup/mongoose.js";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";

const app = express();
const port = parseInt(process.env.PORT || "3000");

app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);
setupMongoose();

app.set("view engine", "ejs");
app.set("views", "src/views");

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

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
    console.log(`Приложение запущено на порту ${port}`);
});
