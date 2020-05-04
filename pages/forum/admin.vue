<template>
    <div class="mb-2">
        <!--Create Category-->
        <v-card flat tile color="card" class="mb-2">
            <v-card-title>Tạo Khu Vực lớn</v-card-title>
            <v-card-subtitle>Trình tạo khu vực</v-card-subtitle>

            <v-card-text>
                <v-text-field 
                    v-model="NewCategory"
                    hide-details
                    label="Tên khu vực" type="text" solo flat
                    color="primary" background-color="input"
                    :loading="Loading" :disabled="Loading" @keyup.enter="CreateCategory"
                ></v-text-field>
            </v-card-text>
        </v-card>

        <!--Category and Child-->
        <v-card flat tile color="card" v-if="Categorys.length > 0" class="mb-2">
            <v-card-title>Khu Vực</v-card-title>
            <v-card-subtitle>Trình quản lý khu vực</v-card-subtitle>

            <v-treeview :items="Categorys" item-text="title" item-key="title" item-children="childs" class="pb-4">
                <template v-slot:prepend="{ item }">
                    <v-icon v-if="item.childs">folder</v-icon>
                    <v-icon v-else>{{item.vip ? 'star_border' : 'navigate_next'}}</v-icon>
                </template>

                <template v-slot:label="{ item }">
                    <v-text-field v-if="item.childs"
                        hide-details v-model="TitleModel[item._id]"
                        type="text" solo flat rounded dense
                        color="primary" background-color="input" 
                        @keyup.enter="EditCategory(item._id)" class="mr-5"
                    ></v-text-field>

                    <v-text-field v-else
                        hide-details v-model="TitleModel[item._id]"
                        type="text" solo flat rounded dense
                        color="primary" background-color="input" 
                        @keyup.enter="EditChild(item._id)" class="mr-5"
                    ></v-text-field>
                </template>

                <template v-slot:append="{ item }">
                    <div v-if="item.childs" class="pr-2">
                        <v-btn icon small @click="CategorySelectSMOD = item; DialogSetSMod = true"><v-icon>person</v-icon></v-btn>
                        <v-btn icon small @click="CategorySelectEdit = item; DialogChild = true"><v-icon>add</v-icon></v-btn>
                        <v-btn icon small @click="DeleteCategory(item._id)"><v-icon>delete</v-icon></v-btn>
                    </div>
                    <div v-else class="pr-2">
                        <v-btn icon small @click="ChildSelectMOD = item; DialogSetMod = true"><v-icon>person</v-icon></v-btn>
                        <v-btn icon small @click="DeleteChild(item._id, item.category)"><v-icon>delete</v-icon></v-btn>
                    </div>
                </template>
            </v-treeview>
        </v-card>

        <!--Box Category Select-->
        <v-dialog v-model="DialogSetSMod"  max-width="350" overlay-opacity="0.9">
            <v-card v-if="CategorySelectSMOD" flat tile color="card">
                <v-card-title>Khu vực - {{CategorySelectSMOD.title}}</v-card-title>
                <v-card-subtitle class="pt-1">Trình quản lý quản trị viên (Smod)</v-card-subtitle>

                <v-card-text v-if="!CategorySelectSMOD.smod">
                    <v-alert tile type="info" dense prominent elevation="0" class="my-0" color="cardmini">
                        Hiện tại khu vực chưa có quản trị viên
                    </v-alert>
                </v-card-text>

                <v-card v-else flat tile class="px-4 py-2 d-flex align-center" color="cardmini">
                    <v-avatar size="53" style="border-radius: 50%" class="mr-4">
                        <v-img :src="CategorySelectSMOD.smod.profile.image">
                            <template v-slot:placeholder>
                                <v-skeleton-loader class="Avatar" ref="skeleton" type="avatar"></v-skeleton-loader>
                            </template>
                        </v-img>
                    </v-avatar>

                    <div>
                        <v-card-title class="py-0 my-1 pl-0 font-weight-light" style="font-size: 21px;">
                            <nuxt-link class="white--text" :to="`/user/${CategorySelectSMOD.smod.profile.name}`">{{CategorySelectSMOD.smod.profile.name}}</nuxt-link>
                        </v-card-title>

                        <v-card-subtitle class="pb-0 pl-0 font-weight-light pt-3">
                            <v-chip-group column>
                                <v-chip small class="mr-1">S-MOD</v-chip>
                            </v-chip-group>
                        </v-card-subtitle>
                    </div>

                    <v-spacer/>
                    <v-btn fab depressed x-small color="button" @click="DeleteSmod(CategorySelectSMOD.smod.profile.name)"><v-icon>close</v-icon></v-btn>
                </v-card>

                <v-card-actions class="px-6 pt-1 pb-5" v-if="!CategorySelectSMOD.smod">
                    <v-text-field 
                        v-model="SmodUser" dense
                        hide-details append-icon="person"
                        label="Nhập tên người ủy quyền" type="text" solo flat
                        color="primary" background-color="input"
                        :loading="Loading" :disabled="Loading" @keyup.enter="SetSmod"
                    ></v-text-field>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--Box Child Select-->
        <v-dialog v-model="DialogSetMod"  max-width="350" overlay-opacity="0.9">
            <v-card v-if="ChildSelectMOD" flat tile color="card">
                <v-card-title>Khu vực - {{ChildSelectMOD.title}}</v-card-title>
                <v-card-subtitle class="pt-1">Trình quản lý quản trị viên (Mod)</v-card-subtitle>

                <v-card-text v-if="ChildSelectMOD.mod.length < 1" class="pb-2">
                    <v-alert tile type="info" dense prominent elevation="0" class="my-0" color="cardmini">
                        Hiện tại khu vực chưa có quản trị viên
                    </v-alert>
                </v-card-text>

                <v-card v-else flat tile class="px-4 py-2 d-flex align-center" color="cardmini" v-for="User in ChildSelectMOD.mod" :key="User._id">
                    <v-avatar size="53" style="border-radius: 50%;"  class="mr-4">
                        <v-img :src="User.profile.image">
                            <template v-slot:placeholder>
                                <v-skeleton-loader class="Avatar" ref="skeleton" type="avatar"></v-skeleton-loader>
                            </template>
                        </v-img>
                    </v-avatar>

                    <div>
                        <v-card-title class="py-0 my-1 pl-0 font-weight-light" style="font-size: 21px;">
                            <nuxt-link class="white--text" :to="`/user/${User.profile.name}`">{{User.profile.name}}</nuxt-link>
                        </v-card-title>

                        <v-card-subtitle class="pb-0 pl-0 font-weight-light pt-3">
                            <v-chip-group column>
                                <v-chip small class="mr-1">MOD</v-chip>
                            </v-chip-group>
                        </v-card-subtitle>
                    </div>

                    <v-spacer/>
                    <v-btn fab depressed x-small color="button" @click="DeleteMod(User.profile.name)"><v-icon>close</v-icon></v-btn>
                </v-card>

                <v-card-actions class="px-6 py-4" v-if="ChildSelectMOD.mod.length < 3">
                    <v-text-field 
                        v-model="ModUser" dense
                        hide-details append-icon="person"
                        label="Nhập tên người ủy quyền" type="text" solo flat
                        color="primary" background-color="input"
                        :loading="Loading" :disabled="Loading" @keyup.enter="SetMod"
                    ></v-text-field>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--Dialog Create Child-->
        <v-dialog v-model="DialogChild" max-width="300" overlay-opacity="0.9">
            <v-card flat v-if="CategorySelectEdit" color="card">
                <v-card-title>{{CategorySelectEdit.title}}</v-card-title>
                <v-card-subtitle class="pt-1">Thêm khu vực con</v-card-subtitle>

                <v-card-text>
                    <v-text-field 
                        v-model="NewChild"
                        hide-details
                        label="Tên khu vực con" type="text" solo flat
                        color="primary" background-color="input"
                        :loading="Loading" :disabled="Loading" @keyup.enter="CreateChild(CategorySelectEdit._id)"
                    ></v-text-field>
                    <v-checkbox v-model="SetVIP" label="Đây là khu vực VIP" hide-details />
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    scrollToTop: true,
    async asyncData({error, $axios}) {
        try {
            let Data = await $axios.$get('/forum/admin/categorys');
            let TitleModel = {};
            let Childs = [];

            Data.categorys.forEach(item => {
                TitleModel[item._id] = item.title;

                item.childs.forEach(i => {
                    TitleModel[i._id] = i.title;
                    Childs.push(i);
                })
            });

            return { Categorys : Data.categorys , Childs: Childs, TitleModel : TitleModel}
        } catch(e) {
            error({ statusCode: 404, message: e.toString() })
        }
    },
    data() {
        return {
            //Dialog
            DialogChild: false,
            DialogSetSMod: false,
            DialogSetMod: false,
            //New
            NewCategory: '',
            NewChild: '',
            SetVIP: false,
            SmodUser: '',
            ModUser: '',
            //Loading
            Loading: false,
            //Select
            CategorySelectEdit: null,
            CategorySelectSMOD: null,
            ChildSelectMOD: null
        }
    },
    methods: {
        //Category
        async CreateCategory(){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Create = await this.$axios.$post('/forum/admin/category/create', {
                    title: this.NewCategory
                });

                if(Create.err) throw Create.status;

                this.TitleModel[Create.category._id] = Create.category.title;
                this.Categorys.push({childs: [], ...Create.category});

                this.$notify(`Tạo thành công khu vực <b>${this.NewCategory}</b>`);
                this.Loading = false;
                this.NewCategory = '';
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
        async DeleteCategory(category){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Delete = await this.$axios.$post('/forum/admin/category/delete', {
                    category: category
                });

                if(Delete.err) throw Delete.status;
                
                let index = this.Categorys.findIndex(function(o) { return o._id == category; });
                this.$delete(this.Categorys, index);

                this.$notify(`Xóa thành công khu vực`);
                this.Loading = false;
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
        async EditCategory(category){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Edit = await this.$axios.$post('/forum/admin/category/edit', {
                    title: this.TitleModel[category],
                    category: category
                });

                if(Edit.err) throw Edit.status;

                this.$notify(`Sửa tên thành công khu vực`);
                this.Loading = false;
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
        async SetSmod(){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Set = await this.$axios.$post('/forum/admin/category/smod/set', {
                    user: this.SmodUser,
                    category: this.CategorySelectSMOD._id
                });

                if(Set.err) throw Set.status;

                let Index = this.Categorys.indexOf(this.CategorySelectSMOD);
                this.Categorys[Index].smod = Set.user;
                this.CategorySelectSMOD.smod = Set.user;

                this.$notify(`Thêm quản trị viên thành công`);
                this.Loading = false;
                this.SmodUser = null;
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
        async DeleteSmod(user){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Delete = await this.$axios.$post('/forum/admin/category/smod/delete', {
                    user: user,
                    category: this.CategorySelectSMOD._id
                });

                if(Delete.err) throw Delete.status;

                let Index = this.Categorys.indexOf(this.CategorySelectSMOD);
                this.Categorys[Index].smod = undefined;
                this.CategorySelectSMOD.smod = undefined;

                this.$notify(`Xóa quản trị viên thành công`);
                this.Loading = false;
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
        //Child
        async CreateChild(category){
            try {
              if(this.Loading) return false;
                this.Loading = true;

                let Create = await this.$axios.$post('/forum/admin/child/create', {
                    title: this.NewChild,
                    category: category,
                    vip: this.SetVIP
                });

                if(Create.err) throw Create.status;
                
                let index = this.Categorys.findIndex(function(o) { return o._id == category; });
                this.Categorys[index].childs.push(Create.child);
                this.TitleModel[Create.child._id] = Create.child.title;

                this.$notify(`Tạo thành công khu vực <b>${this.NewChild}</b>`);
                
                this.Loading = false;  
                this.Category = null;
                this.NewChild = '';
                this.SetVIP = false;
                this.DialogChild = false;
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
        async DeleteChild(child, category){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Delete = await this.$axios.$post('/forum/admin/child/delete', {
                    child: child,
                    category: category
                });
                if(Delete.err) throw Delete.status;

                let index = this.Categorys.findIndex(function(o) { return o._id == category; });
                let index_child = this.Categorys[index].childs.findIndex(function(o) { return o._id == child; });
                this.$delete(this.Categorys[index].childs, index_child)

                this.$notify(`Xóa thành công khu vực`);
                this.Loading = false;
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
        async EditChild(child){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Edit = await this.$axios.$post('/forum/admin/child/edit', {
                    title: this.TitleModel[child],
                    child: child
                });

                if(Edit.err) throw Edit.status;

                this.$notify(`Sửa tên thành công khu vực`);
                this.Loading = false;
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
        async SetMod(){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Set = await this.$axios.$post('/forum/admin/child/mod/set', {
                    user: this.ModUser,
                    child: this.ChildSelectMOD._id
                });

                if(Set.err) throw Set.status;

                for (let i = 0; i < this.Categorys.length; i++) {
                    for (let o = 0; o < this.Categorys[i].childs.length; o++) {
                        if(this.Categorys[i].childs[o]._id.toString() === this.ChildSelectMOD._id.toString()){
                            this.Categorys[i].childs[o].mod.push(Set.user)
                        }
                    }    
                }

                this.$notify(`Thêm quản trị viên thành công`);
                this.ModUser = null;
                this.Loading = false;
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
        async DeleteMod(user){
            try {
                if(this.Loading) return false;
                this.Loading = true;

                let Delete = await this.$axios.$post('/forum/admin/child/mod/delete', {
                    user: user,
                    child: this.ChildSelectMOD._id
                });

                if(Delete.err) throw Delete.status;

                for (let i = 0; i < this.Categorys.length; i++) {
                    for (let o = 0; o < this.Categorys[i].childs.length; o++) {
                        if(this.Categorys[i].childs[o]._id.toString() === this.ChildSelectMOD._id.toString()){
                            let Index = this.Categorys[i].childs[o].mod.indexOf(i => i.profile.name == user);
                            this.Categorys[i].childs[o].mod.splice(Index, 1);
                        }
                    }    
                }

                this.$notify(`Xóa quản trị viên thành công`);
                this.Loading = false;
            }
            catch(e){
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
    }
}
</script>