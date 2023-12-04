<template>
  <div id="pdf-content"></div>
  <!-- 1st page -->
  <div class="section">
    <HeaderComponent :headerData="headerData" />
    <div class="q-pa-sm">
      <p>To</p>
      <p class="sign">Dear Customer,</p>
      <div>
        <p>We are delighted that you are considering our range of Windows and Doors for your premises. </p>
      </div>
      <p>
        It has gained rapid acceptance across all cities of India for the overwhelming advantages of better protection
        from noise, heat, rain, dust and pollution.
      </p>
      <p>
        In drawing this proposal, it has been our endeavor to suggest designs which would enhance your comfort and
        aesthetics from inside and improve the facade of the building.
      </p>
      <p>
        It has a well-established service network to deliver seamless service at your doorstep. Our offer comprises of the
        following in enclosure for your kind perusal:
      </p>
      <ol class="alphabet-list">
        <li>Window design, specification and value</li>
        <li>Terms and Conditions</li>
      </ol>
      <p>
        We now look forward to be of service to you.
      </p><br><br>
      <p>For, Khan Enterprises</p>
      <p class="sign">Authorised Signatory</p>
      <FooterComponent :totalPage="totalItemPage" currentPage="1" />
    </div>
  </div>

  <div v-for="(item, key) in items" :key="key">
    <div class="section" v-if="(key % 2 == 0)">
      <HeaderComponent v-if="(key % 2 == 0)" :headerData="headerData" />
      <QuotationProduct :item="item" />
      <div v-if="items[key + 1]" class="product-subsection">
        <QuotationProduct :item="items[key + 1]" />
      </div>
      <div v-if="((key + 1 == items.length) && (!itemSummary))" class="product-subsection">
        <QuotationSummary :summaryData="itemSummaryData" />
      </div>
      <FooterComponent v-if="(key % 2 == 0)" :totalPage="totalItemPage" :currentPage="(getIterationCount(key))" />
    </div>
  </div>

  <div class="section" v-if="(itemSummary)">
    <HeaderComponent :headerData="headerData" />

    <QuotationSummary :summaryData="itemSummaryData" />

    <FooterComponent :totalPage="totalItemPage" :currentPage="(totalItemPage - 1)" />

  </div>

  <div class="section">
    <HeaderComponent :headerData="headerData" />
    <div>
      <h6><b>Terms and Conditions</b></h6>
      <ol>
        <li> Payments terms: -<br>
          &emsp13;&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;a. 75% Advance along with order, if it is less
          than Rs. 100000/-.<br>
          &emsp13;&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;b. 50% advance along with order, 50% Before
          delivery, if it is more than Rs.
          100000/-</li>
        <li> Validation of quote 30 days, Total execution of project should be completed latest by 3-months.</li>
        <li> P.O & Payments should made in the name of Khan Enterprises.</li>
        <li> The prices are based on the sizes provided by the customer. The prices are valid for variation in sizes up to
          +/- 30mm per window provided the design and style of product remains unchanged. The customer will be charged on
          pro-rate basis for difference between the actual sizes and given sizes, if any, beyond the above variation.</li>
        <li> After handovering the windows, cleaning not our scope.</li>
        <li> If any other commitments given by our sales team, before placing order please call us . Cell :
          +919060950999</li>
        <li> After handovering windows, If any service require related to windows & doors , that should be chargeable in
          local. Per visit - Rs. 350/-</li>
        <li> Material unloading & storage should be your scope.</li>
        <li> All disputes shall be subject Sindhanur jurisdiction only.</li>
        <li> Transportation should be your scope.</li>
      </ol>
      <h6><b>Pre-Requisites for installation of Windows:-</b></h6>
      <p>
      <ol>
        <li>Walls should be plastered from inside and outside, with inside POP complete.</li>
        <li>All jams, sills and soffits should be plastered.</li>
        <li>Flooring (where doors have to be installed) should be complete.</li>
        <li>Aperture should be smooth</li>
        <li>Base and top of window should be water leveled and sides should be in vertical plump.</li>
        <li>Sill width should be more than the window with.</li>
        <li>Opening should be accessible from inside for installation.</li>
        <li>Grills: Adequate care should be taken if grills have to be installed
          <br>&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;a. For Horizontal slider Window: Grill
          should be provided on the outer face of slider before the installation of the window.
          <br>&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;&emsp13;b. For Casement windows: Screw type grill is
          recommended after installation of casement window.
        </li>
        <li>Installation should happen before the last coat of paint. At least one coat of paint should be done before
          installation begins.</li>
        <li>Scaffoldings/ bracing should not interrupt the window openings where openings where windows are supposed to be
          installed.</li>

      </ol>
      </p>

      <p style="padding-top: 30px">
        I hereby accept the estimate as per above mentioned price and specifications. I have read and understood the terms
        & conditions and agree to them.
      </p>
      <div class="customer">
        <p class="sign">Authorised Signatory</p>
        <p class="sign">Signature of Customer</p>
      </div>
      <FooterComponent :totalPage="totalItemPage" :currentPage="(totalItemPage)" />
    </div>
    <q-btn @click="generatePDF" v-if="pdfGenerated" color="primary" icon="download" label="Download PDF"
      style="left: 42%;" />
    <!-- <button @click="generatePDF" v-if="pdfGenerated">Generate PDF</button> -->
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar'
import HeaderComponent from './../../components/Quotation/HeaderComponent.vue';
import FooterComponent from './../../components/Quotation/FooterComponent.vue';
import QuotationProduct from './../../components/Quotation/QuotationProduct.vue';
import QuotationSummary from './../../components/Quotation/QuotationSummary.vue';


