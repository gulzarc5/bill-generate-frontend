<template>
  <div class="q-pa-md">
    <q-btn color="primary" @click="openAddModel" label="Add New Client" />
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
          <q-td key="email" :props="props">{{ props.row.email }}</q-td>
          <q-td key="mobile" :props="props">{{ props.row.mobile }}</q-td>
          <q-td key="state" :props="props">{{ props.row.state }}</q-td>
          <q-td key="city" :props="props">{{ props.row.city }}</q-td>
          <q-td key="pin" :props="props">{{ props.row.pin }}</q-td>
          <q-td key="address" :props="props">{{ props.row.address }}</q-td>
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

  <q-dialog v-model="showModal" full-width>
    <q-card flat bordered :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }"
>
    <q-card-section>
        <div class="text-h6">Update Client Details</div>
    </q-card-section>

    <form @submit.prevent="updatebuyer">
        <q-card-section class="q-pa-md">
            <div class="q-pa-md example-row-column-width">
            <div class="row q-col-gutter-xs  my-row">
                <q-input
                class="col-6 q-pa-xs"
                :dense="dense"
                label="Name"
                v-model="formData.buyerName"
                filled
                id="name"
                type="name"
                :error-message="formData.apiValidationErrors?.name?.[0]"
                :error="formData.apiValidationErrors?.name?.length > 0"
                />

                <q-input
                class="col-6 q-pa-xs"
                :dense="dense"
                label="Email"
                v-model="formData.email"
                filled id="email"
                type="email"
                />
            </div>
            <div class="row q-col-gutter-xs my-row">
                <q-input
                class="col-6 q-pa-xs"
                :dense="dense"
                label="Mobile"
                v-model="formData.mobile"
                maxlength="10"
                filled
                type="tel"
                id="mobile"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please Enter Mobile']"
                :error-message="formData.apiValidationErrors?.mobile?.[0]"
                :error="formData.apiValidationErrors?.mobile?.length > 0"
                />

                <q-input
                class="col-6 q-pa-xs"
                :dense="dense"
                label="State"
                v-model="formData.state"
                filled
                id="state"
                type="text"
                :error-message="formData.apiValidationErrors?.state?.[0]"
                :error="formData.apiValidationErrors?.state?.length > 0"
                />
            </div>
            <div class="row q-col-gutter-xs my-row">
                <q-input
                class="col-6 q-pa-xs"
                :dense="dense"
                v-model="formData.city"
                label="City"
                filled
                id="city"
                type="text"
                :error-message="formData.apiValidationErrors?.city?.[0]"
                :error="formData.apiValidationErrors?.city?.length > 0"
                />

                <q-input
                class="col-6 q-pa-xs"
                :dense="dense"
                label="Pin"
                v-model="formData.pin"
                filled
                id="pin"
                type="text"
                :error-message="formData.apiValidationErrors?.pin?.[0]"
                :error="formData.apiValidationErrors?.pin?.length > 0"
                />
            </div>
            <div class="row q-col-gutter-xs my-row">
                <q-input
                class="col-6 q-pa-xs"
                :dense="dense"
                label="Address"
                v-model="formData.address"
                filled
                id="address"
                type="text"
                :error-message="formData.apiValidationErrors?.address?.[0]"
                :error="formData.apiValidationErrors?.address?.length > 0"
                />
                <q-input
                  class="col-6 buyer_media q-pa-xs"
                  :dense="dense"
                  label="GST Number"
                  v-model="formData.gst"
                  filled
                  type="text"
                  :error-message="formData.apiValidationErrors?.gst?.[0]"
                  :error="formData.apiValidationErrors?.gst?.length > 0"
                  />
            </div>
            <q-card-actions align="right">
                <q-btn color="green" type="submit" label="Update" />
                <q-btn color="red" @click="showModal=false" label="Cancel" />
            </q-card-actions>

            </div>
        </q-card-section>
    </form>
    <q-separator inset />
    </q-card>
  </q-dialog>



  <q-dialog v-model="showModalAdd" full-width>
    <q-card flat bordered :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }"
