<template>
	<div>
		<div class="code">
			<p>Code : {{ item.id }}</p>
			<p>Size : W X {{ item.height }} H X {{ item.width }}</p>
		</div>
		<div class="code1">
			<p>Name : {{ item.product_name }}</p>
			<p>Profile System :{{ item.product_name }}</p>
		</div>
		<div class="code">
			<p>Location : {{ item.location }}</p>
			<p>Glass : {{ item.glass_mm }} MM CLEAR GLASS</p>
		</div>
	</div>
	<div class="example-row-stacked-to-horizontal">
		<div class="row" style="position: relative;">
			<div class="col-md-5">
				<q-img :src="item.image"></q-img>
				<p class="writeup">{{ item.height }}</p>
				<img src="../../../public/images/3.png" class="arrow" />
				<img src="../../../public/images/3.png" class="arrow1" />
				<p class="high">{{ item.width }}</p>
				<img src="../../../public/images/3.png" class="arrow2" />
				<img src="../../../public/images/3.png" class="arrow3" />
			</div>
			<div class="col-12 col-md-7">
				<div class="value">
					<p><b>Computed Values</b></p>
				</div>
				<div class="value1">
					<p>Sq.ft per Window</p>
					<p>{{ item.total_sq_feet }} Sq.ft</p>
				</div>
				<div class="value2">
					<p>Value per Sq.ft.</p>
					<p>{{ item.per_sqfeet_amount }} Rs.</p>
				</div>
				<div class="value1">
					<p>Unit Price</p>
					<p>{{ (item.per_sqfeet_amount * item.total_sq_feet).toFixed(2) }} Rs.</p>
				</div>
				<div class="value2">
					<p>Quantity</p>
					<p>{{ item.quantity }} pcs</p>
				</div>
				<div class="value1">
					<p>Value</p>
					<p>{{ ((item.per_sqfeet_amount * item.total_sq_feet) * item.quantity).toFixed(2) }} Rs.</p>
				</div>
				<div class="row">
					<div class="col-6">
						<div class="value3">
							<p><b>Profiles</b></p>
						</div>
					</div>
					<div class="col-6">
						<div class="value3">
							<p><b>Accessories</b></p>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-6">
						<div class="value4">
							<p style="word-break: break-all;">{{ item.description }}</p>
						</div>
					</div>
					<div class="col-6">
						<div class="value4">
							<p style="word-break: break-all;">{{ item.Accesories }}</p>
						</div>
					</div>
				</div>
				<!-- <div class="">
				<p>{{item.description}}</p>
			</div>
			<div class="value4">
				<p>{{item.Accesories}}</p>
			</div> -->

			</div>
		</div>
	</div>
	<p style="padding: 50px 0px 0px 150px">View From Inside</p>
</template>

<script setup>
import { ref } from 'vue';
defineProps({
  item: {
    type: Object
  },
});

</script>

<style scoped>
.q-img {
	width: 79% !important;
}
</style>
