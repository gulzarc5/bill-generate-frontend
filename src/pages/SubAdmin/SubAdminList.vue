<template>
  <div class="q-pa-md">
    <q-btn color="primary" @click="openAddModel" label="Add New Sub Admin" />
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
          <q-td key="password" :props="props">{{ props.row.password }}</q-td>
          <q-td key="status" :props="props">{{ props.row.status == 1 ? 'Enabled' : 'Disabled' }}</q-td>
          <q-td key="action" :props="props">
            <div class="q-gutter-sm">
              <q-btn color="grey" label="Update Password" @click="openPasswordModal(props.row)" size=sm no-caps></q-btn>
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


  <q-dialog v-model="passwordShow">
    <q-card flat bordered :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }"
>
        <q-card-section>
          <div class="text-h6">Update Password</div>
        </q-card-section>


        <q-card-section class="q-pa-md">
          <div class="q-pa-md example-row-column-width">
              <form @submit.prevent="updatePassword">
                <div class="row q-col-gutter-md  my-row">

                    <q-input
                      label="Current Password"
                      class="col-12 sub_admin_media q-pa-xs"
                      v-model="formData.current_password"
                      filled
                      id="current_password"
                      type="text"
                      :error-message="formData.apiValidationErrors?.current_password?.[0]"
                      :error="formData.apiValidationErrors?.current_password?.length > 0"

                    />
                    <q-input
                      label="New Password"
                      class="col-12 sub_admin_media q-pa-xs"
                      v-model="formData.new_password"
                      filled
                      id="new_password"
                      type="text"
                      :error-message="formData.apiValidationErrors?.new_password?.[0]"
                      :error="formData.apiValidationErrors?.new_password?.length > 0"

                    />
                </div>

                <q-card-actions align="right">
                    <q-btn color="green" type="submit" label="Submit" />
                    <q-btn color="red" @click="passwordShow=false" label="Cancel" />
                </q-card-actions>
              </form>
          </div>
        </q-card-section>
        <q-separator inset />
      </q-card>
  </q-dialog>


  <q-dialog v-model="showModal">
    <q-card flat bordered :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }"
>
        <q-card-section>
          <div class="text-h6">Update Sub Admin</div>
        </q-card-section>


        <q-card-section class="q-pa-md">
          <div class="q-pa-md example-row-column-width">
              <form @submit.prevent="updateSubAdmin">
                <div class="row q-col-gutter-md  my-row">
                    <!-- <label for="name"> Name</label> -->
                    <q-input
                    label="Name"
                    class="col-6 sub_admin_media q-pa-xs"
                    v-model="formData.name"
                    filled
                    id="name"
                    type="name"
                    :error-message="formData.apiValidationErrors?.name?.[0]"
                    :error="formData.apiValidationErrors?.name?.length > 0"

                    />
                    <!-- <label for="email"> Email</label> -->
                    <q-input
                    label="Email"
                    class="col-6 sub_admin_media q-pa-xs"
                    v-model="formData.email"
                    filled id="email"
                    type="email"
                    :error-message="formData.apiValidationErrors?.email?.[0]"
                    :error="formData.apiValidationErrors?.email?.length > 0"

                    />
                </div><br>
                <div class="row q-col-gutter-md  my-row">
                    <q-input
                      label="Mobile"
                      class="col-6 sub_admin_media q-pa-xs"
                      v-model="formData.mobile"
                      maxlength="10"
                      filled
                      type="tel"
                      id="mobile"
                      :error-message="formData.apiValidationErrors?.mobile?.[0]"
                      :error="formData.apiValidationErrors?.mobile?.length > 0"
                    />
                    <q-input
                      label="Password"
                      class="col-6 sub_admin_media q-pa-xs"
                      v-model="formData.password"
                      filled
                      id="password"
                      type="text"
                      :error-message="formData.apiValidationErrors?.password?.[0]"
                      :error="formData.apiValidationErrors?.password?.length > 0"

                    />
                </div>

                <q-card-actions align="right">
                    <q-btn color="green" type="submit" label="Submit" />
                    <q-btn color="red" @click="showModal=false" label="Cancel" />
                </q-card-actions>


              </form>
          </div>
        </q-card-section>
        <q-separator inset />
      </q-card>
  </q-dialog>


  <q-dialog v-model="showModalAdd">
    <q-card flat bordered :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }"
