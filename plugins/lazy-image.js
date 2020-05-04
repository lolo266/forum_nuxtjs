import Vue from 'vue'

Vue.prototype.$LazyLoadImage = (img) => {
    function LoadImage(){
        //img.addEventListener('error', () => console.log('error'));
        img.src = img.dataset.src;
    };

    function HandleIntersect(entries, observer){
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                LoadImage();
                observer.unobserve(img);
            }
        });
    };

    function CreateObserver(){
        const Option = {
            root: null,
            threshold: "0"
        }

        const observer = new IntersectionObserver(HandleIntersect, Option);
        observer.observe(img)
    };

    if (!window["IntersectionObserver"]) {
        LoadImage()
    } else {
        CreateObserver()
    }
};