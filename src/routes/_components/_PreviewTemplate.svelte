<script>
	export let progress = 0;

</script>

<style>

</style>


<div id="template" class="dz-preview dz-file-preview">
  <div class="dz-details">
    <div class="dz-filename"><span data-dz-name></span></div>
    <div class="dz-size" data-dz-size></div>
    <img data-dz-thumbnail alt="thumbnail"/>
  </div>
  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress>{progress}</span></div>
  <div class="dz-success-mark"><span>✔</span></div>
  <div class="dz-error-mark"><span>✘</span></div>
  <div class="dz-error-message"><span data-dz-errormessage></span></div>
</div>