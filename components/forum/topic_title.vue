<template>
    <v-card flat tile class="px-4 py-2 d-flex" color="cardmini">
        <v-avatar size="53" style="border-radius: 50%; margin-top: 7px"  class="mr-4" v-if="!hideAvatar">
            <v-img :src="Topic.creator.profile.image">
                <template v-slot:placeholder>
                    <v-skeleton-loader class="Avatar" ref="skeleton" type="avatar"></v-skeleton-loader>
                </template>
            </v-img>
        </v-avatar>

        <v-avatar size="53" style="border-radius: 50%; margin-top: 7px"  class="mr-4" v-else :color="Colors[Math.floor((Math.random()*Colors.length))]">
            <v-icon v-if="hideAvatar">forum</v-icon>
        </v-avatar>

        <div>
            <v-card-title class="py-0 my-1 pl-0 font-weight-light" style="font-size: 21px;">
                <nuxt-link class="white--text" :to="`/forum/topic/${Topic.link}`">{{Topic.title}}</nuxt-link>
            </v-card-title>

            <v-card-subtitle class="pb-0 pl-0 font-weight-light pt-3">
                <v-chip-group column>
                    <v-chip v-if="!hideAvatar" link :to="`/user/${Topic.creator.profile.name}`" small class="mr-1" :color="Colors[Math.floor((Math.random()*Colors.length))]"><v-icon small left>person</v-icon>{{Topic.creator.profile.name}}</v-chip>
                    <v-chip link :to="`/forum/category/${Topic.category.link}`" small class="mr-1">{{Topic.category.title}}</v-chip>
                    <v-chip link :to="`/forum/child/${Topic.child.link}`" small class="mr-1">{{Topic.child.title}}</v-chip>
                    <v-chip small class="mr-1"><v-icon x-small class="mr-1">visibility</v-icon>{{ Topic.view }}</v-chip>
                    <v-chip small class="mr-1"><v-icon x-small class="mr-1">chat</v-icon>{{ Topic.numPosts }}</v-chip>
                </v-chip-group>
            </v-card-subtitle>
        </div>
    </v-card>
</template>

<script>
export default {
    props: ['Topic', 'hide-avatar'],
    props: {
        Topic: Object,
        hideAvatar: Boolean
    },
    data(){
        return {
            Colors: ['primary', 'info', 'error', 'pink', 'deep-purple', 'indigo', 'teal', 'deep-orange']
        }
    }
}
</script>