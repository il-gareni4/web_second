import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        methods: {
            // Метод для сравнения паролей при аутентификации
            async comparePassword(candidatePassword: string): Promise<boolean> {
                return bcrypt.compare(candidatePassword, this.password);
            },
        },
    }
);

// Метод для шифрования пароля перед сохранением в БД
UserSchema.pre("save", async function (next) {
    const user = this;

    // Если пароль не был изменен, продолжаем
    if (!user.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

export default mongoose.model("User", UserSchema);
