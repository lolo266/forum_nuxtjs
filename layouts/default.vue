<template>
    <v-app>
        <client-only>
            <notifications position="top right" width="300"/>
        </client-only>

        <!--Nav left-->
        <v-navigation-drawer v-model="NavLeft" app clipped floating color="#18191a" class="Scroll-Left py-3">
            <v-list nav class="py-0">
                <v-subheader class="px-2">Danh mục</v-subheader>
                <v-list-item v-for="item in ListMenu" :key="item.title" link :to="item.link" color="navitem" dense>
                    <v-list-item-title class="subtitle-1">
                        <v-icon left style="margin-bottom: 1px;">{{item.icon}}</v-icon> {{item.title}}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <!--Header-->
        <v-app-bar app fixed flat color="header" class="Header" dense clipped-left clipped-right>
            <v-btn icon tile @click.stop="NavLeft = !NavLeft" v-if="!NavLeft"><v-icon>apps</v-icon></v-btn>
            <v-toolbar-title class="pl-1" style="cursor: pointer" @click="$router.push('/forum')">Project</v-toolbar-title>
            <v-spacer />

            <Login v-if="!Auth.login"></Login>

            <div v-else>
                <v-btn icon tile><v-icon>notifications</v-icon></v-btn>
                <v-btn icon tile><v-icon>chat</v-icon></v-btn>
                <User />
            </div>

            <v-btn icon tile @click.stop="NavRight = !NavRight" v-if="!NavRight" class="mr-0"><v-icon>keyboard_arrow_left</v-icon></v-btn>
        </v-app-bar>

        <!--Nav right-->
        <v-navigation-drawer v-model="NavRight" app clipped right floating color="#18191a" width="360" class="Scroll-Right py-3">
            <client-only>
                <CategoryInfo v-if="$store.state.forum.CategorySelect"/>
            </client-only>

            <client-only>
                <ChildInfo v-if="$store.state.forum.ChildSelect"/>
            </client-only>

            <client-only>
                <TopicInfo v-if="$store.state.forum.TopicSelect"/>
            </client-only>

            <Ads w="336" h="280" />
        </v-navigation-drawer>
        
        <!--Content-->
        <v-content>
            <v-container fluid>
                <nuxt />
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import Login from '~/components/core/header/login';
import User from '~/components/core/header/user';

import CategoryInfo from '~/components/core/nav-right/forum/categoryInfo';
import ChildInfo from '~/components/core/nav-right/forum/childInfo';
import TopicInfo from '~/components/core/nav-right/forum/topicInfo';

export default {
    components: { Login, User , CategoryInfo, ChildInfo, TopicInfo},
    computed: {
        Auth(){
            return this.$store.state.auth
        }
    },
    data(){
        return {
            NavLeft: null,
            NavRight: null,
            ListMenu: [
                //{icon: 'home', title: 'Trang Chủ', link: '/'},
                {icon: 'forum', title: 'Diễn Đàn', link: '/forum'},
                //{icon: 'info', title: 'Thông Tin', link: '/about'}
            ]
        }
    }
}
</script>