<template>
  <div class="q-pa-md">
    <q-btn color="primary" @click="showModalAdd=true" label="Add New Glass MM" />
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
        <div class="text-h6">Edit Glass MM</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="glassID" class="hidden-input"
      hide-bottom-space label="Category ID" required/>
        <q-input v-model="glassName" lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please Enter Glass MM']"
                    required label="Glass MM" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="green" @click="updateGlassMM" label="Update" />
        <q-btn color="red" @click="closeModal" label="Cancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showModalAdd" persistent >
    <q-card flat bordered :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }">
      <q-card-section style="text-align:center">
        <div class="text-h6">Add Glass MM</div>
      </q-card-section>
      <form @submit.prevent="createGlassMM" ref="myForm">
      <q-card-section class="q-pa-md">
            <div class="q-pa-md example-row-column-width">
                  <div class="">
                    <q-input
                    outlined
                    v-model="glassName"
                    type="text"
                    id="glassName"
                    label="Glass MM"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please Enter Glass MM']"
                    />

                  </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="green" type="submit" label="Submit" />
            <q-btn color="red" @click="showModalAdd=false" type="button" label="Cancel" />
          </q-card-actions>
          </form>
    </q-card>
  </q-dialog>
</template>
<script setup>

import { reactive,ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { api } from 'boot/axios';
import { useQuasar} from 'quasar'

const store = useStore(); // Get the store instance
const $q = useQuasar();
const showModal = ref(false);
const showModalAdd = ref(false);
const glassID = ref(null);
const glassName = ref(null);

const token = store.getters['auth/getToken'];
const columns = [
  { name: 'serial_number', label: 'Sl.NO', field: 'serial_number',    align: 'center', sortable: true },
  { name: 'name', label: 'Name', field: 'name',    align: 'center', },
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
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/glass_mm/list', { headers }); // Replace with your API endpoint
    state.rows = response.data.data; // Assuming your API response is an array of objects
    console.log("rows",state.rows);
    console.log(response.data.data);
    state.loading = false;
  } catch (error) {
    state.loading = false;
    console.error('Error fetching data:', error);
  }

};


onMounted(async () => {
  await fetchDataList();
});

function openModal(data) {
  const glass = {
    id: data.id,
    name: data.name,
  };
  glassID.value = glass.id;
  glassName.value = glass.name;
  showModal.value = true;
}



function deleteItem(data) {
  console.log(data)
}
async function updateStatus(id) {
  const data = {
    glass_mms_id: id,
  };



  await api
    .post('/api/admin/glass_mm/status', data , {
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


async function updateGlassMM() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    glass_mms_id: glassID.value,
    name: glassName.value,
  };


  await api
    .post('/api/admin/glass_mm/add', data , {
      headers: {
            Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      $q.loading.hide()
      // $q.dialog({
      //   title: 'Success',
      //   message:  data.data.message
      // })
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
      // console.error('Error:', error );
      // Handle the error
    })
    .finally(() => {
      $q.loading.hide()
    });
}


const closeModal = () => {
  showModal.value = false;
  glassID.value = ref(null);
  glassName.value = ref(null);
};


async function createGlassMM() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    name: glassName.value,
  };



  await api
    .post('/api/admin/glass_mm/add', data , {
      headers: {
            Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      $q.loading.hide()
      // $q.dialog({
      //   title: 'Success',
      //   message:  data.data.message
      // })
      if (data.status == true) {
        showModalAdd.value=false;
        $q.notify({
          message: 'Data Added Successfully',
          color: 'green',
          position: 'center'
        })
        glassName.value = null
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
      $q.loading.hide();
      $q.notify({
        message: 'Validation Error',
        color: 'red',
        position: 'center'
      })
      // if (error.response.status == 422) {
      //   $q.dialog({
      //     title: 'Error',
      //     color:'warning',
      //     message:  error.response.data.message
      //   })
      // } else {

      //   console.log('Error:', error.response.status );
      // }
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
