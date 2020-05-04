import * as AuthController from '../controller/auth';

module.exports = (api) => {
    api.get('/', AuthController.Get);
    api.post('/signin', AuthController.Signin);
    api.post('/signup', AuthController.Signup);
}