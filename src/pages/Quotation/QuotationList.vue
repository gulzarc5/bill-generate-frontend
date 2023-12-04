<template>
  <div class="q-pa-md">
    <q-btn color="primary" to="/quotation/generate" label="Add New Quotation" />
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
          <q-td key="serial_number" >{{ props.row.serial_number }}</q-td>
          <q-td key="client" >{{ props.row.client }}</q-td>
          <q-td key="client_mobile" >{{ props.row.client_mobile }}</q-td>
          <q-td key="total_sq_feet" >{{ props.row.total_sq_feet }}</q-td>
          <q-td key="cgst">{{ formatCurrency(props.row['cgst']) }}</q-td>
          <q-td key="sgst">{{ formatCurrency(props.row['sgst']) }}</q-td>
          <q-td key="total_amount">{{ formatCurrency(props.row['total_amount']) }}</q-td>
          <q-td key="created_at">{{ props.row.created_at }}</q-td>
          <q-td key="action" >
            <div class="q-gutter-sm">
              <q-btn :to="'/quotation/' + props.row.id" color="blue">View Quotation</q-btn>
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
</template>
<script setup>

import { reactive,ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar'

const store = useStore(); // Get the store instance
const $q = useQuasar();

const token = store.getters['auth/getToken'];

const columns = [
  { name: 'serial_number', label: 'Sl.NO', field: 'serial_number',    align: 'center', sortable: true },
  { name: 'client', label: 'Name', field: 'client',    align: 'center', },
  { name: 'client_mobile', label: 'Mobile', field: 'client_mobile',    align: 'center', },
  { name: 'total_sq_feet', label: 'Total SQ Feet', field: 'total_sq_feet',    align: 'center', },
  { name: 'cgst', label: 'CGST', field: 'cgst',    align: 'center', },
  { name: 'sgst', label: 'SGST', field: 'sgst',    align: 'center', },
  { name: 'total_amount', label: 'Total Value', field: 'total_amount',    align: 'center', },
  { name: 'created_at', label: 'Date', field: 'created_at',    align: 'center', },
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

const formatCurrency = (value) => {
  console.log("value within format",value);
  return value ? parseFloat(value).toFixed(2) : '0.00';
};

const fetchDataList = async () => {
  try {
    state.loading = true;
    // Add the token to the headers
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/quotations/list', { headers }); // Replace with your API endpoint
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
  .q-pa-md{
    border:none !important;
  }
</style>