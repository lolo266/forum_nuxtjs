<template>
    <v-card color="card" flat tile>
        <!--Header -->
        <v-card-title class="d-flex justify-space-between flex-nowrap align-start" style="font-size: 2.2rem;">
            <span class="font-weight-medium">{{Topic.title}}</span>

            <!--Menu Topic -->
            <v-menu offset-y left nudge-bottom="3" min-width="150" v-if="CheckRole">
                <template v-slot:activator="{ on }">
                    <v-btn small icon class="ml-2" style="margin-right: -2px" v-on="on"><v-icon>more_vert</v-icon></v-btn>
                </template>

                <v-list nav class="pa-2" dense>
                    <v-list-item @click="Dialog = true" v-if="CheckRoleEdit">
                        <v-list-item-icon class="mr-3"><v-icon small>create</v-icon></v-list-item-icon>
                        <v-list-item-title>Chỉnh sửa</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="LockPost" v-if="CheckRoleEdit && Topic.lock.post">
                        <v-list-item-icon class="mr-3"><v-icon small>speaker_notes</v-icon></v-list-item-icon>
                        <v-list-item-title>Bật bình luận</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="LockPost" v-if="CheckRoleEdit && !Topic.lock.post">
                        <v-list-item-icon class="mr-3"><v-icon small>speaker_notes_off</v-icon></v-list-item-icon>
                        <v-list-item-title>Tắt bình luận</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="LockTopic" v-if="CheckRoleLock && Topic.lock.all">
                        <v-list-item-icon class="mr-3"><v-icon small>lock_open</v-icon></v-list-item-icon>
                        <v-list-item-title>Mở khóa</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="DialogLock = true" v-if="CheckRoleLock && !Topic.lock.all">
                        <v-list-item-icon class="mr-3"><v-icon small>lock</v-icon></v-list-item-icon>
                        <v-list-item-title>Khóa</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="DeleteTopic" v-if="CheckRoleDelete">
                        <v-list-item-icon class="mr-3"><v-icon small>delete</v-icon></v-list-item-icon>
                        <v-list-item-title>Xóa</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-title>

        <!--Sub Title-->
        <v-card-subtitle style="font-size: 1rem">
            <v-chip-group column>
                <v-chip link color="primary" :to="`/user/${Topic.creator.profile.name}`" small class="mr-1"><v-icon small class="mr-1">person</v-icon>{{ Topic.creator.profile.name }}</v-chip>
                <v-chip link :to="`/forum/category/${Topic.category.link}`" small class="mr-1">{{Topic.category.title}}</v-chip>
                <v-chip link :to="`/forum/child/${Topic.child.link}`"   small class="mr-1">{{Topic.child.title}}</v-chip>
            </v-chip-group>
        </v-card-subtitle>

        <!--Content -->
        <Content v-model="Topic.content" :key="ReloadContent" class="pb-4"></Content>

        <!--Editor-->
        <Editor v-model="Dialog" :content="Topic.content" @save="SaveNewContentTopic($event)" reset>
        </Editor>

        <!--Dialog lock-->
        <v-dialog v-model="DialogLock"  max-width="350" overlay-opacity="0.9">
            <v-card flat tile color="card">
                <v-card-title>Khóa bài viêt</v-card-title>
                <v-card-subtitle class="pt-1">Trình quản lý bài viêt</v-card-subtitle>
                
                <v-card-text>
                    <v-text-field 
                        v-model="InfoLock"
                        hide-details
                        label="Nhập lý do khóa bài viết" type="text" solo flat
                        color="primary" background-color="input"
                        :loading="Loading" :disabled="Loading" @keyup.enter="LockTopic"
                    ></v-text-field>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import Content from '~/components/forum/content';

export default {
    props: ['Topic'],
    components: { Content },
    data() {
        return {
            Dialog: false,
            DialogImage: false,
            SelectItem: 0,
            Content: this.Topic.content,
            Loading: false,
            ReloadContent: false,
            //Lock All
            DialogLock: false,
            InfoLock: ''
        }
    },
    computed: {
        CheckRole(){
            if(this.$store.state.auth.role === 1) return true;
            else if(this.$store.state.auth.id === this.Topic.category.smod) return true;
            else if(this.Topic.child.mod.indexOf(this.$store.state.auth.id) > -1) return true;
            else if(this.$store.state.auth.id === this.Topic.creator._id) return true;
            else return false;
        },
        CheckRoleEdit(){
            if(this.$store.state.auth.role === 1) return true;
            else if(this.$store.state.auth.id === this.Topic.creator._id) return true;
            else return false;
        },
        CheckRoleDelete(){
            if(this.$store.state.auth.role === 1) return true;
            else if(this.$store.state.auth.id === this.Topic.category.smod) return true;
            else return false;
        },
        CheckRoleLock(){
            if(this.$store.state.auth.role === 1) return true;
            else if(this.$store.state.auth.id === this.Topic.category.smod) return true;
            else if(this.Topic.child.mod.indexOf(this.$store.state.auth.id) > -1) return true;
            else return false;
        }
    },
    methods: {
        //Main
        AddEventToLink(){
            let Links = this.$refs.Content.getElementsByTagName("A");
            if(Links.length == 0) return false;

            for (let i = 0; i < Links.length; i++) {
                const a = Links[i];
                let LastURL = a.href.split('/').pop();
                let Type = /(^img)/.test(LastURL);
                let Num = LastURL.replace('img-', '');

                if(!Type || !Number(Num)) return false;

                Links[i].addEventListener('click', (e) => {
                    e.preventDefault();
                    this.OpenImage(Num)
                })
            }
        },
        async SaveNewContentTopic(newContent){
            if(newContent == '') return false;

            try {
                let Edit = await this.$axios.$post('/forum/topic/edit', {
                    topic: this.Topic._id,
                    content: newContent
                });

                if(Edit.err) throw Edit.status;

                this.$notify('Sửa bài viết thành công');
                this.Topic.content = newContent;
                this.ReloadContent = ! this.ReloadContent;
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
        async DeleteTopic(){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Delete = await this.$axios.$post('/forum/topic/delete', {
                    topic: this.Topic._id
                });

                if(Delete.err) throw Delete.status;

                this.$notify('Xóa bài viết thành công');
                this.$router.push(`/forum/child/${this.Topic.child.link}`)
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
        async LockPost(){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Setting = await this.$axios.$post('/forum/topic/lock/post', {
                    topic: this.Topic._id
                });

                if(Setting.err) throw Setting.status;

                this.$notify('Cập nhật trang thái thành công');
                this.Topic.lock.post = !this.Topic.lock.post;
                this.Loading = false;
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
        async LockTopic(){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Lock = await this.$axios.$post('/forum/topic/lock/all', {
                    topic: this.Topic._id,
                    info: this.InfoLock
                });

                if(Lock.err) throw Lock.status;

                this.$notify('Cập nhật trang thái thành công');
                this.Topic.lock.all = !this.Topic.lock.all;
                this.Topic.lock.info = Lock.info;
                
                this.DialogLock = false;
                this.Loading = false;
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
    },
}
</script>
