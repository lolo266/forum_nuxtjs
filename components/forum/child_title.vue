<template>
    <v-card flat tile class="px-4 py-2 d-flex" color="cardmini">
        <v-avatar size="53" style="border-radius: 50%; margin-top: 7px"  class="mr-4" :color="Colors[Math.floor((Math.random()*Colors.length))]">
            <v-icon v-if="Child.vip">star</v-icon>
            <v-icon v-else>flag</v-icon>
        </v-avatar>

        <div>
            <v-card-title class="py-0 my-1 pl-0 font-weight-light" style="font-size: 21px;">
                <nuxt-link class="white--text" :to="`/forum/child/${Child.link}`">{{Child.title}}</nuxt-link>
                <v-chip v-if="Child.vip" x-small class="ml-1" color="amber darken-3">VIP</v-chip>
            </v-card-title>

            <v-card-subtitle class="pb-0 pl-0 font-weight-light pt-3">
                <v-chip-group column>
                    <v-chip small><span class="font-weight-bold pr-1">{{Child.numTopics}}</span> bài viết</v-chip>
                    <v-chip small><span class="font-weight-bold pr-1">{{Child.numPosts}}</span> bình luận</v-chip>
                    <v-chip small v-if="Child.mod.length > 0"><v-icon small class="mr-1">supervisor_account</v-icon><span class="font-weight-bold pr-1">{{Child.mod.length}}</span> Mod</v-chip>
                </v-chip-group>
            </v-card-subtitle>
        </div>
    </v-card>
</template>

<script>
export default {
    props: {
        Child: Object
    },
    data(){
        return {
            Colors: ['primary', 'info', 'error', 'deep-purple', 'indigo', 'teal', 'deep-orange']
        }
    }
}
</script>