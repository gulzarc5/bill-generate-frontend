<template>
  <span class="print-btn"><q-btn @click="printSelectedArea" align="between" class="btn-fixed-width" color="accent"
      label="Print" icon="print" /></span>
  <div ref="printArea">
    <div class="bill_head">
      <div class="row">
        <div class="col-12 q-pa-sm" style="border-bottom: 1px solid gray; font-size:30px">
          <b>29AIHPN5447M1ZK
            <br>
            KHAN ENTERPRISES
          </b>
        </div>
        <div class="col-12 q-pa-sm" style="border-bottom: 1px solid gray">
          <b>1.e-Invoice Details</b>
        </div>
        <div class="col-4 q-pa-sm" style="border-bottom: 1px solid gray">
          <p><b>IRN: </b>
            {{ billData.irn_no }}
          </p>
        </div>
        <div class="col-4 q-pa-sm" style="border-bottom: 1px solid gray">
          <p><b>Ack No: </b>
            {{ billData.ack_no }}
          </p>
        </div>
        <div class="col-4 q-pa-sm" style="border-bottom: 1px solid gray">
          <p><b>Ack Date: </b>
            {{ billData.created_at }}
          </p>
        </div>
        <div class="col-12 q-pa-sm" style="border-bottom: 1px solid gray">
          <b>2. Transaction Details</b>
        </div>
        <div class="col-4 q-pa-sm">
          <p><b>Supply Type Code: </b>
            {{ billData.supply_type }}
          </p>
        </div>
        <div class="col-4 q-pa-sm">
          <p><b>Document No: </b>
            {{ billData.doc_no }}
          </p>
        </div>
        <div class="col-4 q-pa-sm">
          <p><b>ISGT application despite Supplier and Recipient located in same State: </b>
            {{ billData.is_same }}
          </p>
        </div>
        <div class="col-12 q-pa-sm">
          <p><b>Place of Supply: </b>
            <template v-if="billData.is_same == 'No'">
              {{ billData.recipient_name }}, {{ billData.recipient_mobile }}
            </template>
            <template v-else>
              {{ client.address }}, {{ client.city }}, {{ client.state }}-{{ client.pin }},
            </template>
          </p>
        </div>
        <div class="col-6 q-pa-sm" style="border-bottom: 1px solid gray">
          <p><b>Document Type: </b>
            {{ billData.doc_no }}
          </p>
        </div>
        <div class="col-6 q-pa-sm" style="border-bottom: 1px solid gray">
          <p><b>Document Date: </b>
            {{ billData.created_at }}
          </p>
        </div>
      </div>

      <div class="term">
        <div class="row">
          <div class="col-12 q-pa-sm" style="border-bottom: 1px solid gray">
            <b>3. Party Details</b>
          </div>
          <div class="col-6">
            <div>
              <table class="bill_table" style="height: 230px">
                <tr class="terms">
                  <td class="align-top-left"><b>Supplier: </b><br>
                    GSTIN : 29AIHPN5447M1ZK<br>
                    KHAN ENTERPRISES <br>
                    Indira Nagar Behind Balaganur Shet Mill Bappur Rd,<br>
                    Sindhanur 584128<br>
                    Ph: +919060950999 <br>
                    Email: hello.khanenterprises@gmail.com

                  </td>
                </tr>
                <tr class="termss">
                  <td class="align-top-left"><b>Ship To: </b> <br>
                    GSTIN : {{ client.gst_number }} <br>
                    {{ client.address }},<br> {{ client.city }}, {{ client.state }}-{{ client.pin }},<br>
                    Ph: +91{{ client.mobile }} <br>
                    Email: {{ client.email }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="col-6 q-pa-md">
            <div>
              <p><b>Recipient: </b>
                <template v-if="billData.is_same == 'No'">
                  {{ billData.recipient_name }}, {{ billData.recipient_mobile }}
                </template>
                <template v-else> <br>
                  GSTIN : {{ client.gst_number }} <br>
                  {{ client.address }},<br> {{ client.city }}, {{ client.state }}-{{ client.pin }},<br>
                  Ph: +91{{ client.mobile }} <br>
                  Email: {{ client.email }}
                </template>

              </p>
            </div>
          </div>
        </div>
      </div>

      <div style="border-top: 1px solid gray">
        <div class="row">
          <div class="col-12 q-pa-sm" style="border-bottom: 1px solid gray">
            <b>4. Details of Goods / Services</b>
          </div>
        </div>

        <div class="row " style="font-size: 10px;word-break: break-all;">
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>SL No</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray;">
            <p><b>Item <br> Description</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>HSN Code</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Quantity</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Unit</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Unit Price(Rs)</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Discount(Rs)</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Taxable <br> Amount(Rs)</b></p>
          </div>
          <div class="col-2 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Tax Rate <br> (GST+Cess | State Cess+Cess Non.Avdvol)</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Other <br> Charges (Rs)</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Total</b></p>
          </div>
        </div>



        <div class="row" v-for="(item, index) in products" :key="index" style="font-size: 10px;word-break: break-all;">
          <div class="col-1 q-pa-sm"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ item.serial_number }}.
            </p>
          </div>
          <div class="col-1 q-pa-sm"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ item.product_name }} ({{ item.height }} x {{ item.width }}) - {{ item.glass_mm }} MM
            </p>
          </div>
          <div class="col-1 q-pa-sm"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ item.hsn_code }}
            </p>
          </div>
          <div class="col-1 q-pa-sm"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ item.quantity }}
            </p>
          </div>
          <div class="col-1 q-pa-sm"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              SQF ({{ item.total_sq_feet }})
            </p>
          </div>
          <div class="col-1 q-pa-sm"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ item.per_sqfeet_amount }}
            </p>
          </div>
          <div class="col-1 q-pa-sm"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              0.00
            </p>
          </div>
          <div class="col-1 q-pa-sm"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ formattedNumber(item.total_sq_feet) *
                formattedNumber(item.per_sqfeet_amount) }}
            </p>
          </div>
          <div class="col-2 q-pa-sm"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ ((billData.sgst + billData.cgst + billData.client_igst) > 0)
                ? formattedNumber(((formattedNumber(item.total_sq_feet) *
                  formattedNumber(item.per_sqfeet_amount)) * 18) / 100) :
                "0.00" }}
            </p>
          </div>
          <div class="col-1 q-pa-sm"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              0.00
            </p>
          </div>
          <div class="col-1 q-pa-sm"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ (formattedNumber(item.total_sq_feet) * formattedNumber(item.per_sqfeet_amount)) +
                (formattedNumber(((formattedNumber(item.total_sq_feet) *
                  formattedNumber(item.per_sqfeet_amount)) * 18) / 100)) }}
            </p>
          </div>
        </div>


      </div>

      <div style="border-top: 1px solid gray; margin-top: 10px">
        <div class="row" style="font-size: 10px;word-break: break-all;">
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Tax'ble Amt</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>CGST Amt</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>SGST Amt</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>IGST Amt</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>CESS Amt</b></p>
          </div>
          <div class="col-2 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>State CESS Amt</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Discount</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Other <br> Charges</b></p>
          </div>
          <div class="col-1 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Round off <br> Amt</b></p>
          </div>
          <div class="col-2 q-pa-sm" style="border-right: 1px solid gray">
            <p><b>Total Inv. Amt</b></p>
          </div>


          <div class="col-1 q-pa-sm text-center"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ formattedNumber(taxableAmt) }}
            </p>
          </div>
          <div class="col-1 q-pa-sm text-center"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ formattedNumber(billData.cgst) }}
            </p>
          </div>
          <div class="col-1 q-pa-sm text-center"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ formattedNumber(billData.sgst) }}
            </p>
          </div>
          <div class="col-1 q-pa-sm text-center"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ formattedNumber(billData.client_igst) }}
            </p>
          </div>
          <div class="col-1 q-pa-sm text-center"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              0.00
            </p>
          </div>
          <div class="col-2 q-pa-sm text-center"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              0.00
            </p>
          </div>
          <div class="col-1 q-pa-sm text-center"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ formattedNumber(billData.discount) }}
            </p>
          </div>
          <div class="col-1 q-pa-sm text-center"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ formattedNumber(billData.transport_charge) }}
            </p>
          </div>
          <div class="col-1 q-pa-sm text-center"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ formattedNumber(billData.round_off_amount) }}
            </p>
          </div>
          <div class="col-2 q-pa-sm text-center"
            style="border-right: 1px solid gray; border-top: 1px solid gray; border-bottom: 1px solid gray">
            <p>
              {{ formattedNumber(billData.total_amount) + formattedNumber(billData.round_off_amount) }}
            </p>
          </div>
        </div>
      </div>

      <div style="border-top: 1px solid gray; margin-top: 10px">
        <div class="row">
          <div class="col-12 q-pa-sm" style="border-bottom: 1px solid gray">
            <b>5. E-Waybill Details</b>
          </div>
          <div class="col-4 q-pa-sm" style="border-bottom: 1px solid gray">
            <p><b>Eway Bill No: </b>
              {{ billData.e_way_bill_no }}
            </p>
          </div>
          <div class="col-4 q-pa-sm" style="border-bottom: 1px solid gray">
            <p><b>Eway Bill Date: </b>
              {{ billData.e_way_bill_date }}
            </p>
          </div>
          <div class="col-4 q-pa-sm" style="border-bottom: 1px solid gray">
            <p><b>Valid Till Date: </b>
              {{ billData.e_way_bill_valid_date }}
            </p>
          </div>

          <div class="col-12 q-pa-sm">
            <p><b>Generated By: </b>
              KHAN ENTERPRISES
            </p>
          </div>
          <div class="col-12 q-pa-sm">
            <p><b>Print Date: </b>
              {{ currentDateAndTime }}
            </p>
          </div>
          <div class="col-12 q-pa-sm">
            <p style="text-align: right">Digitally Signed <br>on: {{ currentDateAndTime }}

            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useStore } from 'vuex';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router';

