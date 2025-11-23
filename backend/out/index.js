"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const movie_routes_1 = __importDefault(require("./movies/movie.routes"));
const user_controller_1 = __importDefault(require("./users/user.controller"));
const auth_controller_1 = __importDefault(require("./auth/auth.controller"));
const requestLogger_1 = require("./middlewares/requestLogger");
const unknownEndpoint_1 = require("./middlewares/unknownEndpoint");
const errorHandler_1 = require("./middlewares/errorHandler");
const auth_1 = require("./auth/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["X-CSRF-Token"],
}));
app.use(requestLogger_1.requestLogger);
app.use("/api/users", user_controller_1.default);
app.use("/api/login", auth_controller_1.default);
app.use("/api/movies", movie_routes_1.default);
app.get("/api/secure/ping", auth_1.withUser, (req, res) => {
    res.json({ ok: true, by: req.userId });
});
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use(unknownEndpoint_1.unknownEndpoint);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 4000;
async function startServer() {
    await (0, db_1.connectDB)();
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}
startServer().catch((err) => {
    console.error("Error al iniciar el servidor:", err);
});
//# sourceMappingURL=index.js.map