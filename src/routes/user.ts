import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Получить список пользователей
 *     description: Получить список всех пользователей из базы данных.
 *     responses:
 *       200:
 *         description: Список пользователей.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Неверный запрос
 */
router.get("/", async (req, res) => {
    try {
        res.status(200).json(await User.find());
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
});

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     description: Создать нового пользователя с указанным именем, email и паролем.
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
 *                 example: Анна Петрова
 *               email:
 *                 type: string
 *                 description: Email пользователя
 *                 example: anna.petrova@example.com
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
 *         description: Пользователь успешно создан.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Неверный запрос
 */
router.post("/", async (req, res): Promise<any> => {
    try {
        // Проверяем, существует ли пользователь с таким email
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                message: "Пользователь с таким email уже существует",
            });
        }

        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
});

/**
 * @openapi
 * /users:
 *   put:
 *     summary: Редактировать пользователя по ID
 *     description: Обновить данные пользователя (имя, email и/или пароль) по его ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID пользователя для редактирования.
 *                 example: 60d0fe4f5311236168a109ca
 *               name:
 *                 type: string
 *                 description: Новое имя пользователя (опционально).
 *                 example: Сергей Петров
 *               email:
 *                 type: string
 *                 description: Новый email пользователя (опционально).
 *                 example: sergey.petrov@example.com
 *               password:
 *                 type: string
 *                 description: Новый пароль пользователя (опционально).
 *                 example: newpassword123
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлен.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Неверный запрос (например, неверный ID или данные)
 *       404:
 *         description: Пользователь не найден
 */
router.put("/", async (req, res): Promise<any> => {
    try {
        const { id, name, email, password } = req.body;
        if (!id) {
            return res.status(400).json({ message: "ID пользователя обязателен" });
        }

        // Находим пользователя для обновления
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        // Собираем данные для обновления
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;

        if (!name && !email && !password) {
            return res.status(400).json({
                message:
                    "Необходимо указать хотя бы одно поле для обновления (name, email или password)",
            });
        }

        await user.save();
        res.status(200).json(user);
    } catch (err) {
        // Обработка ошибок валидации или других ошибок БД
        res.status(400).json({ message: (err as Error).message });
    }
});

/**
 * @openapi
 * /users:
 *   delete:
 *     summary: Удалить пользователя по ID
 *     description: Удалить пользователя из базы данных по его ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID пользователя для удаления.
 *                 example: 60d0fe4f5311236168a109ca
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Пользователь успешно удален.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Неверный запрос
 *       404:
 *         description: Пользователь не найден
 */
router.delete("/", async (req, res): Promise<any> => {
    try {
        const user = await User.findByIdAndDelete(req.body.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
});

export default router;
