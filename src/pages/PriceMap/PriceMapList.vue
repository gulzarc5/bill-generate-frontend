<template>
  <div class="q-pa-md">
    <q-btn color="primary" @click="openAddModel" label="Add New Price Map" />
  </div>
  <div class="q-pa-md">
    <q-table flat bordered title="Treats" :rows="state.rows" :columns="columns" row-key="id"
      :pagination="initialPagination" :loading="state.loading" :filter="filter"
      no-data-label="I didn't find anything for you" no-results-label="The filter didn't uncover any results">
      <template v-slot:top>
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="serial_number" :props="props">{{ props.row.serial_number }}</q-td>
          <q-td key="material" :props="props">{{ props.row.material }}</q-td>
          <q-td key="glass_mm" :props="props">{{ props.row.glass_mm }}</q-td>
          <q-td key="price" :props="props">{{ props.row.price }}</q-td>
          <q-td key="bill_price" :props="props">{{ props.row.bill_price }}</q-td>
          <q-td key="status" :props="props">{{ props.row.status == 1 ? 'Enabled' : 'Disabled' }}</q-td>
          <q-td key="action" :props="props">
            <div class="q-gutter-sm">
              <q-btn color="blue" label="Edit" @click="openModal(props.row)" size=sm no-caps></q-btn>
              <q-btn v-if="props.row.status == 1" color="red" label="Disable" @click="updateStatus(props.row.id)" size=sm
                no-caps></q-btn>
              <q-btn v-else color="green" label="Enable" @click="updateStatus(props.row.id)" size=sm no-caps></q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span>
            Well this is sad... {{ message }}
          </span>
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
        </div>
      </template>

    </q-table>
  </div>

  <q-dialog v-model="showModal" persistent>
    <q-card flat bordered :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }">
      <q-card-section style="text-align:center">
        <div class="text-h6">Edit Price Map</div>
      </q-card-section>
      <form @submit.prevent="updateData">
        <q-card-section>
          <label for="material_id">Material:</label>
          <q-select v-model="formData.material_id" :options="materials" :option-value="'id'" :option-label="'name'"
            label="Select Material" name="material_id" emit-value map-options
            :error-message="formData.apiValidationErrors?.material_id?.[0]"
            :error="formData.apiValidationErrors?.material_id?.length > 0"></q-select>

          <label for="glass_mm_id">Glass MM:</label>
          <q-select v-model="formData.glass_mm_id" :options="glass_mms" :option-value="'id'" :option-label="'name'"
            label="Select Glass MM" name="glass_mm_id" emit-value map-options
            :error-message="formData.apiValidationErrors?.glass_mm_id?.[0]"
            :error="formData.apiValidationErrors?.glass_mm_id?.length > 0"></q-select>

          <label for="perSqFtAmount">Per Sq. Feet Amount (Quotation)</label>
          <q-input v-model.number="formData.amount" step="0.01" id="amount" type="number" filled
            :error-message="formData.apiValidationErrors?.price?.[0]"
            :error="formData.apiValidationErrors?.price?.length > 0" />

          <label for="perSqFtAmount">Per Sq. Feet Amount (Billing)</label>
          <q-input v-model.number="formData.bill_price" step="0.01" id="amount" type="number" filled
            :error-message="formData.apiValidationErrors?.bill_price?.[0]"
            :error="formData.apiValidationErrors?.bill_price?.length > 0" />

        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="green" type="submit" label="Submit" />
          <q-btn color="red" @click="showModal = false" label="Cancel" />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showModalAdd" persistent>
    <q-card flat bordered :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }">
      <q-card-section style="text-align:center">
        <div class="text-h6">Add New Price Map</div>
      </q-card-section>
      <form @submit.prevent="addData">
        <q-card-section>
          <label for="material_id">Material:</label>
          <q-select v-model="formData.material_id" :options="materials" :option-value="'id'" :option-label="'name'"
            label="Select Material" name="material_id" emit-value map-options
            :error-message="formData.apiValidationErrors?.material_id?.[0]"
            :error="formData.apiValidationErrors?.material_id?.length > 0"></q-select>

          <label for="glass_mm_id">Glass MM:</label>
          <q-select v-model="formData.glass_mm_id" :options="glass_mms" :option-value="'id'" :option-label="'name'"
            label="Select Glass MM" name="glass_mm_id" emit-value map-options
            :error-message="formData.apiValidationErrors?.glass_mm_id?.[0]"
            :error="formData.apiValidationErrors?.glass_mm_id?.length > 0"></q-select>

          <label for="perSqFtAmount">Per Sq. Feet Amount (Quotation)</label>
          <q-input v-model.number="formData.amount" step="0.01" id="amount" type="number" filled
            :error-message="formData.apiValidationErrors?.price?.[0]"
            :error="formData.apiValidationErrors?.price?.length > 0" />
          <label for="perSqFtAmount">Per Sq. Feet Amount (Billing)</label>
          <q-input v-model.number="formData.bill_price" step="0.01" id="amount" type="number" filled
            :error-message="formData.apiValidationErrors?.bill_price?.[0]"
            :error="formData.apiValidationErrors?.bill_price?.length > 0" />

        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="green" type="submit" label="Submit" />
          <q-btn color="red" @click="showModalAdd = false" label="Cancel" />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';