>
        <q-card-section style="text-align:center">
            <div class="text-h6">Add New Client</div>
        </q-card-section>

        <form @submit.prevent="addBuyer">
            <q-card-section class="q-pa-md">
                <div class="row q-col-gutter-xs  my-row">
                    <q-input
                    class="col-6 buyer_media q-pa-xs"
                    :dense="dense"
                    label="Name"
                    v-model="formData.buyerName"
                    filled
                    id="name"
                    type="name"
                    :error-message="formData.apiValidationErrors?.name?.[0]"
                    :error="formData.apiValidationErrors?.name?.length > 0"
                    />

                    <q-input
                    class="col-6 buyer_media q-pa-xs"
                    :dense="dense"
                    label="Email"
                    v-model="formData.email"
                    filled id="email"
                    type="email"
                    />
                </div>
                <div class="row q-col-gutter-xs my-row">
                    <q-input
                    class="col-6 buyer_media q-pa-xs"
                    :dense="dense"
                    label="Mobile"
                    v-model="formData.mobile"
                    maxlength="10"
                    filled
                    type="tel"
                    id="mobile"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please Enter Mobile']"
                    :error-message="formData.apiValidationErrors?.mobile?.[0]"
                    :error="formData.apiValidationErrors?.mobile?.length > 0"
                    />

                    <q-input
                    class="col-6 buyer_media q-pa-xs"
                    :dense="dense"
                    label="State"
                    v-model="formData.state"
                    filled
                    id="state"
                    type="text"
                    :error-message="formData.apiValidationErrors?.state?.[0]"
                    :error="formData.apiValidationErrors?.state?.length > 0"
                    />
                </div>
                <div class="row q-col-gutter-xs my-row">
                    <q-input
                    class="col-6 buyer_media q-pa-xs"
                    :dense="dense"
                    v-model="formData.city"
                    label="City"
                    filled
                    id="city"
                    type="text"
                    :error-message="formData.apiValidationErrors?.city?.[0]"
                    :error="formData.apiValidationErrors?.city?.length > 0"
                    />

                    <q-input
                    class="col-6 buyer_media q-pa-xs"
                    :dense="dense"
                    label="Pin"
                    v-model="formData.pin"
                    filled
                    id="pin"
                    type="text"
                    :error-message="formData.apiValidationErrors?.pin?.[0]"
                    :error="formData.apiValidationErrors?.pin?.length > 0"
                    />
                </div>
                <div class="row q-col-gutter-xs my-row">
                    <q-input
                    class="col-6 buyer_media q-pa-xs"
                    :dense="dense"
                    label="Address"
                    v-model="formData.address"
                    filled
                    id="address"
                    type="text"
                    :error-message="formData.apiValidationErrors?.address?.[0]"
                    :error="formData.apiValidationErrors?.address?.length > 0"
                    />
                    <q-input
                    class="col-6 buyer_media q-pa-xs"
                    :dense="dense"
                    label="GST Number"
                    v-model="formData.gst"
                    filled
                    type="text"
                    :error-message="formData.apiValidationErrors?.gst?.[0]"
                    :error="formData.apiValidationErrors?.gst?.length > 0"
                    />
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
import { useQuasar } from 'quasar'

const store = useStore(); // Get the store instance
const $q = useQuasar();
const token = store.getters['auth/getToken'];

const showModal = ref(false);
const showModalAdd = ref(false);
const name = ref(null);
const email = ref(null);
const tel = ref(null);
const state_name = ref(null);
const city = ref(null);
const pin = ref(null);
const address = ref(null);
const buyerID = ref(null);

const stateDropDown = ref([]);

const formData = ref({
    id:'',
    buyerName:'',
    email:'',
    mobile:'',
    state:'',
    city:'',
    pin:'',
    address:'',
    gst:'',
    apiValidationErrors: null,
});

