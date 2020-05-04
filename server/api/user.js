import * as UserController from '../controller/user';

module.exports = (api) => {
    api.get('/:username', UserController.GetUser);

    api.post('/edit/image', UserController.EditImage);
    api.post('/edit/background', UserController.EditBackground);
}