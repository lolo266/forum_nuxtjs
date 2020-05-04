<template>
    <v-card tile flat color="card" class="mb-2">
        <v-card-title>{{Category.title}}</v-card-title>
        <v-card-subtitle>Thông tin chi tiết khu vực</v-card-subtitle>

        <v-card-text class="d-flex align-center justify-space-between pb-0">
            <span>Bài viết</span>
            <v-chip small>{{Category.numTopics}}</v-chip>
        </v-card-text>
        <v-card-text class="d-flex align-center justify-space-between">
            <span>Quản trị viên</span>
            <v-chip small color="primary" link :to="`/user/${Category.smod.profile.name}`" v-if="Category.smod">
                <v-icon small class="mr-1">verified_user</v-icon> {{Category.smod.profile.name}}
            </v-chip>
            <v-chip small color="error" v-else>Không</v-chip>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    computed: {
        Category(){
            return this.$store.state.forum.CategorySelect
        }
    },
}
</script>