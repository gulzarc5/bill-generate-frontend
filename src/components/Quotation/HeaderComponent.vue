<template>
  <div class="header">
    <div class="q-pa-md q_pa_md example-row-stacked-to-horizontal">
      <div class="row">
        <div class="col-md-5" style="text-align: center;">
          <q-img class="headerImage" src="/images/icon.png"></q-img>
        </div>
        <div class="col-md-1"></div>
        <div class="col-12 col-md-6">
          <div>
            <!-- <p>Khan Enterprize</p>
              <p>India</p>
              <p>Ph: +91 9876543210</p>
              <p>Email:example@gmail.com</p>
              <p>Area Manager Name :</p>
              <p>Contact No. :</p> -->
            <pre>Khan Enterprises
Indira Nagar Behind Balaganur Shet Mill Bappur Rd,
Sindhanur 584128,Balaganur Sheet Mill
Ph: +919060950999
Email: hello.khanenterprises@gmail.com
Area Manager Name: Noor  Khan
Contact No. : +91 9060950999
            </pre>
          </div>
        </div>
      </div>
      <h6><b>Client Name : {{ headerData.client_name }}</b></h6>
    </div>
    <div class="border"></div>
    <div class="pro">
      <p><b>Project :</b> {{ headerData.quotationId }}</p>
      <p><b>Date: </b> {{ headerData.created_at }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
defineProps({
  headerData: {
    type: Object
  },
});

const title = ref(null);
const description = ref(null);
</script>
