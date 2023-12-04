<template>
  <div class="q-pa-md">
    <q-btn color="primary" @click="showModalAdd=true" label="Add New Material" />
  </div>
  <div class="q-pa-md">
    <q-table
      flat bordered
      title="Treats"
      :rows="state.rows"
      :columns="columns"
      row-key="id"
      :pagination="initialPagination"
      :loading="state.loading"
      :filter="filter"
      no-data-label="I didn't find anything for you"
      no-results-label="The filter didn't uncover any results"
    >
      <template v-slot:top>
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" >
          <q-td key="serial_number" :props="props">{{ props.row.serial_number }}</q-td>
          <q-td key="name" :props="props">{{ props.row.name }}</q-td>
          <!-- <q-td key="glassMm" :props="props">{{ props.row.glassMm }}</q-td> -->
          <!-- <q-td key="per_sq_feet_amount" :props="props">{{ props.row.per_sq_feet_amount }}</q-td> -->
          <!-- <q-td key="per_milli_sq_feet_amount" :props="props">{{ props.row.per_milli_sq_feet_amount }}</q-td> -->
          <q-td key="status" :props="props">{{ props.row.status == 1 ? 'Enabled' : 'Disabled' }}</q-td>
          <q-td key="action" :props="props">
            <div class="q-gutter-sm">
              <q-btn color="blue" label="Edit" @click="openModal(props.row)" size=sm no-caps></q-btn>
                <q-btn v-if="props.row.status == 1" color="red" label="Disable"  @click="updateStatus(props.row.id)" size=sm no-caps></q-btn>
                <q-btn v-else color="green" label="Enable"  @click="updateStatus(props.row.id)" size=sm no-caps></q-btn>
              <!-- <q-btn color="red" label="Delete"  @click="deleteItem(props.row)" size=sm no-caps></q-btn> -->
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
    <q-card flat bordered :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }"
>
      <q-card-section style="text-align:center">
        <div class="text-h6">Edit Material</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="materialID" class="hidden-input"
      hide-bottom-space label="Material ID" required/>
        <q-input
          v-model="materialName"
          lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please Enter Material Name']"

          label="Material Name"
        />
        <!-- <label for="perSqFtAmount">Per Sq. Feet Amount</label>
        <q-input
          v-model.number="materialPerSqFtAmount"
          step="0.01"
          id="materialPerSqFtAmount"
          type="number"
          filled
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== undefined && val >= 0) || 'Amount must be greater than 0.'
          ]"

        />
        <label for="glass_mm">Glas MM:</label>
        <q-select
          v-model="selectGlassmm"
          :options="glass_mms"
          :option-value="'id'"
          :option-label="'name'"
          label="Select Glas MM"
          name="selectGlassmm"
          emit-value
          map-options

        ></q-select> -->
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="green" @click="updateData" label="Update" />
        <q-btn color="red" @click="closeModal" label="Cancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showModalAdd" persistent>
    <q-card flat bordered :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }"
>
          <q-card-section style="text-align: center;">
            <div class="text-h6">Add Material</div>
          </q-card-section>
          <form @submit.prevent="addMaterial">
            <q-card-section class="q-pa-md">
              <div class="q-pa-md example-row-column-width">
                    <div class="">
                      <label class="label-class" for="name">Material Name</label>
                      <q-input
                      outlined
                      v-model="materialFormData.materialDataName"
                      type="text"
                      id="name"
                      label="Material Name"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please Enter Material Name']"
                      />
                    </div>
                    <!-- <div class="">
                      <label for="perSqFtAmount">Per Sq. Feet Amount</label>
                      <q-input
                        v-model.number="materialFormData.materialPerSqFtAmount"
                        step="0.01"
                        id="perSqFtAmount"
                        type="number"
                        filled
                        lazy-rules
                        :rules="[
                          (val) => (val !== null && val !== undefined && val >= 0) || 'Amount must be greater than 0.'
                        ]"

                      />
                    </div>
                    <div class="">
                      <label for="glass_mm">Glass MM:</label>
                      <q-select
                        v-model="materialFormData.glass_mm_id"
                        :options="glass_mms"
                        :option-value="'id'"
                        :option-label="'name'"
                        label="Select Glass MM"
                        name="selectGlassmm"
                        emit-value
                        map-options

                      ></q-select>
                    </div> -->
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn color="green" type="submit" label="Submit" />
              <q-btn color="red" @click="showModalAdd=false" label="Cancel" />
            </q-card-actions>
          </form>
          <q-separator inset />
        </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive,ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const store = useStore(); // Get the store instance
const $q = useQuasar();
const materialID = ref(false);
const materialName = ref(false);
// const materialPerSqFtAmount = ref(false);
// const selectGlassmm = ref([]);
// const glass_mms = ref([]);
const showModal = ref(false);
const showModalAdd = ref(false);
const token = store.getters['auth/getToken'];

