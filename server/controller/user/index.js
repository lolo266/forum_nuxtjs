export const GetUser = async (req, res) => {
    try {
        let username = req.params.username;

        let User = await Server.DB.Users
        .findOne({'auth.username': username})
        .select('profile')
        .populate({path: 'numTopics'})
        .populate({
            path: 'topics', 
            select: 'category child creator title update link view',
            populate: [
                {path: 'category', select: 'title link'},
                {path: 'child', select: 'title link'},
                {path: 'creator', select: 'profile.name profile.image'},
                {path: 'numPosts'},
            ]
        })

        if(!User) throw 'Tài khoản này không tồn tại';
        
        res.json({err: false, user: User})
        
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}

export const EditImage = async (req, res) => {
    try {
        let image = req.body.image;
        if(!req.auth) throw Server.Msg.user.offline;

        await Server.DB.Users.updateOne(
            {_id: req.auth.id}, 
            {'profile.image': image}
        );

        res.json({err: false})    
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}

export const EditBackground = async (req, res) => {
    try {
        let image = req.body.image;
        if(!req.auth) throw Server.Msg.user.offline;

        await Server.DB.Users.updateOne(
            {_id: req.auth.id}, 
            {'profile.background': image}
        );

        res.json({err: false})    
    }
    catch(e){
        res.json({err: true, status: e.toString()})
    }
}