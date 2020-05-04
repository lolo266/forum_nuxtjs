<template>
    <v-menu offset-y nudge-bottom="6" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
            <v-btn rounded depressed color="button" v-on="on" class="mr-4">Tài Khoản</v-btn>
        </template>

        <v-card width="326" tile flat>
            <v-card-title>
                {{isSignup ? 'Đăng Ký' : 'Đăng Nhập'}}
            </v-card-title>

            <v-card-text class="pt-2">
                <v-alert v-if="Status" dense color="cardmini" class="mb-6 error--text subtitle-2">{{Status}}</v-alert>

                <v-form ref="form" v-model="Validate">
                    <v-text-field 
                        v-model="Username" 
                        label="Tài Khoản" name="login" type="text" 
                        append-icon="person" color="primary" flat solo background-color="input" 
                        :counter="15"
                        :rules="[Rules.required, Rules.counterUser, Rules.stringUser, Rules.stringSpace]"
                    />
                    
                    <v-text-field 
                        v-model="Password" 
                        label="Mật Khẩu" name="password" type="password" 
                        append-icon="lock" color="primary" flat solo background-color="input" 
                        :rules="[Rules.required, Rules.counterPass, Rules.stringSpace]"
                        @keyup.enter="isSignup ? Signup() : Signin()"
                    />
                    
                    <v-text-field 
                        v-if="isSignup" v-model="Email" 
                        label="Email" name="email" type="email" 
                        append-icon="email" color="primary" flat solo background-color="input" 
                        :rules="[Rules.required, Rules.email]"
                        @keyup.enter="Signup()"
                    />    
                </v-form>

                <div class="d-flex align-center mb-2">
                    <a class="d-block subtitle-2 pr-2" @click="Change()">
                        {{isSignup ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}}
                    </a>
                    <v-spacer/>
                    <v-btn v-if="!isSignup" color="primary" depressed  @click="Signin()" :loading="Loading" :disabled="Loading">Đăng Nhập</v-btn>
                    <v-btn v-else color="primary" depressed  @click="Signup()" :loading="Loading" :disabled="Loading">Đăng Ký</v-btn>
                </div>
                
            </v-card-text>
        </v-card>
    </v-menu>
</template>

<script>
export default {
    data() {
        return {
            Menu: false,
            Status: '',
            Loading: false,
            isSignup: false,
            Username: '',
            Password: '',
            Email: '',
            Validate: true,
            Rules: {
                required: value => !!value || 'Không được để trống',
                stringUser: value => !(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|`|-|{|}|\||\\/.test(value)) || 'Ký tự đặc biệt được cho phép "_"',
                counterUser: value => (value && value.length <= 15) || 'Vượt quá độ dài ký tự cho phép',
                counterPass: value => (value && value.length >= 6 ) || 'Độ dài tối thiểu 6 ký tự',
                email: value => /.+@.+\..+/.test(value) || 'Định dạng Email không đúng',
                stringSpace: value => !(/\s/.test(value)) || 'Phát hiện khoảng cách liên tiếp',
            },
        }
    },
    methods: {
        async Signin(){
            this.Status = '';
            if(!this.Validate) return this.$refs.form.validate();

            try {
                this.Loading = true;

                let Signin = await this.$axios.$post('/auth/signin', {
                    username: this.Username,
                    password: this.Password
                });
                if(Signin.err) throw Signin.status;
                
                let d = new Date();
                d.setTime(d.getTime() + (30*24*60*60*1000));
                document.cookie = `token=${Signin.token}; expires=${d.toUTCString()}; path=/`;

                this.$store.commit('auth/Login', Signin.user);
            }
            catch(e){
                this.Loading = false;
                this.Status = e.toString()
            }
        },
        async Signup(){
            this.Status = '';
            if(!this.Validate) return this.$refs.form.validate();

            try {
                this.Loading = true;
            
                let Signup = await this.$axios.$post('/auth/signup', {
                    username: this.Username,
                    password: this.Password,
                    email: this.Email
                });
                if(Signup.err) throw Signup.status;
                
                let d = new Date();
                d.setTime(d.getTime() + (30*24*60*60*1000));
                document.cookie = `token=${Signup.token}; expires=${d.toUTCString()}; path=/`;

                this.$store.commit('auth/Login', Signup.user);
            }
            catch(e){
                this.Loading = false;
                this.Status = e.toString();
            }
        },
        Change(){
            if(this.Loading) return false;

            this.Status = '';
            this.isSignup = !this.isSignup;
        }
    }
}
</script>
