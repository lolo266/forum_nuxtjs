<template>
    <v-dialog v-model="dialog" fullscreen persistent attach class="EditorDialog">
        <v-sheet max-height="100%" height="100%" class="Sheet" style="position: relative;">
            <input type="file" @change="UploadImageFile" id="file" hidden>
            <quill-editor ref="quillEdit" :content="ContentEdit" @change="Change" class="Editor"></quill-editor>

            <v-sheet style="position: absolute; bottom: 0; left: 0" 
            class="d-flex align-center justify-end py-4 Radius-0"
            height="50" width="100%">
                <v-btn depressed color="primary" class="mr-1" @click="Save()">Lưu</v-btn>
                <v-btn depressed color="input" class="mr-1" @click="Reset()" v-if="reset">Reset</v-btn>
                <v-btn depressed color="input" @click="$emit('change', false)">Đóng</v-btn>          
                <slot name="footer"></slot>
            </v-sheet>
        </v-sheet>

        <v-dialog v-model="Loading" persistent width="300">
            <v-card color="input" dark class="pa-3 py-4">
                <span>Đang tải ảnh lên</span>
                <v-progress-linear class="mt-3" indeterminate color="white"></v-progress-linear>
            </v-card>
        </v-dialog>
    </v-dialog>
</template>

<script>
import 'quill/dist/quill.snow.css'; 

export default {
    model: {
        prop: 'dialog',
        event: 'change'
    },
    props: {
        dialog: Boolean,
        content: String,
        reset: Boolean,
    },
    data() {
        return {
            Show: this.dialog,
            ContentEdit: this.content.replace(/<img[^>](alt="image" data-src)="/gm, '<img src="'),
            File: null,
            Loading: false,
        }
    },
    methods: {
        Change({ quill, html, text }) {
            this.ContentEdit = html
        },
        Save(){
            this.$emit('save', this.ContentEdit.replace(/<img[^>](src)="/gm, '<img alt="image" data-src="'));
            this.$emit('change', false);
        },
        Reset(){
            this.ContentEdit = this.content.replace(/<img[^>](alt="image" data-src)="/gm, '<img src="');
        },
        async UploadImageFile(e){
            if(this.Loading) return false;
            this.Loading = true;

            let Quill = this.$refs.quillEdit.quill;
            ///^image\//.test(file.type)
            this.File = e.target.files[0];

            let formData = new FormData();
            formData.append('image', this.File);

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
                
                this.File = null;
                
                //Inset To Editor
                Quill.focus();
                let range = Quill.getSelection();
                
                Quill.insertEmbed(range.index, 'image', `${Result.link}`);
                this.Loading = false;
            }
            catch(e){
                this.File = null;
                this.Loading = false;
                this.$notify(e.toString());
            }
        },
    }
}
</script>

<style lang="scss">
    .EditorDialog {
        .v-dialog{
            background: #1E1E1E;
        }
    }

    .Sheet {
        width: 800px !important;
        max-width: 800px !important;
        margin: 0 auto;

        @media only screen and (max-width: 800px) {
            width: 100% !important;
            max-width: 100% !important;
            //padding-top: 0 !important;
            //padding-bottom: 0 !important;
        }
    }

    .quill-editor {
        height: calc(100% - 70px - 50px);

        .ql-editor {
            font-size: 17px;
            padding: 0 10px;

            a {
                text-decoration: none;
            }

            &::-webkit-scrollbar{
                height:6px;
                width:6px;
                background: transparent;
                transition: all 0.3s ease;
            }
            &::-webkit-scrollbar-thumb:hover{
                background: #c6c7ca;
                cursor: pointer;
            }
            &::-webkit-scrollbar-thumb{
                background:#505050;
                border-radius: 5px;
            }

            .ql-syntax {
                background-color: #0e0e0e !important;
                color: #f8f8f2;
                overflow: visible;
                white-space: pre-wrap;
                padding: 15px 20px;
                margin: 15px auto;
                font-size: 15px;
                border-radius: 10px;
            }
            img {
                width: auto;
                max-width: 100%;
            }
            &.ql-blank::before {
                color: #848484 !important;
                padding: 0 10px !important;
            }

            blockquote {
                background: #2d2d2d;
                padding: 7px 15px;
            }
        }

        .ql-toolbar, .ql-container {
            border-width: 0 !important;
            font-family: "Quicksand", sans-serif !important;
            padding: 7px 16px !important;
            border-bottom: 1px solid #3f3f3f !important;
        }
        .ql-toolbar {
            height: 70px !important;
            background: #1E1E1E !important;
            border-width: 0 !important;
            .ql-picker {
                color: #fff !important;
            }
            button {
                outline: none !important;
            }
        }
        .ql-container {
            background: #222222 !important;
            border-width: 0 !important;
            padding: 16px !important;
        }
        .ql-stroke {
            stroke: #fff !important;
        }
        .ql-tooltip {
            border-radius: 8px;
            background: #1E1E1E !important;
            border-width: 0 !important;
            color: #fff !important;
            box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12) !important;

            input[type=text] {
                background: #292929 !important;
                border-width: 0 !important;
                border-radius: 15px;
                padding: 5px 10px !important ;
                outline: none !important;
            }
        }
        .ql-picker {
            .ql-picker-label {
                outline: none !important;
            }
            .ql-picker-options {
                background: #292929 !important;
                border-width: 0 !important;
                border-radius: 8px;
                margin-top: 3px;
                color: #fff !important;
                box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
            }
            .ql-picker-item {
                outline: none !important;
            }
        }
        .ql-active {
            .ql-stroke {
                stroke: rgb(17, 128, 219) !important;
            }
        }
    }
</style>