const route = useRoute(); // Access the current route
const $q = useQuasar();
const store = useStore();
const token = store.getters['auth/getToken'];
const billId = ref(null);
const billData = ref(false);
const products = ref(false);
const client = ref(false);
const currentDateAndTime = ref(null);
const taxableAmt = ref(null);
const printArea = ref(null);


async function fetchDetails(billId) {
  $q.loading.show({
    message: "Some important process  is in progress. Hang on...",
  });
  const data = {
    bill_id: billId,
  };

  await api
    .post('/api/admin/bill/fetch', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      if (data.status == true) {
        billData.value = data.data;
        products.value = billData.value.details;
        client.value = billData.value.client_details;
        taxableAmt.value = billData.value.transport_charge;
        for (const detail of data.data.details) {
          taxableAmt.value += formattedNumber(detail.total_sq_feet) *
            formattedNumber(detail.per_sqfeet_amount);
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
  billId.value = route.params.billId;
  fetchDetails(route.params.billId);
  const now = new Date();
  const formattedDateAndTime = now.toLocaleString(); // Adjust the format as needed
  currentDateAndTime.value = formattedDateAndTime;
});


const leftDrawerOpen = inject('leftDrawerOpen');
const headerVisible = inject('headerVisible');
const printSelectedArea = async () => {

  leftDrawerOpen.value = false;
  headerVisible.value = false;
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
  window.print();

  setTimeout(() => {
    leftDrawerOpen.value = true;
    headerVisible.value = true;
  }, 100);

};


const formattedNumber = (value) => {
  if (value != null && value != 'undefined') {

    return Number(
      value.toString().match(/^\d+(?:\.\d{0,2})?/)
    )
  } else {
    return Number(0)
  }
}

</script>

<style>
.bill_head {
  border: 1px solid gray;
  margin: 35px;
}

.tax {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #808080c4;
  padding: 10px;
}

.tax p {
  margin-bottom: 0px;
}

.khan {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid gray;
}

.bill_table {
  width: 100%;
}

/* td {
  border-bottom: 1px solid gray;
  border-left: 1px solid gray;
  padding: 10px;
} */
.no td {
  border-bottom: none;
}

.khan h6 {
  margin: 0px;
}

.khan p {
  margin-bottom: 0px;
}

.term {
  /* display: flex; */
  justify-content: space-between;
}

.terms td {
  border-bottom: 1px solid gray;
  border-left: none;
  padding: 10px;
}

.termss td {
  border-bottom: none;
  border-left: none;
  padding: 10px;
}

.rate td,
th {
  border-bottom: none;
  border-left: none;
  padding: 10px;
}

table,
td,
th {
  border: 1px solid #ddd;
  text-align: left;
}

.bill_table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  padding: 15px;
}

.consignee {
  height: 300px;
}

.align-top-left {
  vertical-align: top;
  /* Aligns the content to the top of the cell */
  text-align: left;
  /* Aligns the text to the left within the cell */
}

.text-bottom-right {
  position: relative;
  /* Establishes a positioning context */
  text-align: right;
  /* Aligns text to the right within the div */

  /* Aligns text to the bottom right using absolute positioning */
  position: relative;
}

.text-bottom-right p {
  position: absolute;
  bottom: 0;
  /* Aligns text to the bottom */
  right: 0;
  /* Aligns text to the right */
  padding-right: 35px;
}

.eoe {
  text-align: right;
}

.p_text {
  margin: 0px 0px 0px !important;
}

.tax_data {
  height: 80px !important;
}

.print-btn {
  text-align: center;
  display: block;
  margin-top: 6px;
}

.q-header-print {
  display: block !important;
  visibility: visible;
  /* Show the header by default */
}

@media print {

  .print-btn {
    display: none;
    margin-top: 0px;
  }

  .q-header-print {
    display: none !important;
    visibility: hidden;
    /* Show the header by default */
  }
}
</style>
