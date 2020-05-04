<template>
    <div>
        <v-card tile flat color="card" class="mb-2">
            <v-card-title>{{Child.title}}</v-card-title>
            <v-card-subtitle>Thông tin chi tiết khu vực</v-card-subtitle>

            <v-card-text class="d-flex align-center justify-space-between pb-0" v-if="Child.vip">
                <span>Phân loại</span>
                <v-chip small color="amber darken-3">VIP</v-chip>
            </v-card-text>
            <v-card-text class="d-flex align-center justify-space-between">
                <span>Bài viết</span>
                <v-chip small>{{Child.numTopics}}</v-chip>
            </v-card-text>
            <v-card-text class="d-flex align-center justify-space-between pt-0" v-if="Child.mod.length == 0">
                <span>Quản trị viên</span>
                <v-chip small color="error">Không</v-chip>
            </v-card-text>
        </v-card>

        <v-card tile flat color="card" class="mb-2" v-if="Child.mod.length > 0">
            <v-card-title>Quản trị viên</v-card-title>
            <v-card-subtitle>Danh sách quản trị khu vực</v-card-subtitle>

            <v-card-text class="pt-1 d-flex align-center" v-for="user in Child.mod" :key="user._id">
                <v-avatar size="30" class="mr-2"><v-img :src="user.profile.image"></v-img></v-avatar>
                <nuxt-link :to="`/user/${user.profile.name}`" class="white--text">{{user.profile.name}}</nuxt-link>
                
                <v-chip small class="ml-auto"><v-icon small class="mr-1">supervisor_account</v-icon> Mod</v-chip>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    computed: {
        Child(){
            return this.$store.state.forum.ChildSelect
        }
    },
}
</script>