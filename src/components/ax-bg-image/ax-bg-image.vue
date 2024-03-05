<template>
	<image class="ax-bg-image" src="../../static/user-bg-image.png" mode=""></image>
</template>

<script>
	export default {
		name:"ax-bg-image",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped> 
.ax-bg-image{
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: auto;
	z-index: 1;
}
</style>