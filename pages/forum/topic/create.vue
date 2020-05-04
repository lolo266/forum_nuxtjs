<template>
    <v-card flat tile v-if="$fetchState.pending" color="card">
        <v-skeleton-loader ref="skeleton" type="card-heading" width="200"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton" type="list-item-three-line" class="mb-2"></v-skeleton-loader>
    </v-card>

    <v-card flat tile v-else-if="$fetchState.error" color="card">
        <v-skeleton-loader ref="skeleton" type="card-heading" width="200"></v-skeleton-loader>
        <v-skeleton-loader ref="skeleton" type="list-item-three-line" class="mb-2"></v-skeleton-loader>
    </v-card>

    <v-card tile flat color="card" v-else>
        <v-card-title class="headline-1">Tạo Bài Viết</v-card-title>
        <v-card-subtitle>Tạo bài viết vào khu vực cụ thể</v-card-subtitle>

        <v-card-text class="pa-4 pt-2">
            <v-form ref="formCreate" v-model="Validate">
                <v-text-field 
                    v-model="Title" 
                    label="Tiêu đề" type="text" 
                    append-icon="title" color="primary" flat solo  
                    background-color="input" 
                    :counter="80"
                    :rules="[Rules.required, Rules.counterTitleMax, Rules.counterTitleMin , Rules.stringCase, Rules.mutispace]"
                ></v-text-field>
                
                <v-select 
                    v-model="CategorySelect" :items="Categorys" 
                    item-text="title" item-value="childs"
                    label="Khu vực lớn" append-icon="folder" color="primary" 
                    flat solo background-color="input"
                    :rules="[Rules.required]"
                >
                </v-select>
                
                <v-select 
                    v-if="CategorySelect"
                    v-model="ChildSelect" :items="CategorySelect" 
                    item-text="title" item-value="_id"
                    label="Khu vực nhỏ" append-icon="folder_open" color="primary" 
                    flat solo background-color="input"
                    :rules="[Rules.required]"
                >
                </v-select>

                <v-text-field 
                    @click="Dialog = true"
                    label="Nội dung" type="text" 
                    append-icon="subject" color="primary" flat solo 
                    background-color="input" 
                ></v-text-field>
 
                <v-checkbox v-model="LockPost" label="Tắt bình luận" class="mt-0" />

                <v-btn color="primary" depressed @click="Create" :loading="Loading" :disabled="Loading">Tạo bài viết</v-btn>
            </v-form>
        </v-card-text>
        
        <Editor v-model="Dialog" :content="Content" @save="Content = $event" reset></Editor>
    </v-card>
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
    data: () => ({
        Categorys: null,
        Dialog: false,
        Title: '',
        CategorySelect: '',
        ChildSelect: '',
        Content: '',
        LockPost: false,
        Loading: false,
        Validate: true,
        Rules: {
            required: value => !!value || 'Không được để trống',
            counterTitleMax: value => (value && value.length <= 80) || ' Vượt quá độ dài ký tự cho phép',
            counterTitleMin: value => (value && value.length >= 15) || ' Tối thiểu 20 ký tự',
            stringCase: value => !(/@|%|\_|\^|\*|\(|\)|\+|\=|\<|\>|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|`|-|{|}|\||\\/gm.test(value)) || 'Phát hiện có ký tự đặc biệt',
            mutispace: value => !(/\s\s/.test(value)) || 'Phát hiện khoảng cách liên tiếp',
        },
    }),
    methods: {
        async Create(){
            try {
                if(!this.Validate) return this.$refs.formCreate.validate();
                this.Loading = true;

                let CreateTopic = await this.$axios.$post('/forum/topic/create', {
                    title: this.Title,
                    content: this.Content,
                    lockpost: this.LockPost,
                    child: this.ChildSelect
                });

                if(CreateTopic.err) throw CreateTopic.status;
                this.$notify('Tạo bài thảo luận thành công');
                this.$router.push(`/forum/topic/${CreateTopic.link}`)
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
    }
}
</script>