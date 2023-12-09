import authRoutes from './auth_routes.js';
import { adminMoviesRouter } from "./admin.js";
const constructorMethod = (app) => {
    app.use(authRoutes);
    app.use("/admin", adminMoviesRouter);
    //app.use('/users', userRoutes);
    app.use('*', (req, res) => {
        res.status(404).send("No such route exist.");
    });
};
export default constructorMethod;