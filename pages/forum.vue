<template>
    <div>
        <v-toolbar flat tile color="header" class="Header-Mini mb-2" dense>
            <v-btn icon tile @click="$router.push('/forum')"><v-icon>home</v-icon></v-btn>
            <v-btn icon tile @click="$router.push('/forum/latest')"><v-icon>update</v-icon></v-btn>
            <v-btn icon tile @click="$router.push('/forum/search')"><v-icon>search</v-icon></v-btn>
            <v-btn icon tile @click="$router.push('/forum/topic/create')"><v-icon>create</v-icon></v-btn>
            <v-btn icon tile @click="$router.push('/forum/admin')" v-if="$store.state.auth.role == 1"><v-icon>lock</v-icon></v-btn>
        </v-toolbar>

        <div class="ContentMain"><nuxt-child></nuxt-child></div>
    </div>
</template>