<script>

    import { get } from "svelte/store";
    import { createEventDispatcher } from "svelte";
    import { images } from "../../stores/imageStore";
    import Uploader from "./_Uploader.svelte";
    import { Header } from "@sveltejs/site-kit";
    import { videos } from "../../stores/videoStore";
    import { crud } from "../../stores/crudStore";
    import { currentVideo } from "../../stores/currentVideoStore";

    let dispatch = createEventDispatcher();
    let component;
    let className = "";
    let options = {
        acceptedFiles: ["image/*"],
        paramName: "Image",
        parallelUploads: 1,
        path: "images"
    };

    export { className as class };

    function onAddedfile(image) {
        
    }

    function onSuccessmultiple(e) {
        let uploads = e.detail.data;
        let video = get(currentVideo);

        images.add(uploads);
        if(video = get(currentVideo)) {
            let image_id = uploads.slice(-1)[0].id; // take the last element for poster
            // only required for cakes customized finder methods
            // eg "findWithImages" which return assoziated models
            // video.image = null;
            video.image_id = image_id;
            crud.dispatch({
                method: 'put',
                data: video
            });
        }
    }
</script>

<style>

</style>

<div class="uploader-wrapper {className}" bind:this={component}>
    <Header h="5" mdc>Image Uploader</Header>
    <Uploader
        on:Uploader:successmultiple={onSuccessmultiple}
        on:Uploader:addedfile={onAddedfile}
        {...options} />
</div>
