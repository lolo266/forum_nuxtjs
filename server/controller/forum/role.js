//Topics
export const CheckCreateVIP = (auth, smod, mod) => {
    if(auth.role == 1) return true; //is Admin
    if(auth.id == smod) return true;
    if(mod.indexOf(auth.id) > -1) return true;
    return false;
}

export const CheckEdit = (auth, creator) => {
    if(auth.role == 1) return true; //is Admin
    if(auth.id == creator) return true;
    return false;
}

export const CheckDelete = (auth, smod) => {
    if(auth.role == 1) return true; //is Admin
    if(auth.id == smod) return true;
    return false;
}

export const CheckBLockPost = (auth, creator) => {
    if(auth.role == 1) return true; //is Admin
    if(auth.id == creator) return true;
    return false;
}

export const CheckLock = (auth, smod, mod) => {
    if(auth.role == 1) return true; //is Admin
    if(auth.id == smod) return true;
    if(mod.indexOf(auth.id) > -1) return true;
    return false;
}

//Post
export const CheckCreatePost = (auth, smod, mod, lock) => {
    if(auth.role == 1) return true; //is Admin
    if(auth.id == smod) return true;
    if(mod.indexOf(auth.id) > -1) return true;
    if(!lock.all) {
        if(!lock.post) return true;
        return false;
    }
    return false;
}

export const CheckEditPost = (auth, creator) => {
    if(auth.role == 1) return true; //is Admin
    if(auth.id == creator) return true;
    return false;
}

export const CheckDeletePost = (auth, smod, mod, creator) => {
    if(auth.role == 1) return true; //is Admin
    if(auth.id == smod) return true;
    if(mod.indexOf(auth.id) > -1) return true;
    if(auth.id == creator) return true;
    return false;
}
