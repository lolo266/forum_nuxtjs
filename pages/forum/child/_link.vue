<template>
    <v-card flat tile v-if="$fetchState.pending" color="card" >
        <v-skeleton-loader ref="skeleton" type="card-heading" width="200"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton"
            v-for="i in 3" :key="i"
            type="list-item-three-line" class="mb-2"
        ></v-skeleton-loader>
    </v-card>

    <v-card flat tile v-else-if="$fetchState.error" color="card" >
        <v-skeleton-loader ref="skeleton" type="card-heading" width="200"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton" type="list-item-three-line" class="mb-2"></v-skeleton-loader>
    </v-card>

    <v-card flat tile v-else color="card">
        <v-card-title>{{Child.title}}</v-card-title>
        <v-card-subtitle>Tất cả bài viết của khu vực</v-card-subtitle>

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
            let Get = await this.$axios.$get(`/forum/child/${this.$route.params.link}/0`);
            if(Get.err) throw Get.status;

            this.Topics = Get.topics;
            this.Child = Get.child;

            this.$store.commit('forum/SetChild', this.Child)
        } catch(e) {
            throw new Error(e.toString())
        }
    },
    watch: {
        '$route.query': '$fetch'
    },
    beforeRouteLeave (to, from, next) {
        this.$store.commit('forum/SetChild', null);
        next()
    },
    data() {
        return {
            Topics: null,
            Child: null
        }
    }
}
</script>