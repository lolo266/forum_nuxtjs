export const state = () => ({
    login: false,
    id: null,
    profile: null,
    role: null
})
  
export const mutations = {
    Login(state, data){
        state.login = true;
        state.profile = data.profile;
        state.id = data._id;
        state.role = data.role;
    },
    Logout(state){
        state.login = false;
        state.profile = null;
        state.id = null;
        state.role = null;
    }
}