import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Создает нового пользователя с указанным именем, email и паролем.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя пользователя
 *                 example: Иван Иванов
 *               email:
 *                 type: string
 *                 description: Email пользователя
 *                 example: ivan@example.com
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *                 example: password123
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Ошибка валидации или пользователь с таким email уже существует
 */
router.post("/register", async (req, res): Promise<any> => {
    try {
        const { name, email, password } = req.body;
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: "Пользователь с таким email уже существует" 
            });
        }
        
        const user = new User({ name, email, password });
        await user.save();
        
        // Отправка ответа (без пароля)
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email
        };
        
        res.status(201).json(userResponse);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Аутентификация пользователя
 *     description: Аутентифицирует пользователя по email и паролю.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email пользователя
 *                 example: ivan@example.com
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *                 example: password123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Успешная аутентификация.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Неверные учетные данные
 *       404:
 *         description: Пользователь не найден
 */
router.post("/login", async (req, res): Promise<any> => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }
        
        if (!await user.comparePassword(password)) {
            return res.status(400).json({ message: "Неверный пароль" });
        }
        
        // Отправка ответа (без пароля)
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email
        };
        
        res.status(200).json(userResponse);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
});

export default router;