import jsPDF from 'jspdf';
import { useRoute } from 'vue-router';

const route = useRoute(); // Access the current route
const getIterationCount = (key) => Math.floor(key / 2) + 2;
const pdfGenerated = ref(true);

import html2canvas from 'html2canvas'; // Import html2canvas
const generatePDF = async () => {
  $q.loading.show({
    message: 'Pdf Generation  is in progress. Hang on...'
  })
  pdfGenerated.value = false;
  const doc = new jsPDF();
  const sections = document.querySelectorAll('.section');

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    // Check if the section contains an image from a third-party URL
    const thirdPartyImage = section.querySelector('img[src^="http://127.0.0.1:8000/backend_images"]');

    if (thirdPartyImage) {
      const img = new Image();

      // Set the source of the image to the third-party URL
      img.src = thirdPartyImage.src;

      // Wait for the image to load
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Add the image to the PDF document
      if (i > 0) {
        doc.addPage();
      }

      doc.addImage(img, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
    } else {
      // If there's no third-party image, capture the section as before
      const canvas = await html2canvas(section, {
        useCORS: true,
        scale: 4,
      });

      if (i > 0) {
        doc.addPage();
      }

      doc.addImage(
        canvas.toDataURL('image/jpeg'),
        'JPEG',
        0,
        0,
        doc.internal.pageSize.getWidth(),
        doc.internal.pageSize.getHeight()
      );
    }

    // Check if this is the last image, then save the PDF
    if (i === sections.length - 1) {
      setTimeout(() => {
        doc.save('quotation.pdf');
        pdfGenerated.value = true;
        $q.loading.hide()
      }, 2000);
    }
  }
};

const quotationId = ref(null);
const quotationData = ref(null);
const items = ref(null);
const headerData = ref({});
const $q = useQuasar();
const store = useStore();
const token = store.getters['auth/getToken'];
const totalItemPage = ref(0);
const itemSummary = ref(true);
const itemSummaryData = ref(false); // display on another page else display on last item page



