<template>
    <v-menu offset-y nudge-bottom="5" min-width="180">
        <template v-slot:activator="{ on }">
            <v-btn icon tile v-on="on" ><v-icon>person</v-icon></v-btn>
        </template>

        <v-list nav class="pa-2" dense>
            <v-list-item link :to="`/user/${$store.state.auth.profile.name}`">
                <v-list-item-icon class="mr-4">
                    <v-icon>person</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Tài khoản</v-list-item-title>
            </v-list-item>

            <v-list-item @click="Logout">
                <v-list-item-icon class="mr-4">
                    <v-icon>power</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Đăng xuất</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    methods: {
        Logout(){
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            this.$store.commit('auth/Logout');
        }
    }
}
</script>