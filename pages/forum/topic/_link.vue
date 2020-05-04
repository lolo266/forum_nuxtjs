<template>
    <v-card flat tile v-if="$fetchState.pending" color="card" class="Radius">
        <v-skeleton-loader ref="skeleton" type="card-heading"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton" type="paragraph" class="mx-4"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton" type="card-heading" width="100"></v-skeleton-loader>
    </v-card>

    <v-card flat tile v-else-if="$fetchState.error" color="card" class="Radius">
        <v-skeleton-loader ref="skeleton" type="card-heading"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton" type="paragraph" class="mx-4"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton" type="card-heading" width="100"></v-skeleton-loader>
    </v-card>

    <div v-else>
        <!--Topic -->
        <Topic-Main :Topic="Topic" class="mb-2"></Topic-Main>

        <v-alert tile type="info" dense prominent elevation="0" class="my-0 mb-2" color="card" v-if="Topic.lock.all == true">
            Bài viết đã bị khóa vì lý do: <span class="font-weight-bold error--text">{{Topic.lock.info}}</span>
        </v-alert>

        <v-alert tile type="info" dense prominent elevation="0" class="my-0 mb-2" color="card" v-if="Topic.lock.post == true">
            Bài viết đã tắt chức năng bình luận
        </v-alert>

        <!--Post -->
        <v-card flat tile color="card">
            <v-card-title>Bình luận ({{Posts.length}})</v-card-title>
            <v-card-subtitle class="pb-2">Các ý kiến về bài viết</v-card-subtitle>
            
            <v-card-text v-if="Posts.length < 1" class="py-2">
                <v-alert tile type="info" dense prominent elevation="0" class="my-0" color="cardmini">
                    Bài viết chưa có bình luận nào
                </v-alert>
            </v-card-text>

            <v-card-text v-if="Posts.length > 0" class="pa-0 mt-2">
                <Post-Main v-for="(Post, i) in Posts" :key="Post._id" :Post="Post" :Topic="Topic" @delete="$delete(Posts, i)"></Post-Main>
            </v-card-text>

            <v-card-text class="py-3 d-flex" v-if="$store.state.auth.login && CheckRoleLockPost">
                <v-avatar size="48" class="mr-2">
                    <v-img :src="$store.state.auth.profile.image"></v-img>
                </v-avatar>
                <v-text-field v-model="Content" @keyup.enter="CreatePost" 
                    :disabled="Loading" label="Nhập nội dung" append-icon="font_download" hide-details
                    color="primary" flat solo rounded background-color="input" auto-grow
                ></v-text-field>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    scrollToTop: true,
    async fetch() {
        try {
            let Get = await this.$axios.$get(`/forum/topic/${this.$route.params.link}`);
            if(Get.err) throw Get.status;

            this.Topic = Get.topic;
            this.Posts = Get.topic.posts;

            this.$store.commit('forum/SetTopic', this.Topic)
        }
        catch(e){
            throw new Error(e.toString())
        }
    },
    data() {
        return {
            Content: '',
            Loading: false,
            Topic: null,
            Posts: null,
        }
    },
    beforeRouteLeave (to, from, next) {
        this.$store.commit('forum/SetTopic', null);
        next()
    },
    computed: {
        CheckRoleLockPost(){
            if(this.$store.state.auth.role === 1) return true;
            else if(this.$store.state.auth.id === this.Topic.category.smod) return true;
            else if(this.Topic.child.mod.indexOf(this.$store.state.auth.id) > -1) return true;
            else if(!this.Topic.lock.all){
                if(this.$store.state.auth.id === this.Topic.creator._id) return true;
                if(!this.Topic.lock.post) return true;
                return false;
            }
            else return false;
        }
    },
    methods: {
        async CreatePost(){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Create = await this.$axios.$post('/forum/post/create', {
                    topic: this.Topic._id,
                    content: this.Content
                });

                if(Create.err) throw Create.status;

                let Post = Create.post;
                Post.creator = {
                    _id: this.$store.state.auth.id,
                    profile: this.$store.state.auth.profile
                };

                this.Posts.push(Post);

                this.$notify('Bình luận đã được đăng tải');
                this.Loading = false;
                this.Content = '';
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        }
    }
}
</script>