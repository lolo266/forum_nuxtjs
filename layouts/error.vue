<template>
    <v-card flat tile color="#18191a">
        <v-card-text class="text-center" style="padding: 100px 20px">
            <p class="display-4 font-weight-regular">{{error.statusCode}}</p>
            <p class="headline text-capitalize font-weight-light">{{error.message}}</p>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: ['error'],
    mounted(){
        if(this.error.statusCode == 401){
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            this.$router.push('/forum');
        }
    }
}
</script>