const materialFormData = ref({
  materialDataName:'',
  // materialPerSqFtAmount:'',
  // glass_mm_id:'',
  apiValidationErrors: null,
});


const columns = [
  { name: 'serial_number', label: 'Sl.NO', field: 'serial_number',    align: 'center', sortable: true },
  { name: 'name', label: 'Name', field: 'name',    align: 'center',sortable: true },
  // { name: 'glassMm', label: 'Glass MM', field: 'glassMm',    align: 'center',sortable: true },
  // { name: 'per_sq_feet_amount', label: 'Square Feet MRP', field: 'per_sq_feet_amount',    align: 'center',sortable: true },
  // { name: 'per_milli_sq_feet_amount', label: 'Mili Square Feet MRP', field: 'per_milli_sq_feet_amount',    align: 'center',sortable: true },
  { name: 'status', label: 'Status', field: 'status',    align: 'center', },
  { name: 'action', label: 'Action', field: 'action',    align: 'center', },
];

const state =reactive({rows:[],loading:false});
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
    // Get the token from the store
    const token = store.getters['auth/getToken'];
    console.log(token);
    // Add the token to the headers
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/material/list', { headers }); // Replace with your API endpoint
    state.rows = response.data.data; // Assuming your API response is an array of objects
    console.log("rows",state.rows);
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

onMounted(async () => {
  await fetchDataList();
  // await fetchGlassMM();
});

async function updateStatus(id) {
  const token = store.getters['auth/getToken'];
  const data = {
    material_id: id,
  };



  await api
    .post('/api/admin/material/status', data , {
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
        // categoryName.value = null
        fetchDataList();
      }else{
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
          message:  error.response.data.message
        })
      } else {

        console.log('Error:', error.response.status );
      }
      // console.error('Error:', error );
      // Handle the error
    })
    .finally(() => {
      $q.loading.hide()
    });
}

async function openModal(data) {
  materialID.value = data.id;
  materialName.value = data.name;
  // materialPerSqFtAmount.value = data.per_sq_feet_amount;
  // selectGlassmm.value = data.glass_mm_id;
  showModal.value = true;
  await fetchGlassMM();
}


async function updateData() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    material_id: materialID.value,
    material_name: materialName.value,
    // glass_mm_id: selectGlassmm.value,
    // per_sq_feet_amount: materialPerSqFtAmount.value,
  };
  // console.log(data);



  await api
    .post('/api/admin/material/add', data , {
      headers: {
            Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      $q.loading.hide()
      if (data.status == true) {
        showModal.value = false;
        $q.notify({
          message: 'Data Updated Successfully',
          color: 'green',
          position: 'center'
        })
        fetchDataList();
        // categoryName.value = null
      }else{
        $q.notify({
          message: 'Data Already Exists',
          color: 'red',
          position: 'center'
        })
      }
    })
    .catch((error) => {
      $q.loading.hide();
      $q.notify({
        message: 'Validation Error',
        color: 'red',
        position: 'center'
      })
      // if (error.response && error.response.status === 422) {
      //     formData.value.apiValidationErrors = error.response.data.errors;
      // } else {
      //   console.log('Error:', error.response.status );
      // }
    })
    .finally(() => {
      $q.loading.hide()
    });
}


const closeModal = () => {
  showModal.value = false;
  materialID.value = ref(null);
  materialName.value = ref(null);
  materialPerSqFtAmount.value = ref(null);
  selectGlassmm.value = ref(null);
};

async function addMaterial() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    material_name: materialFormData.value.materialDataName,
    glass_mm_id: materialFormData.value.glass_mm_id,
    per_sq_feet_amount: materialFormData.value.materialPerSqFtAmount,
  };



  await api
    .post('/api/admin/material/add', data , {
      headers: {
            Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      $q.loading.hide()
      if (data.status == true) {
        showModalAdd.value=false;
        $q.notify({
          message: 'Data Added Successfully',
          color: 'green',
          position: 'center'
        })
         fetchDataList();
      }else{
        $q.notify({
          message: 'Data Already Exists',
          color: 'red',
          position: 'center'
        })
      }
    })
    .catch((error) => {
      if (error.response.status == 422) {
        $q.dialog({
          title: 'Error',
          message:  error.response.data.message
        })
      } else {

        console.log('Error:', error.response.status );
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
  .mobile-style-card{
    width: 100% !important;
    max-width: 100% !important;
    background-color: white !important;
    box-shadow: 2px 2px 6px #8080806b !important;
    border: 1px solid #1976d240 !important;
  }
  .q-pa-md{
    border:none !important;
  }
</style>
