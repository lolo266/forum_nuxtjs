<template>
    <v-card tile flat color="card" class="mb-2">
        <v-card-title>Bài viết</v-card-title>
        <v-card-subtitle>Thông tin chi tiết bài viết</v-card-subtitle>

        <v-card-text class="d-flex align-center justify-space-between pb-0">
            <span>Người tạo</span>
            <v-chip small link :to="`/user/${Topic.creator.profile.name}`" color="primary">{{Topic.creator.profile.name}}</v-chip>
        </v-card-text>
        <v-card-text class="d-flex align-center justify-space-between pb-0">
            <span>Ngày đăng</span>
            <v-chip small>{{$dayjs(Topic.date).format('DD-MM-YYYY')}}</v-chip>
        </v-card-text>
        <v-card-text class="d-flex align-center justify-space-between pb-0">
            <span>Bình luận</span>
            <v-chip small>{{Topic.posts.length}}</v-chip>
        </v-card-text>
        <v-card-text class="d-flex align-center justify-space-between pb-0" >
            <span>Lượt xem</span>
            <v-chip small>{{Topic.view}}</v-chip>
        </v-card-text>
        <v-card-text class="d-flex align-center justify-space-between" >
            <span>Cập nhật</span>
            <v-chip small>{{$dayjs(Topic.date).fromNow()}}</v-chip>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    computed: {
        Topic(){
            return this.$store.state.forum.TopicSelect
        }
    },
}
</script>