async function fetchDetails(quotationId) {
  $q.loading.show({
    message: "Some important process  is in progress. Hang on...",
  });
  const data = {
    quotation_id: quotationId,
  };
  await api
    .post('/api/admin/quotations/fetch', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {

      if (data.status == true) {
        quotationData.value = data.data;
        const headerDataBackend = {
          client_name: data.data.client,
          created_at: data.data.created_at,
          quotationId: data.data.id,
        };
        headerData.value = headerDataBackend;
        items.value = quotationData.value.details;
        itemSummaryData.value = data.data;
        console.log(data.data);
        if (quotationData.value.details && quotationData.value.details.length > 0) {
          console.log("totalItems", quotationData.value.details.length);
          totalItemPage.value = Math.ceil(parseInt(quotationData.value.details.length) / 2) + 3;
          if (quotationData.value.details.length % 2 != 0) {
            itemSummary.value = false;
            totalItemPage.value = Math.ceil(parseInt(quotationData.value.details.length) / 2) + 2;
          }
          console.log("totalItems Page", Math.ceil(parseInt(quotationData.value.details.length) / 2));
        }
        $q.loading.hide();
      } else {
        $q.notify({
          message: 'Error',
          color: 'red',
          position: 'center'
        })
        $q.loading.hide();
      }
    })
    .catch((error) => {
      console.log(error);
      $q.loading.hide()
    })
    .finally(() => {
      $q.loading.hide()
    });
}
onMounted(() => {
  quotationId.value = route.params.quotationId;
  fetchDetails(route.params.quotationId);
});


</script>


<style >
.q_pa_md {
  padding: 45px 90px 0px;
}

.para p {
  margin-bottom: 5px;
}

.section {
  padding: 20px 30px;
  box-shadow: 2px 2px 10px #80808087;
  margin: 20px 30px;
}

.border {
  border: 2px solid #f0c68d;
}

h6 {
  margin: 10px 0px 10px;
}

.pro {
  padding-top: 8px;
  display: flex;
  justify-content: end;
  gap: 20px;
}

.sign {
  padding-top: 80px;
}

.pic {
  width: 30%;
}

.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 400px;
}

.code {
  padding: 3px 10px;
  display: flex;
  gap: 300px;
  background-color: #dcddde;
  margin-bottom: 5px;
}

.code p {
  margin-bottom: 0px;
}

.code1 {
  padding: 3px 10px;
  display: flex;
  gap: 300px;
  margin-bottom: 5px;
}

.code1 p {
  margin-bottom: 0px;
}

.value {
  padding: 1px 10px;
  background-color: #dcddde;
  margin-bottom: 5px;
}

.value p {
  margin-bottom: 0px;
}

.value1 {
  padding: 1px 10px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

.value1 p {
  margin-bottom: 0px;
}

.value2 {
  padding: 1px 10px;
  margin-bottom: 5px;
  display: flex;
  background-color: #dcddde;
  justify-content: space-between;
}

.value2 p {
  margin-bottom: 0px;
}

.value3 {
  display: flex;
  gap: 250px;
  padding: 1px 10px;
  background-color: #dcddde;
}

.value3 p {
  margin-bottom: 0px;
}

.value4 {
  padding: 1px 10px;
  display: flex;
  justify-content: space-between;
}

.value4 p {
  margin-bottom: 0px;
  font-size: 12px;
  overflow-wrap: break-word;
}

.customer {
  display: flex;
  justify-content: space-between;
}

.headerImage {
  width: 81% !important;
}

.alphabet-list {
  list-style: none;
  counter-reset: list-counter;
  padding-left: 32px;
}

.alphabet-list li:before {
  content: counter(list-counter, lower-alpha) ". ";
  counter-increment: list-counter;
}

pre {
  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
}

.arrow {
  position: absolute;
  top: 6px;
  width: 32px !important;
  height: 65px;
  left: 0px;
}

.arrow1 {
  position: absolute;
  top: 150px;
  width: 32px !important;
  height: 59px;
  transform: rotate(180deg);
  left: 0px;
}

.arrow2 {
  position: absolute;
  top: 238px;
  width: 32px !important;
  height: 60px;
  left: 35px;
  transform: rotate(270deg);
}

.arrow3 {
  position: absolute;
  top: 238px;
  width: 32px !important;
  height: 60px;
  left: 245px;
  transform: rotate(90deg);
}

.absolute-full,
.fullscreen,
.fixed-full {
  top: 0;
  right: 0;
  bottom: 0;
  left: 16px;
  padding: 13px;
}

.writeup {
  writing-mode: vertical-lr;
  text-orientation: upright;
  position: absolute;
  top: 78px;
  left: 5px;
}

.high {
  position: absolute;
  top: 259px;
  left: 120px;
  letter-spacing: 3px;
}

.custom-padding {
  padding-bottom: 20%;
}
</style>