function resetForm () {
    formData.value = {
        id:'',
        buyerName:'',
        email:'',
        mobile:'',
        state:'',
        city:'',
        pin:'',
        address:'',
        gst:'',
        apiValidationErrors: null,
    }
}

const columns = [
  { name: 'serial_number', label: 'Sl.NO', field: 'serial_number',    align: 'center', sortable: true },
  { name: 'name', label: 'Name', field: 'name',    align: 'center',sortable: true },
  { name: 'email', label: 'Email', field: 'email',    align: 'center',sortable: true },
  { name: 'mobile', label: 'Mobile', field: 'mobile',    align: 'center',sortable: true },
  { name: 'state', label: 'State', field: 'state',    align: 'center',sortable: true },
  { name: 'city', label: 'City', field: 'city',    align: 'center',sortable: true },
  { name: 'pin', label: 'Pin', field: 'pin',    align: 'center',sortable: true },
  { name: 'address', label: 'Address', field: 'address',    align: 'center',sortable: true },
  { name: 'status', label: 'Status', field: 'status',    align: 'center', },
  { name: 'action', label: 'Action', field: 'action',    align: 'center', },
];

const state =reactive({rows:[],loading:false});
const filter = ref('')
const initialPagination = {
  sortBy: 'desc',
  descending: true,
  page: 1,
  rowsPerPage: 10,
};

const fetchDataList = async () => {
  try {
    state.loading = true;
    // Get the token from the store
    const token = store.getters['auth/getToken'];
    // Add the token to the headers
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/buyers/list', { headers }); // Replace with your API endpoint
    state.rows = response.data.data; // Assuming your API response is an array of objects
    state.loading = false;
  } catch (error) {
    state.loading = false;
    console.error('Error fetching data:', error);
  }

};


onMounted(async () => {
  await fetchDataList();
});

async function updateStatus(id) {
  const token = store.getters['auth/getToken'];
  const data = {
    buyer_id: id,
  };
  // console.log(data);

  await api
    .post('/api/admin/buyers/status', data , {
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

function openModal(data) {
  formData.value.id = data.id,
  formData.value.buyerName = data.name,
  formData.value.email = data.email,
  formData.value.mobile = data.mobile,
  formData.value.state = data.state,
  formData.value.city = data.city,
  formData.value.pin= data.pin,
  formData.value.address = data.address,
  formData.value.gst = data.gst_number,
  showModal.value = true;
}

function openAddModel() {
    showModalAdd.value=true;
    resetForm();
}

async function updatebuyer() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    buyer_id: formData.value.id,
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
    .post('/api/admin/buyers/add', data , {
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
      }else{
        $q.notify({
          message: 'Validation Errors',
          color: 'red',
          position: 'center'
        })
      }
    })
    .catch((error) => {
        $q.loading.hide();
        if (error.response && error.response.status === 422) {
            formData.value.apiValidationErrors = error.response.data.errors;
        } else {
            console.log('Error:', error.response.status );
        }
    })
    .finally(() => {
      $q.loading.hide()
    });
}

async function addBuyer() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
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
    .post('/api/admin/buyers/add', data , {
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
        showModalAdd.value =false;
        fetchDataList();
      }else{
        $q.notify({
          message: 'Something Went Wrong',
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
        console.log('Error:', error.response.status );
      }
    })
    .finally(() => {
      $q.loading.hide()
    });
}


const closeModal = () => {
  showModal.value = false;
  name.value = ref(null);
  brandID.value = ref(null);
  email.value = ref(null);
  tel.value = ref(null);
  state_name.value = ref(null);
  city.value = ref(null);
  pin.value = ref(null);
  address.value = ref(null);
};

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
        width: 60% !important;
        max-width: 60% !important;
        background-color: white !important;
        box-shadow: 2px 2px 6px #8080806b !important;
        border: 1px solid #1976d240 !important;
    }
    .my-row {
        margin-bottom: 20px; /* You can adjust the value to control the spacing */
    }
    @media (max-width: 576px) {
      .buyer_media {
        width: 100%;
      }
    }

</style>
