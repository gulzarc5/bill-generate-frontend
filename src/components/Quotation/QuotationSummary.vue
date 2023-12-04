<template>
  <div class="example-row-stacked-to-horizontal">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="value">
          <p><b>Computed Values</b></p>
        </div>
        <div class="value1">
          <p>Total Sq.ft</p>
          <p v-if="summaryData.total_sq_feet !== null && summaryData.total_sq_feet !== undefined">
            {{ summaryData.total_sq_feet }} Sq.ft</p>
        </div>
        <div class="value2">
          <p>Average Value per Sq.ft</p>
          <p v-if="summaryData.total_sq_feet !== null && summaryData.total_sq_feet !== undefined">
            {{ parseFloat(summaryData.amount / summaryData.total_sq_feet).toFixed(2) }} Rs.</p>
        </div>
        <div class="value1">
          <p>Value</p>
          <p v-if="summaryData.amount !== null && summaryData.amount !== undefined">{{ summaryData.amount }} Rs.</p>
        </div>
        <div class="value2">
          <p>CGST @ 9%</p>
          <p v-if="summaryData.cgst !== null && summaryData.cgst !== undefined">{{ summaryData.cgst }} Rs.</p>
        </div>
        <div class="value2">
          <p>SGST @ 9%</p>
          <p v-if="summaryData.sgst !== null && summaryData.sgst !== undefined">{{ summaryData.sgst }} Rs.</p>
        </div>
        <div class="value1">
          <p>Quote Total</p>
          <p v-if="summaryData.total_amount !== null && summaryData.total_amount !== undefined">
            {{ parseFloat(summaryData.total_amount).toFixed(2) }} Rs.</p>
        </div>
        <p style="padding-top: 30px">
          Note: The above given rates are with glasses.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
defineProps({
  summaryData: {
    type: Object
  },
});

</script>
