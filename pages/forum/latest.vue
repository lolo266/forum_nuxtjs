<template>
    <v-card flat tile v-if="$fetchState.pending" color="card">
        <v-skeleton-loader ref="skeleton" type="card-heading" width="200"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton"
            v-for="i in 3" :key="i"
            type="list-item-three-line" class="mb-2"
        ></v-skeleton-loader>
    </v-card>

    <v-card flat tile v-else-if="$fetchState.error" color="card">
        <v-skeleton-loader ref="skeleton" type="card-heading" width="200"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton" type="list-item-three-line" class="mb-2"></v-skeleton-loader>
    </v-card>

    <v-card flat tile v-else color="card">
        <v-card-title>Latest</v-card-title>
        <v-card-subtitle>Các bài viết cập nhật mới nhất</v-card-subtitle>

        <v-card-text v-if="Topics.length < 1">
            <v-alert tile type="info" dense prominent elevation="0" class="my-0" color="cardmini">
                Hiện tại chưa có bài viết nào mới cập nhật
            </v-alert>
        </v-card-text>

        <v-card-text class="py-0 px-0" v-else>
            <Topic-Title v-for="(Topic, i) in Topics" :key="i" :Topic="Topic"></Topic-Title>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    scrollToTop: true,
    async fetch() {
        try {
            let Get = await this.$axios.$get(`/forum/latest/${this.Topics.length}`);
            if(Get.err) throw Get.status;

            this.Topics = this.Topics.concat(Get.topics);
        } catch(e) {
            this.$nuxt.error(({statusCode: 404, message: e.toString()}))  
        }
    },
    data(){
        return {
            Topics: [],
        }
    },
    methods: {
        async Next(num){
            try {
                let Get = await this.$axios.$get(`/forum/latest/${num}`);
                if(Get.err) throw Get.status;
                
                this.Topics = this.Topics.concat(Get.topics);
            } catch(e) {
            }
        },
    }
}
</script>

<style lang="scss"></style>