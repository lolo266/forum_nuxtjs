export default async function (context) {
    if(!process.server) return false;
    if(!context.req.cookies.token) return false;

    try {
        let Get = await context.$axios.$get('/auth');
        context.store.commit('auth/Login', Get.user);
    }
    catch(e){
        context.error({statusCode: e.response.status, message: e.response.data})
    }
}