const store = useStore(); // Get the store instance
const $q = useQuasar();
const token = store.getters['auth/getToken'];
const showModal = ref(false);
const showModalAdd = ref(false);

const materials = ref(false);
const glass_mms = ref(false);

const columns = [
  { name: 'serial_number', label: 'Sl.NO', field: 'serial_number', align: 'center', sortable: true },
  { name: 'material', label: 'Material', field: 'material', align: 'center', sortable: true },
  { name: 'glass_mm', label: 'Glass MM', field: 'glass_mm', align: 'center', sortable: true },
  { name: 'price', label: 'Square Feet MRP (Quotation)', field: 'price', align: 'center', sortable: true },
  { name: 'bill_price', label: 'Square Feet MRP (Billing)', field: 'bill_price', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', },
  { name: 'action', label: 'Action', field: 'action', align: 'center', },
];

const state = reactive({ rows: [], loading: false });
const filter = ref('')
const initialPagination = {
  sortBy: 'desc',
  descending: true,
  page: 1,
  rowsPerPage: 20,
};

const fetchDataList = async () => {
  try {
    state.loading = true;
    // Add the token to the headers
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/price_map/list', { headers }); // Replace with your API endpoint
    state.rows = response.data.data; // Assuming your API response is an array of objects
    console.log("rows", state.rows);
    console.log(response.data.data);
    state.loading = false;
  } catch (error) {
    state.loading = false;
    console.error('Error fetching data:', error);
  }
};

const fetchGlassMM = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/glass_mm/dropDown', { headers });
    glass_mms.value = response.data.data;
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};

const fetchMaterial = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/material/dropDown', { headers });
    materials.value = response.data.data;
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};

onMounted(async () => {
  await fetchGlassMM();
  await fetchMaterial();
  await fetchDataList();
});




const formData = ref({
  id: '',
  material_id: '',
  glass_mm_id: '',
  amount: '',
  bill_price: '',
  apiValidationErrors: null,
});

function resetForm() {
  formData.value = {
    id: '',
    material_id: '',
    glass_mm_id: '',
    amount: '',
    bill_price: '',
    apiValidationErrors: null,
  }
}

function openModal(data) {
  formData.value.id = data.id,
    formData.value.material_id = Number(data.material_id),
    formData.value.glass_mm_id = Number(data.glass_mm_id),
    formData.value.amount = data.price,
    formData.value.bill_price = data.bill_price,
    formData.value.apiValidationErrors = null,
    showModal.value = true;
}

function openAddModel() {
  resetForm();
  showModalAdd.value = true;
}

async function updateData() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    price_map_id: formData.value.id,
    material_id: formData.value.material_id,
    glass_mm_id: formData.value.glass_mm_id,
    price: formData.value.amount,
    bill_price: formData.value.bill_price,
  };

  

  await api
    .post('/api/admin/price_map/add', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      $q.loading.hide()
      if (data.status == true) {
        $q.notify({
          message: 'Data Updated Successfully',
          color: 'green',
          position: 'center'
        })
        fetchDataList();
        showModal.value = false;
      } else {
        $q.notify({
          message: 'Validation Errors',
          color: 'red',
          position: 'center'
        })
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
      $q.loading.hide()
    });
}
async function addData() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    material_id: formData.value.material_id,
    glass_mm_id: formData.value.glass_mm_id,
    price: formData.value.amount,
    bill_price: formData.value.bill_price,
  };
  console.log(data);

  

  await api
    .post('/api/admin/price_map/add', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      $q.loading.hide()
      if (data.status == true) {
        $q.notify({
          message: 'Data Added Successfully',
          color: 'green',
          position: 'center'
        })
        fetchDataList();
        showModalAdd.value = false;
      } else if (data.status == false) {
        $q.dialog({
          title: 'Error',
          message: 'Map Already Exists',
        })
      } else {
        $q.notify({
          message: 'Validation Errors',
          color: 'red',
          position: 'center'
        })
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
      $q.loading.hide()
    });
}

async function updateStatus(id) {
  const data = {
    price_map_id: id,
  };
  // console.log(data);

  

  await api
    .post('/api/admin/price_map/status', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      // $q.dialog({
      //   title: 'Success',
      //   message:  data.data.message
      // })
      if (data.status == true) {
        $q.notify({
          message: 'Status Updated Successfully',
          color: 'green',
          position: 'center'
        })
        // brandName.value = null
        fetchDataList();
      } else {
        $q.notify({
          message: 'Validation Errors',
          color: 'red',
          position: 'center'
        })
      }
    })
    .catch((error) => {
      if (error.response.status == 422) {
        $q.dialog({
          title: 'Error',
          message: error.response.data.message
        })
      } else {

        console.log('Error:', error.response.status);
      }
      // console.error('Error:', error );
      // Handle the error
    })
    .finally(() => {
      $q.loading.hide()
    });
}

</script>

<style scoped>
.hidden-input {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
}

.my-card {
  width: 50% !important;
  max-width: 50% !important;
  background-color: white !important;
  box-shadow: 2px 2px 6px #8080806b !important;
  border: 1px solid #1976d240 !important;
}

/* Styles for mobile devices (e.g., width: 100%) */
.mobile-style-card {
  width: 100% !important;
  max-width: 100% !important;
  background-color: white !important;
  box-shadow: 2px 2px 6px #8080806b !important;
  border: 1px solid #1976d240 !important;
}

.q-pa-md {
  border: none !important;
}
</style>
