<template>
    <!--Dialog -->
    <v-dialog v-model="Dialog" persistent fullscreen>
        <!--Image Max-->
        <v-sheet 
            style="position: absolute; top: 0; left: 0;"
            class="d-flex justify-center align-center"
            height="100%" width="100%" 
        >
            <img :src="images[SelectItem]" style="max-height: 100%; max-width: 100%" :alt="images[SelectItem]">
        </v-sheet>


        <!--Action-->
        <v-sheet height="100%" width="100%" style="position: absolute; top: 0; left: 0;" color="#00000000">
            <div class="d-flex align-center justify-space-between" style="height: 50px;">
                <span class="title white--text px-3">{{SelectItem + 1}} / {{images.length}}</span>
                <v-btn class="ml-auto mr-2" icon target="_blank" link :href="images[SelectItem]" color="white"><v-icon>launch</v-icon></v-btn>
                <v-btn class="mr-2" icon @click="Close()" color="white"><v-icon>close</v-icon></v-btn>
            </div>

            <div class="d-flex justify-space-between align-center px-1" style="height: calc(100% - 100px);">
                <v-btn icon @click="Before()" color="white" v-if="images.length > 1"><v-icon x-large>navigate_before</v-icon></v-btn>
                <v-btn icon @click="Next()" color="white" v-if="images.length > 1"><v-icon x-large>navigate_next</v-icon></v-btn>
            </div>

            <div style="height: 50px;"></div>
        </v-sheet>
    </v-dialog>
</template>

<script>
  export default {
    model: {
        prop: 'Dialog',
        event: 'Change'
    },
    props: {
        Dialog: Boolean,
        images: Array,
        select: Number
    },
    data(){
        return {
            SelectItem: this.select
        }
    },
    methods: {
        Next(){
            if(this.SelectItem < this.images.length - 1) return this.SelectItem ++;
            this.SelectItem = 0;
        },
        Before(){
            if(this.SelectItem > 0) return this.SelectItem --;
            this.SelectItem = this.images.length - 1;
        },
        Close(){
            this.$emit('Change', false)
        }
    }
  }
</script>