>
        <q-card-section>
          <div class="text-h6">Add Sub Admin</div>
        </q-card-section>


        <q-card-section class="q-pa-md">
          <div class="q-pa-md example-row-column-width">
              <form @submit.prevent="addSubAdmin">
                <div class="row q-col-gutter-md  my-row">
                    <!-- <label for="name"> Name</label> -->
                    <q-input
                    label="Name"
                    class="col-6 sub_admin_media q-pa-xs"
                    v-model="formData.name"
                    filled
                    id="name"
                    type="name"
                    :error-message="formData.apiValidationErrors?.name?.[0]"
                    :error="formData.apiValidationErrors?.name?.length > 0"

                    />
                    <!-- <label for="email"> Email</label> -->
                    <q-input
                    label="Email"
                    class="col-6 sub_admin_media q-pa-xs"
                    v-model="formData.email"
                    filled id="email"
                    type="email"
                    :error-message="formData.apiValidationErrors?.email?.[0]"
                    :error="formData.apiValidationErrors?.email?.length > 0"

                    />
                </div><br>
                <div class="row q-col-gutter-md  my-row">
                    <q-input
                      label="Mobile"
                      class="col-6 sub_admin_media q-pa-xs"
                      v-model="formData.mobile"
                      maxlength="10"
                      filled
                      type="tel"
                      id="mobile"
                      :error-message="formData.apiValidationErrors?.mobile?.[0]"
                      :error="formData.apiValidationErrors?.mobile?.length > 0"
                    />
                    <q-input
                      label="Password"
                      class="col-6 sub_admin_media q-pa-xs"
                      v-model="formData.password"
                      filled
                      id="password"
                      type="text"
                      :error-message="formData.apiValidationErrors?.password?.[0]"
                      :error="formData.apiValidationErrors?.password?.length > 0"

                    />
                </div>

                <q-card-actions align="right">
                    <q-btn color="green" type="submit" label="Submit" />
                    <q-btn color="red" @click="showModalAdd=false" label="Cancel" />
                </q-card-actions>


              </form>
          </div>
        </q-card-section>
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


const passwordShow = ref(false);
const showModal = ref(false);
const showModalAdd = ref(false);
const name = ref(null);
const email = ref(null);
const mobile = ref(null);
const password = ref(null);
const current_password = ref(null);
const new_password = ref(null);

const formData = ref({
    id:'',
    name:'',
    email:'',
    mobile:'',
    password:'',
    current_password:'',
    new_password:'',
    apiValidationErrors: null,
});

function resetForm () {
    formData.value = {
        id:'',
        name:'',
        email:'',
        mobile:'',
        password:'',
        current_password:'',
        new_password:'',
        apiValidationErrors: null,
    }
}


const columns = [
  { name: 'serial_number', label: 'Sl.NO', field: 'serial_number',    align: 'center', sortable: true },
  { name: 'name', label: 'Name', field: 'name',    align: 'center',sortable: true },
  { name: 'email', label: 'Email', field: 'email',    align: 'center',sortable: true },
  { name: 'mobile', label: 'Mobile', field: 'mobile',    align: 'center',sortable: true },
  { name: 'password', label: 'Password', field: 'password',    align: 'center',sortable: true },
  { name: 'status', label: 'Status', field: 'status',    align: 'center',sortable: true },
  { name: 'action', label: 'Action', field: 'action',    align: 'center',sortable: true },
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
    // Add the token to the headers
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/sub_admin/list', { headers }); // Replace with your API endpoint
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
  const data = {
    sub_admin_id: id,
  };

  await api
    .post('/api/admin/sub_admin/status', data , {
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
  formData.value.name = data.name,
  formData.value.email = data.email,
  formData.value.mobile = data.mobile,
  formData.value.password = data.password,
  formData.value.apiValidationErrors = null,
  console.log(formData),
  showModal.value = true;
}
function openPasswordModal(data) {
  formData.value.id = data.id,
  passwordShow.value = true;
  console.log(formData);
}

function openAddModel() {
    showModalAdd.value=true;
    resetForm();
}


async function updateSubAdmin() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    sub_admin_id: formData.value.id,
    name: formData.value.name,
    email: formData.value.email,
    mobile: formData.value.mobile,
    password: formData.value.password,
  };

  await api
    .post('/api/admin/sub_admin/add', data , {
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

async function addSubAdmin() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    name: formData.value.name,
    email: formData.value.email,
    mobile: formData.value.mobile,
    password: formData.value.password,
  };

  await api
    .post('/api/admin/sub_admin/add', data , {
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
        showModalAdd.value =false;
        fetchDataList();
      }else{
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
          console.log('Error:', error.response.status );
        }
    })
    .finally(() => {
      $q.loading.hide()
    });
}


async function updatePassword() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    sub_admin_id: formData.value.id,
    current_password: formData.value.current_password,
    new_password: formData.value.new_password,
  };

  await api
    .post('/api/admin/sub_admin/change_password', data , {
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
        passwordShow.value =false;
        fetchDataList();
      }else{
        $q.notify({
          message: 'Wrong Password',
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

</script>
<style scoped>

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
    .mobile-style-card{
      width: 100% !important;
      max-width: 100% !important;
      background-color: white !important;
      box-shadow: 2px 2px 6px #8080806b !important;
      border: 1px solid #1976d240 !important;
    }
    @media (max-width: 576px) {
      .sub_admin_media {
        width: 100%;
      }
    }
</style>
