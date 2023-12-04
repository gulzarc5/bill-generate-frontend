<template>
  <div class="q-pa-md items-start q-gutter-md">
    <q-card flat bordered class="my-card-body">
      <q-card-section>
        <div class="text-h6 text-center">Prepare Quotation</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="q-pa-md example-row-column-width">
          <div class="row">
            <div class="col-12">
              <div class="row">
                <div class="col-6 q-pa-md">
                  <label class="label-class" for="buyerNumber">Number of the Client</label>
                  <q-input type="number" v-model="buyerNumber" @blur="fetchBuyer" label="Client Number" />
                </div>
                <div class="col-6 q-pa-md" v-if="isShow">
                  <q-input v-model="buyerID" class="hidden-input" hide-bottom-space label="Buyer ID" required />
                  <p class="product_p"><b class="product_label">Name: </b> {{ buyerName }}</p><br>
                  <p class="product_p"><b class="product_label">Mobile: </b> {{ buyerNumber }}</p><br>
                  <p class="product_p"><b class="product_label">State: </b> {{ buyerState }}</p><br>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator inset />

      <q-table :rows="formRows" :columns="formColumns" row-key="id" hide-pagination flat>
        <template v-slot:body-cell="props">
          <q-td>
            <template v-if="props.col.field === 'product'">
              <q-select v-model="props.row.product" dense outlined :options="products" :option-value="'id'"
                :option-label="'name'" :label="props.col.label" :style="{ minWidth: '200px' }"
                @update:model-value="onProductSelect(props.row, props.col.field)" />
            </template>
            <template v-else-if="props.col.field === 'glass_mm'">
              <q-input v-model="props.row.glass_mm" dense outlined :placeholder="props.col.label" :disable="true" />
            </template>
            <template v-else-if="props.col.field === 'height'">
              <span style="display:flex;padding-top: 10px;">
                <q-input v-model="props.row.height" dense outlined placeholder="Height" :disable="true" />
                <p style="padding:8px">X</p>
                <q-input v-model="props.row.width" dense outlined placeholder="Width" :disable="true" />
              </span>
            </template>
            <template v-else-if="props.col.field === 'amount'">
              <q-input v-model="props.row[props.col.field]" dense outlined :placeholder="props.col.label"
                :disable="true" />
            </template>
            <template v-else-if="props.col.field === 'quantity'">
              <q-input v-model="props.row[props.col.field]" dense outlined :placeholder="props.col.label"
                @update:model-value="onProductSelect(props.row, props.col.field)" />
            </template>
            <template v-else-if="props.col.field === 'totalAmount'">
              <q-input v-model="props.row[props.col.field]" dense outlined :placeholder="props.col.label"
                :disable="true" />
            </template>
            <template v-else-if="(props.col.field === 'remove' && formRows.length > 1)">
              <q-btn @click="removeRow(props.row)" icon="remove" color="negative" size="sm" />
            </template>

          </q-td>
        </template>
        <template v-slot:body-bottom>
          <q-tr>
            <q-td col-span="4">
              <q-btn @click="addRow" label="Add Row" color="primary" class="q-ml-md" />
            </q-td>
          </q-tr>
        </template>
      </q-table>


      <q-card-section>
        <div class="text-h6 text-center">Summary Show</div>
      </q-card-section>
      <q-card-section class="q-pa-md" id="product_div">
        <div class="q-pa-md example-row-column-width">
          <div class="row">
            <div class="col-6"></div>
            <div class="col-6">
              <div class="row summary">
                <div class="col-12">
                  <p><b>Total Sq. Feet: </b> {{ calculateTotalSqFeet() }}</p>
                </div>
                <div class="col-12">
                  <p><b>Average value per Sq.Feet: </b>{{ calculateAvgSqfeetAmount() }}</p>
                </div>
                <div class="col-12">
                  <p><b>CGST @ 9%: </b>{{ calculateCgst() }}</p>
                </div>
                <div class="col-12">
                  <p><b>SGST @ 9%: </b>{{ calculateSgst() }}</p>
                </div>
                <div class="col-12">
                  <p><b>Quotation Total: </b>{{ calculateTotalAmount() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <div class="q-pa-md q-gutter-sm text-center">
        <q-btn color="primary" @click="submitQuotaion" type="button" label="Generate Quotation" />
      </div>
    </q-card>

  </div>

  <q-dialog v-model="showModal">
    <q-card flat bordered class="my-card-popup">
      <q-card-section style="text-align:center">
        <div class="text-h6">Add New Buyer</div>
      </q-card-section>

      <form @submit.prevent="addBuyer">
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-xs  my-row">
            <q-input class="col-6 q-pa-xs" label="Name" v-model="formData.buyerName" filled id="name" type="name"
              :error-message="formData.apiValidationErrors?.name?.[0]"
              :error="formData.apiValidationErrors?.name?.length > 0" />

            <q-input class="col-6 q-pa-xs" label="Email" v-model="formData.email" filled id="email" type="email"
              :error-message="formData.apiValidationErrors?.email?.[0]"
              :error="formData.apiValidationErrors?.email?.length > 0" />
          </div>
          <div class="row q-col-gutter-xs my-row">
            <q-input class="col-6 q-pa-xs" label="Mobile" v-model="formData.mobile" maxlength="10" filled type="tel"
              id="mobile" lazy-rules :rules="[val => val && val.length > 0 || 'Please Enter Mobile']"
              :error-message="formData.apiValidationErrors?.mobile?.[0]"
              :error="formData.apiValidationErrors?.mobile?.length > 0" />

            <q-input class="col-6 q-pa-xs" label="State" v-model="formData.state" filled id="state" type="text"
              :error-message="formData.apiValidationErrors?.state?.[0]"
              :error="formData.apiValidationErrors?.state?.length > 0" />
          </div>
          <div class="row q-col-gutter-xs my-row">
            <q-input class="col-6 q-pa-xs" v-model="formData.city" label="City" filled id="city" type="text"
              :error-message="formData.apiValidationErrors?.city?.[0]"
              :error="formData.apiValidationErrors?.city?.length > 0" />

            <q-input class="col-6 q-pa-xs" label="Pin" v-model="formData.pin" filled id="pin" type="text"
              :error-message="formData.apiValidationErrors?.pin?.[0]"
              :error="formData.apiValidationErrors?.pin?.length > 0" />
          </div>
          <div class="row q-col-gutter-xs my-row">
            <q-input class="col-6 q-pa-xs" label="GST Number" v-model="formData.gst" filled id="gst" type="text"
              :error-message="formData.apiValidationErrors?.gst?.[0]"
              :error="formData.apiValidationErrors?.gst?.length > 0" />
          </div>
          <div class="row q-col-gutter-xs my-row">
            <q-input class="col-12 q-pa-xs" label="Address" v-model="formData.address" filled id="address" type="text"
              :error-message="formData.apiValidationErrors?.address?.[0]"
              :error="formData.apiValidationErrors?.address?.length > 0" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="green" type="submit" label="Submit" />
          <q-btn color="red" @click="showModal = false" label="Cancel" />
        </q-card-actions>
      </form>
      <q-separator inset />
    </q-card>
  </q-dialog>

  <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
    <q-card class="bg-teal text-white" style="width: 300px">
      <q-card-section>
        <div class="text-h6">Quotation</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Quotation Created Successfully
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup />
        <q-btn :to="`/quotation/${quotationId}`" flat label="Show Quotation" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useStore(); // Get the store instance
const $q = useQuasar();
const token = store.getters["auth/getToken"];
const products = ref([]);
const persistent = ref(false);
const quotationId = ref(null);


const isShow = ref(false);
const showButton = ref(true);

const buyerNumber = ref(null);
const buyerID = ref(null);
const buyerName = ref(null);
const buyerEmail = ref(null);
const buyerState = ref(null);
const buyerCity = ref(null);
const buyerPin = ref(null);
const buyerAddress = ref(null);

const showModal = ref(false);
const name = ref(null);
const email = ref(null);
const tel = ref(null);
const state_name = ref(null);
const city = ref(null);
const pin = ref(null);
const address = ref(null);
const gst = ref(null);

const formColumns = ref([
  {
    name: 'product',
    label: 'Select Product',
    field: 'product',
  },
  {
    name: 'glass_mm',
    label: 'MM',
    field: 'glass_mm',
  },
  {
    name: 'height',
    label: 'Height & Width',
    field: 'height',
  },
  {
    name: 'amount',
    label: 'Amount',
    field: 'amount',
  },
  {
    name: 'quantity',
    label: 'Quantity',
    field: 'quantity',
  },
  {
    name: 'totalAmount',
    label: 'Total Amount',
    field: 'totalAmount',
  },
  {
    name: 'remove',
    label: 'Action',
    field: 'remove',
  },
]);


const formRows = ref([
  {
    id: 1,
    product: '',
    selectedProduct: '',
    quantity: '',
    height: '',
    width: '',
    glass_mm: '',
    amount: '',
    totalSqFeet: '',
    totalAmount: '',
    quantity: '',
  },
]);

const summaryData = ref({
  total_sq_feet: 0,
  average_value: 0,
  cgst: 0,
  sgst: 0,
  total: 0,
});

const addRow = () => {
  const lastRow = formRows.value[formRows.value.length - 1];
  if (lastRow && lastRow.product !== '' && lastRow.quantity !== '') {
    const newRow = {
      id: formRows.value.length + 1,
      product: '',
      selectedProduct: '',
      quantity: '',
      height: '',
      width: '',
      glass_mm: '',
      amount: '',
      totalSqFeet: '',
      totalAmount: '',
    };
    formRows.value.push(newRow);
  } else {
    // You can show an error message or handle the case where "product" and "quantity" are missing.
    console.log('Product and Quantity are required for the last row.');
  }
};

const removeRow = (row) => {
  const rowIndex = formRows.value.indexOf(row);
  if (rowIndex !== -1) {
    formRows.value.splice(rowIndex, 1);
  }
}

const onProductSelect = async (row, field) => {
  console.log(row);
  if (field == 'product') {
    const selectedProduct = row[field];
    if (selectedProduct) {
      row.glass_mm = selectedProduct.glass_mm
      row.height = selectedProduct.height
      row.width = selectedProduct.width
      row.amount = formattedNumber(selectedProduct.total_price).toFixed(2);
      if (row.quantity) {
        row.totalAmount = await formattedNumber(row.amount) * row.quantity;
        row.selectedProduct = await selectedProduct.id;
        //  row.totalSqFeet = await selectedProduct.area_sqfeet;
        row.totalSqFeet = await ((row.product.height * row.product.width) / 89999) * row.quantity;
        addRow();
      }
    } else {
      resetRow(row);
    }
  } else if (field == 'quantity') {
    if (row.quantity) {
      row.totalAmount = row.amount * row.quantity;
      row.selectedProduct = await row.product.id;
      // row.totalSqFeet = await row.product.area_sqfeet*row.quantity;
      row.totalSqFeet = await ((row.product.height * row.product.width) / 89999) * row.quantity;
      addRow();
    }
  } else {
    resetRow(row);
  }
};

const calculateTotalSqFeet = () => {
  const totalSqFeet = formRows.value.reduce((total, row) => total + row.totalSqFeet, 0);
  return formattedNumber(totalSqFeet).toFixed(2); // Round to two decimal places and convert to a formattedNumber
};
const calculateAvgSqfeetAmount = () => {
  const totalSqFeet = formRows.value.reduce((total, row) => total + row.totalSqFeet, 0);
  const totalAmount = formRows.value.reduce((total, row) => total + row.totalAmount, 0);
  if ((totalAmount > 0) && (totalSqFeet > 0)) {
    console.log("complete", totalAmount, totalSqFeet)
    return (formattedNumber(totalAmount) / formattedNumber(totalSqFeet)).toFixed(2); // Round to two decimal places and convert to a formattedNumber
  } else {
    return formattedNumber(0).toFixed(2); // Round to two decimal places and convert to a formattedNumber
  }
};

// Compute the total amount
const calculateTotalAmount = () => {
  const totalAmount = formRows.value.reduce((total, row) => total + row.totalAmount, 0);
  const totalAmountCalculated = formattedNumber(totalAmount) + ((formattedNumber(totalAmount) * 9) / 100) + ((formattedNumber(totalAmount) * 9) / 100);
  return formattedNumber(totalAmountCalculated).toFixed(2); // Round to two decimal places and convert to a formattedNumber
};
// Compute the total amount
const calculateCgst = () => {
  const totalAmount = formRows.value.reduce((total, row) => total + row.totalAmount, 0);
  return formattedNumber((totalAmount * 9) / 100).toFixed(2); // Round to two decimal places and convert to a formattedNumber
};
// Compute the total amount
const calculateSgst = () => {
  const totalAmount = formRows.value.reduce((total, row) => total + row.totalAmount, 0);
  return formattedNumber((totalAmount * 9) / 100).toFixed(2); // Round to two decimal places and convert to a number
};

const formattedNumber = (value) => {
  return Number(
    value.toString().match(/^\d+(?:\.\d{0,2})?/)
  )
}

const resetRow = (row) => {
  row.glass_mm = '';
  row.height = ''
  row.width = ''
  row.product = '',
    row.amount = '',
    row.totalAmount = '',
    row.product = '',
    row.selectedProduct = "",
    row.totalSqFeet = ''
};

const formData = ref({
  id: '',
  buyerName: '',
  email: '',
  mobile: '',
  state: '',
  city: '',
  pin: '',
  address: '',
  apiValidationErrors: null,
});

function resetForm() {
  formData.value = {
    id: '',
    buyerName: '',
    email: '',
    mobile: '',
    state: '',
    city: '',
    pin: '',
    address: '',
    apiValidationErrors: null,
  }
}


async function fetchBuyer() {
  const data = {
    mobile: buyerNumber.value,
  };
  $q.loading.show({
    message: "Some important process  is in progress. Hang on...",
  });

  await api
    .post("/api/admin/buyers/fetch", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) => {
      $q.loading.hide();
      if (data.status == true) {
        isShow.value = true;
        showButton.value = false;
        buyerID.value = data.data.id;
        buyerName.value = data.data.name;
        buyerEmail.value = data.data.email;
        buyerState.value = data.data.state;
        buyerCity.value = data.data.city;
        buyerPin.value = data.data.pin;
        buyerAddress.value = data.data.address;
        // brandName.value = null
      } else {
        isShow.value = false;
        $q.dialog({
          title: 'Buyer Not Found',
          message: 'Add New Buyer'
        }).onOk(() => {
          showModal.value = true;
          formData.value.mobile = buyerNumber;
        }).onCancel(() => {
          // console.log('Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
      }
    })
    .catch((error) => {
      if (error.response.status == 422) {
        $q.dialog({
          title: "Error",
          message: error.response.data.message,
        });
      } else {
        console.log("Error:", error.response.status);
      }
      // console.error('Error:', error );
      // Handle the error
    })
    .finally(() => {
      $q.loading.hide();
    });
};



async function addBuyer() {
  $q.loading.show({
    message: "Some important process  is in progress. Hang on...",
  });
  const data = {
    name: formData.value.buyerName,
    email: formData.value.email,
    mobile: formData.value.mobile,
    state: formData.value.state,
    city: formData.value.city,
    pin: formData.value.pin,
    address: formData.value.address,
    gst: formData.value.gst,
  };

  await api
    .post("/api/admin/buyers/add", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) => {
      $q.loading.hide();
      if (data.status == true) {
        showModal.value = false;
        $q.notify({
          message: "Data Updated Successfully",
          color: "green",
          position: "center",
        });

        showModal.value = false;
        isShow.value = true;
        buyerID.value = data.data.id;
        buyerName.value = data.data.name;
        buyerEmail.value = data.data.email;
        buyerNumber.value = data.data.mobile;
        buyerState.value = data.data.state;
        buyerCity.value = data.data.city;
        buyerPin.value = data.data.pin;
        buyerAddress.value = data.data.address;
      } else {
        $q.notify({
          message: "Validation Errors",
          color: "red",
          position: "center",
        });
      }
      // this.$refs.myForm.reset();
    })
    .catch((error) => {
      $q.loading.hide();
      if (error.response && error.response.status === 422) {
        formData.value.apiValidationErrors = error.response.data.errors;
      } else {
        console.log('Error:', error.response.status);
      }
    })
    .finally(() => {
      $q.loading.hide();
    });
}

const closeModal = () => {
  showModal.value = false;
  name.value = ref(null);
  email.value = ref(null);
  tel.value = ref(null);
  state_name.value = ref(null);
  city.value = ref(null);
  pin.value = ref(null);
  address.value = ref(null);
};

// product_div
const submitQuotaion = async () => {
  $q.loading.show({
    message: "Some important process  is in progress. Hang on...",
  });
  const quotationData = {
    mobile: buyerNumber.value,
    products: formRows.value,
  }
  console.log(quotationData);
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await api.post("/api/admin/quotations/create", quotationData, { headers });
    console.log(response);
    if (response.data.status) {
      // <a href="/quotation/${response.data.quotation_id}" class="q-btn q-btn-primary">Click to show Quotation</a>
      $q.loading.hide();
      persistent.value = true;
      quotationId.value = response.data.quotation_id;

      quotationReset();
    } else {
      $q.loading.hide();
      $q.dialog({
        title: 'Error',
        message: response.data.message
      })
    }
  } catch (error) {
    $q.loading.hide();
    if (error.response && error.response.status === 422) {
      $q.dialog({
        title: 'Error',
        message: error.response.data.message
      })

    } else {
      console.log('Error:', error.response.status);
    }
    console.error("Error fetching gallery items:", error);
  }

};

const quotationReset = () => {
  formRows.value = [{
    id: 1,
    product: '',
    selectedProduct: '',
    quantity: '',
    height: '',
    width: '',
    glass_mm: '',
    amount: '',
    totalSqFeet: '',
    totalAmount: '',
    quantity: '',
  }];

  buyerName.value = '';
  buyerNumber.value = '';
  buyerCity.value = '';

}

onMounted(async () => {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  });
  await fetchProducts();
  $q.loading.hide();
});

const fetchProducts = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await api.get("/api/admin/product/list", { headers });
    products.value = response.data.data;
  } catch (error) {
    console.error("Error fetching gallery items:", error);
  }
};

const handleButtonClickQuotationView = (quotationId) => {
  console.log(quotationId);
  router.push({ name: 'quotation-details', params: { quotationId } });
}
</script>

<style scoped>
.para {
  padding-top: 38px;
}

.row-padding {
  padding-bottom: 20px;
}

.my-card {
  width: 100% !important;
}

.buyer {
  margin-top: 30px;
  padding-left: 50px;
}

.X {
  padding-top: 39px;
  padding-left: 20px;
}

.summary {
  border: 1px solid rgb(218, 218, 218);
  padding: 20px;
}

.hidden-input {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
}

.my-card-popup {
  width: 60% !important;
  max-width: 60% !important;
  background-color: white !important;
  box-shadow: 2px 2px 6px #8080806b !important;
  border: 1px solid #1976d240 !important;
}

.my-row {
  margin-bottom: 20px;
  /* You can adjust the value to control the spacing */
}

.my-card-body {
  width: 99% !important;
}

.product_p {
  margin: 0 0 -9px !important;
  font-size: 12px;
}

.product_label {
  color: #1976d2;
}
</style>
