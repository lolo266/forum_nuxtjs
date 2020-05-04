<template>
    <v-img :aspect-ratio="16/7" :src="User.profile.background">
        <template v-slot:placeholder>
            <v-skeleton-loader ref="skeleton" type="image"></v-skeleton-loader>
        </template>

        <div style="position: absolute; bottom: 0; left: 0;" class="pa-4 d-flex align-end">
            <v-sheet color="transparent" style="position: relative;">
                <v-avatar size="100">
                    <v-img :src="User.profile.image">
                        <template v-slot:placeholder>
                            <v-skeleton-loader class="Avatar" ref="skeleton" type="avatar"></v-skeleton-loader>
                        </template>
                    </v-img>
                </v-avatar>

                <div v-if="$store.state.auth.id == User._id" style="position: absolute; bottom: 0; right: 0;">
                    <v-btn fab x-small color="info" 
                        :loading="LoadingImage" :disabled="LoadingImage"
                        @click="$refs.ImageUser.click()"
                    ><v-icon>settings</v-icon></v-btn>
                    <input type="file" id="ImageUser" ref="ImageUser" @change="UploadImageFile" hidden>
                </div>
            </v-sheet>

            <div class="d-flex flex-column px-4" style="width: 100%;">
                <span class="text-capitalize" style="font-size: 2.1rem; font-weight: 600;">{{User.profile.name}}</span>
                <div class="pb-1">
                    <v-chip small><v-icon small left>mail</v-icon>{{User.profile.email}}</v-chip>
                    <v-chip small><v-icon small left>flag</v-icon>{{ $dayjs(User.profile.date).format('DD-MM-YYYY') }}</v-chip>
                </div>
            </div>
        </div>

        <div v-if="$store.state.auth.id == User._id" style="position: absolute; top: 0; right: 5px;">
            <v-btn depressed icon 
                :loading="LoadingImage" :disabled="LoadingImage"
                @click="$refs.BackgroundUser.click()"
            ><v-icon small>settings</v-icon></v-btn>
            <input type="file" id="BackgroundUser" ref="BackgroundUser" @change="UploadImageFile" hidden>
        </div>
    </v-img>
</template>

<script>
export default {
    props: ['User'],
    data() {
        return {
            LoadingImage: false,
        }
    },
    methods: {
        async UploadImageFile(e){
            this.LoadingImage = true;

            let File = e.target.files[0];
            if(!File) return this.LoadingImage = false;
            let formData = new FormData();
            formData.append('image', File);

            try {
                let Upload = await fetch('https://api.imgur.com/3/image', {
                    redirect: 'follow',
                    method: 'POST',
                    headers: new Headers({
                        Authorization: 'Client-ID 1c3db41bb73b992'
                    }),
                    body: formData
                });
                if(!Upload.ok) throw 'Tải hình ảnh thất bại';
                
                let Result = await Upload.text();
                Result = JSON.parse(Result).data;
                
                if(e.target.id == 'BackgroundUser') return this.EditBackground(Result.link);
                if(e.target.id == 'ImageUser') return this.EditImage(Result.link);
            }
            catch(e){
                this.LoadingImage = false;
                this.$notify(e.toString());
            }
        },
        async EditImage(link){
            try {
                let Edit = await this.$axios.$post('/user/edit/image', {
                    image: link
                });

                if(Edit.err) throw Edit.status;

                this.LoadingImage = false;
                this.User.profile.image = link;
            }
            catch(e){
                this.LoadingImage = false;
                this.$notify(e.toString());
            }  
        },
        async EditBackground(link){
            try {
                let Edit = await this.$axios.$post('/user/edit/background', {
                    image: link
                });

                if(Edit.err) throw Edit.status;

                this.LoadingImage = false;
                this.User.profile.background = link;
            }
            catch(e){
                this.LoadingImage = false;
                this.$notify(e.toString());
            }  
        }
    }
}
</script>