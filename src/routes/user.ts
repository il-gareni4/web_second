import express from "express";
import User from "../models/User.js";

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
 *     description: Создать нового пользователя с указанным именем и email.
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
 *             required:
 *               - name
 *               - email
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
router.post("/", async (req, res) => {
    try {
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
 *     description: Обновить данные пользователя (имя и/или email) по его ID.
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
        const { id, name, email } = req.body;
        if (!id) {
            return res.status(400).json({ message: "ID пользователя обязателен" });
        }

        // Собираем данные для обновления
        const updateData: { name?: string; email?: string } = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        if (Object.keys(updateData).length === 0) {
             return res.status(400).json({ message: "Необходимо указать хотя бы одно поле для обновления (name или email)" });
        }

        // new: true возвращает обновленный документ, runValidators: true включает валидацию схемы
        const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }); 

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

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
