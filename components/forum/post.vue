<template>
    <v-sheet color="card" tile class="d-flex pa-4 py-2">
        <!--Avatar User Post -->
        <v-avatar size="48">
            <v-img :src="Post.creator.profile.image">
                <template v-slot:placeholder>
                    <v-skeleton-loader class="Avatar" ref="skeleton" type="avatar"></v-skeleton-loader>
                </template>
            </v-img>
        </v-avatar>

        <!--Main Post -->
        <div class="ml-2">
            <v-card flat class="Radius-1" color="input">
                <v-card-text class="pa-0" v-if="EditTrue">
                    <v-text-field  
                        v-model="newContent"
                        hide-details label="Nhập nội dung mới" type="text" solo flat
                        color="primary" background-color="input" dense autofocus
                        :loading="Loading" :disabled="Loading" @keyup.enter="EditContent()"
                    ></v-text-field>
                </v-card-text>
                <v-card-text class="px-4 py-3" style="word-break: break-all; font-size: 17px;" v-else>{{Post.content}}</v-card-text>
            </v-card>

            <v-chip-group column class="py-0">
                <v-chip x-small class="mr-1" color="primary" :to="`/user/${Post.creator.profile.name}`" link>{{Post.creator.profile.name}}</v-chip>
                
                <v-chip x-small class="mr-1 px-2" color="red" v-if="Post.creator.role == 1">A</v-chip>
                <v-chip x-small class="mr-1 px-2" color="green" v-if="Post.creator._id === Topic.category.smod">S</v-chip>
                <v-chip x-small class="mr-1 px-2" color="purple" v-if="Topic.child.mod.indexOf(Post.creator._id) > -1">M</v-chip>
                
                <v-chip x-small outlined class="mr-0">{{ $dayjs(Post.date).format('HH:MMa DD-MM-YYYY') }}</v-chip>
            </v-chip-group>
        </div>       

        <!--Menu Post -->
        <v-menu offset-y left nudge-bottom="3" v-if="CheckRoleAll">
            <template v-slot:activator="{ on }">
                <v-btn icon small depressed v-on="on" class="ml-1"><v-icon>more_vert</v-icon></v-btn>
            </template>

            <v-list nav class="pa-2" dense min-width="150">
                <v-list-item @click="EditTrue = true" v-if="CheckRoleEdit">
                    <v-list-item-icon class="mr-3"><v-icon small>create</v-icon></v-list-item-icon>
                    <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item>
                <v-list-item @click="Delete" v-if="CheckRoleDelete">
                    <v-list-item-icon class="mr-3"><v-icon small>delete</v-icon></v-list-item-icon>
                    <v-list-item-title>Xóa</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-sheet>
</template>

<script>
export default {
    props: ['Post', 'Topic'],
    data(){
        return {
            EditTrue: false,
            newContent: this.Post.content,
            Loading: false
        }
    },
    computed: {
        CheckRoleAll(){
            if(this.$store.state.auth.role === 1) return true;
            else if(this.$store.state.auth.id === this.Topic.category.smod) return true;
            else if(this.Topic.child.mod.indexOf(this.$store.state.auth.id) > -1) return true;
            else if(this.$store.state.auth.id === this.Post.creator._id) return true;
            else return false;
        },
        CheckRoleDelete(){
            if(this.$store.state.auth.role === 1) return true;
            if(this.$store.state.auth.id === this.Topic.category.smod) return true;
            if(this.Topic.child.mod.indexOf(this.$store.state.auth.id) > -1) return true;
            if(this.$store.state.auth.id === this.Post.creator._id) return true;
            return false;
        },
        CheckRoleEdit(){
            if(this.$store.state.auth.role === 1) return true;
            if(this.$store.state.auth.id === this.Post.creator._id) return true;
            return false;
        },
    },
    methods: {
        async EditContent(){
            if(this.Loading) return false;
            if(!this.newContent) return this.EditTrue = false;
            if(this.newContent == this.Post.content) return this.EditTrue = false;
            this.Loading = true;

            try {
                let Edit = await this.$axios.$post('/forum/post/edit', {
                    post: this.Post._id,
                    content: this.newContent
                });

                if(Edit.err) throw Edit.status;

                this.$notify('Sửa bình luận thành công');
                this.Loading = false;
                this.Post.content = this.newContent;
                this.EditTrue = false;
            }
            catch(e){
                this.Loading = false;
                this.EditTrue = false;
                this.newContent = this.Post.content;
                this.$notify(e.toString());
            }
        },
        async Delete(){
            if(this.Loading) return false;
            this.Loading = true;

            try {
                let Delete = await this.$axios.$post('/forum/post/delete', {
                    post: this.Post._id,
                });

                if(Delete.err) throw Delete.status;

                this.$emit('delete', true)
                this.$notify('Xóa bình luận thành công');
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        }
    }
}
</script>
