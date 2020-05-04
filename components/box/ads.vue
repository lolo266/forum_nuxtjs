<template>
    <v-card tile flat color="card" :width="w" :height="h" class="d-flex mb-2 text-center">
        <v-card-text class="d-flex justify-center align-center">
            Ads {{w}}x{{h}}
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: ['w', 'h']
}
</script>