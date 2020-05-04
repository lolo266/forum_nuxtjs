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


    <div v-else> 
        <Ads w="728" h="90" />
        <v-card flat tile color="card" v-for="category in Categorys" :key="category._id" class="mb-2">          
            <v-card-title class="d-flex justify-space-between flex-nowrap align-start">
                <nuxt-link class="white--text" :to="`/forum/category/${category.link}`">{{category.title}}</nuxt-link>
                <v-chip small v-if="category.smod" link :to="`/user/${category.smod.profile.name}`" color="primary" class="ml-0">
                    <v-icon small>verified_user</v-icon>
                    <span class="font-weight-bold text-capitalize pl-1">{{category.smod.profile.name}}</span>
                </v-chip>
            </v-card-title>
            <v-card-subtitle>Danh sách khu vực nhỏ</v-card-subtitle>

            <v-card-text v-if="category.childs.length < 1">
                <v-alert tile type="info" dense prominent elevation="0" class="my-0" color="cardmini">
                    Tại đây chưa có khu vực nhỏ
                </v-alert>
            </v-card-text>

            <v-card-text class="py-0 px-0" v-else>
                <ChildTitle v-for="Child in category.childs" :key="Child._id" :Child="Child" :Smod="category.smod"></ChildTitle>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import ChildTitle from '~/components/forum/child_title';

export default {
    scrollToTop: true,
    components: {ChildTitle},
    async fetch() {
        try {
            let Get = await this.$axios.$get('/forum/categorys');
            if(Get.err) throw Get.status;

            this.Categorys = Get.categorys;
        }
        catch(e){
            throw new Error(e.toString())
        }
    },
    data() {
        return {
            Categorys: null
        }
    }
}
</script>