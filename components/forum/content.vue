<template>
    <div class="Content">
        <div class="EditorContent px-4 py-1" ref="Content" v-html="content"></div>
        
        <ImageReview v-model="OpenReview" :images="Images" :select="ImageSelect" :key="ImageSelect"></ImageReview>
    </div>
</template>

<script>
import ImageReview from '~/components/box/imagereview';

export default {
    components: {ImageReview},
    model: {
        prop: 'content'
    },
    props: {
        content: String
    },
    data(){
        return {
            OpenReview: false,
            ImageSelect: 0,
            Images: [],
        }
    },
    mounted(){
        this.ImageLoad();
    },
    methods: {
        ImageLoad(){
            //<img[^>]*>
            //<img.*?src="(.*?)"[^\>]+>
            let VM = this;
            let IMGS = this.$refs.Content.getElementsByTagName("IMG");
            if(IMGS.length == 0) return false;

            for (let i = 0; i < IMGS.length; i++) {
                let Img_El = IMGS[i];

                this.Images.push(Img_El.dataset.src)

                Img_El.classList.add('lazyload');

                Img_El.addEventListener('click', function(event){
                    event.preventDefault();
                    VM.OpenImage(i)
                });

                Img_El.addEventListener('load', () => {
                    Img_El.classList.add('loader')
                });

                Img_El.addEventListener('error', () => {
                    Img_El.remove();
                });
                
                this.$LazyLoadImage(Img_El);
            }
        },
        OpenImage(i){
            this.ImageSelect = i;
            this.OpenReview = true;
        },
        GetMeta(url){   
            let img = new Image();
            img.addEventListener("load", function(){
                alert( this.naturalWidth +' '+ this.naturalHeight );
            });
            img.src = url;
        }
    }
}
</script>

<style scoped >
    .EditorContent {
        font-size: 17px;
    }

    .EditorContent /deep/ .lazyload {
        object-fit: cover;
        opacity: 0.1;
        will-change: opacity;
        transition: all 0.7s;
    }

    .EditorContent /deep/ .lazyload.loader {
        opacity: 1;
        background: transparent;
    }

    .EditorContent /deep/ .ql-size-small {
        font-size: 0.75em;
    }

    .EditorContent /deep/ .ql-size-large {
        font-size: 1.5em;
    }

    .EditorContent /deep/ p {
        margin: 0;
    }

    .EditorContent /deep/ img {
        max-width: 100%;
        cursor: pointer;
    }

    .EditorContent /deep/ blockquote {
        border-left: 4px solid #ccc;
        margin-bottom: 5px;
        margin-top: 5px;
        background: #2d2d2d;
        padding: 7px 15px;
    }

    .EditorContent /deep/ .ql-syntax {
        background-color: #0e0e0e;
        color: #f8f8f2;
        overflow: visible;
        white-space: pre-wrap;
        padding: 15px 20px;
        margin: 15px auto;
        font-size: 15px;
        border-radius: 10px;
    }

    .EditorContent /deep/ .ql-align-center {
        text-align: center;
    }

    .EditorContent /deep/ .ql-align-justify {
        text-align: justify;
    }

    .EditorContent /deep/ .ql-align-right {
        text-align: right;
    }
</style>