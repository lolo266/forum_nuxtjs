<template>
    <v-card flat tile v-if="$fetchState.pending" color="card">
        <v-skeleton-loader ref="skeleton" type="card-heading" width="200"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton" type="list-item-three-line" class="mb-2"></v-skeleton-loader>
    </v-card>

    <v-card flat tile v-else-if="$fetchState.error" color="card">
        <v-skeleton-loader ref="skeleton" type="card-heading" width="200"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton" type="list-item-three-line" class="mb-2"></v-skeleton-loader>
    </v-card>

    <div class="mb-2" v-else>
        <v-card flat tile class="mb-3" color="card">
            <v-card-title>Tìm Kiếm</v-card-title>
            <v-card-subtitle>Tìm trên tất cả hoặc một khu vực</v-card-subtitle>

            <v-card-text class="pt-2 pb-5">
                <v-form v-model="Validate" ref="formSearch">
                    <v-text-field 
                        v-model="Key" 
                        label="Tiêu đề cần tìm" type="text" 
                        append-icon="title" color="primary" 
                        flat solo background-color="input" 
                        :rules="[Rules.required]"
                        @keyup.enter="Search"
                    ></v-text-field>
                    
                    <v-select
                        v-model="CategorySelect" :items="Categorys" 
                        item-text="title" item-value="childs"
                        label="Khu vực lớn" append-icon="folder" color="primary" 
                        flat solo background-color="input" @change="ChangeCategory">
                    </v-select>

                    <v-select 
                        v-if="CategorySelect"
                        v-model="ChildSelect" :items="CategorySelect" 
                        item-text="title" item-value="_id"
                        label="Khu vực nhỏ" append-icon="folder_open" color="primary" 
                        flat solo background-color="input" @change="ChangeChild">
                    </v-select>

                    <v-btn 
                        @click="Search" 
                        color="primary" 
                        depressed
                        :loading="Loading" :disabled="Loading"
                    >Bắt đầu tìm</v-btn>
                </v-form>
            </v-card-text>
        </v-card>

        <v-skeleton-loader ref="skeleton" type="list-item-three-line" v-if="Loading"></v-skeleton-loader>

        <v-card flat tile v-if="Topics" class="Radius" color="card">
            <v-card-title>Tìm Được {{Topics.length}}</v-card-title>
            <v-card-subtitle>Bài viết hiển thị theo từ khóa</v-card-subtitle>

            <v-card-text v-if="Topics.length < 1">
                <v-alert tile type="info" dense prominent elevation="0" class="mb-0" color="alertmini">
                    Không tìm thấy kêt quả phù hợp với từ khóa
                </v-alert>
            </v-card-text>

            <v-card-text class="py-0 px-0" v-else>
                <Topic-Title v-for="(Topic, i) in Topics" :key="i" :Topic="Topic"></Topic-Title>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    scrollToTop: true,
    async fetch() {
        try {
            let Get = await this.$axios.$get('/forum/categorys/search');
            if(Get.err) throw Get.status;

            this.Categorys = Get.categorys;
        }
        catch(e){
            throw new Error(e.toString())
        }
    },
    data() {
        return {
            Categorys: null,
            Key: '',
            OldKey: null,
            Loading: false,
            CategorySelect: '',
            ChildSelect: '',
            Topics: null,
            Validate: true,
            Rules: {
                required: value => !!value || 'Từ khóa đang để trống',
            },
        }
    },
    methods: {
        ChangeCategory(){
            this.ChildSelect = '';
            this.OldKey = '';
        },
        ChangeChild(){
            this.OldKey = '';
        },
        async Search(){
            if(!this.Validate) return this.$refs.formSearch.validate();
            if(this.Key === this.OldKey) return false;

            try {
                this.Loading = true;
                this.Topics = null;
                this.OldKey = this.Key;

                let Search = await this.$axios.$post('/forum/search', {
                    key: this.Key,
                    child: this.ChildSelect,
                    category: this.CategorySelect ? this.CategorySelect[0].category : null
                });
                if(Search.err) throw Search.status;  

                this.Topics = Search.topics;
                this.Loading = false;
            }
            catch(e){
                this.Loading = false;
                this.$Message(e.toString())
            }
        }
    }
}
</script>