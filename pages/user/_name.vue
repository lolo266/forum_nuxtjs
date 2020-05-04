<template>
    <v-card flat tile v-if="$fetchState.pending" color="card">
        <v-skeleton-loader ref="skeleton" type="card-heading"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton" type="paragraph" class="mx-4"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton" type="card-heading" width="100"></v-skeleton-loader>
    </v-card>

    <v-card flat tile v-else-if="$fetchState.error" color="#18191a">
        <v-card-text class="text-center" style="padding: 100px 20px">
            <p class="display-4 font-weight-regular">{{$fetchState.error.statusCode}}</p>
            <p class="headline text-capitalize font-weight-light">{{$fetchState.error.message}}</p>
        </v-card-text>
    </v-card>

    <div v-else>
        <!--Background Cover-->
        <Cover :User="User" class="mb-2"></Cover>

        <div class="ContentMain">
            <!--Forum-->
            <v-card flat tile color="card">
                <v-card-title>Diễn đàn</v-card-title>
                <v-card-subtitle>Các bài viết của <span class="text-capitalize">{{User.profile.name}}</span></v-card-subtitle>

                <v-card-text v-if="User.topics.length < 1">
                    <v-alert tile type="info" dense prominent elevation="0" class="my-0" color="alertmini">
                        <span class="text-capitalize">{{User.profile.name}}</span> chưa có bài viết nào
                    </v-alert>
                </v-card-text>

                <v-card-text v-else class="pa-0">
                    <Topic-Title v-for="Topic in User.topics" :key="Topic._id" :Topic="Topic" hide-avatar></Topic-Title>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script>
import Cover from '~/components/user/cover'; 
export default {
    components: {Cover},
    async fetch() {
        try {
            let Get = await this.$axios.$get(`/user/${this.$route.params.name}`);
            if(Get.err) throw Get.status;

            this.User = Get.user;
        }
        catch(e){
            throw new Error(e.toString())
        }
    },
    fetchOnServer: false,
    data() {
        return {
            User: null,
        }
    },
    methods: {
    }
}
</script>