<template>
  <div class="q-pa-md row items-start">
    <div class="col-3 col-md-3 col-sm-12 col-xs-12 q-pa-md">
      <q-card class="my-card" flat bordered>
        <q-card-section horizontal class="con">
          <q-card-section class="q-pt-xs">
            <div class="text-overline">Quotation</div>
            <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
          </q-card-section>

          <!-- <q-card-section class="col-5 flex" style="justify-content: center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="3em"
                viewBox="0 0 448 512"
              >
                <path
                  d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                />
              </svg>
            </q-card-section> -->
        </q-card-section>

        <q-separator />

        <q-card-actions class="con">
          <q-btn flat>Generated </q-btn>
          <q-btn flat color="primary"> {{ today_quotation_generated }} </q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-3 col-md-3 col-sm-12 col-xs-12 q-pa-md">
      <q-card class="my-card" flat bordered>
        <q-card-section horizontal class="con">
          <q-card-section class="q-pt-xs">
            <div class="text-overline">Quotation</div>
            <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
          </q-card-section>

          <!-- <q-card-section class="col-5 flex" style="justify-content: center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="3em"
                viewBox="0 0 448 512"
              >
                <path
                  d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                />
              </svg>
            </q-card-section> -->
        </q-card-section>

        <q-separator />

        <q-card-actions class="con">
          <q-btn flat>Total Value </q-btn>
          <q-btn flat color="primary"> Rs {{ today_quotation_amount }} </q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-3 col-md-3 col-sm-12 col-xs-12 q-pa-md">
      <q-card class="my-card" flat bordered>
        <q-card-section horizontal class="con">
          <q-card-section class="q-pt-xs">
            <div class="text-overline">Bill</div>
            <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
          </q-card-section>

          <!-- <q-card-section class="col-5 flex" style="justify-content: center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="3em"
                viewBox="0 0 448 512"
              >
                <path
                  d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                />
              </svg>
            </q-card-section> -->
        </q-card-section>

        <q-separator />

        <q-card-actions class="con">
          <q-btn flat> Generated </q-btn>
          <q-btn flat color="primary"> {{ today_bill_generated }} </q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-3 col-md-3 col-sm-12 col-xs-12 q-pa-md">
      <q-card class="my-card" flat bordered>
        <q-card-section horizontal class="con">
          <q-card-section class="q-pt-xs">
            <div class="text-overline">Bill</div>
            <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
          </q-card-section>

          <!-- <q-card-section class="col-5 flex" style="justify-content: center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="3em"
                viewBox="0 0 448 512"
              >
                <path
                  d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                />
              </svg>
            </q-card-section> -->
        </q-card-section>

        <q-separator />

        <q-card-actions class="con">
          <q-btn flat>Total Value </q-btn>
          <q-btn flat color="primary"> Rs {{ today_bill_amount }} </q-btn>
        </q-card-actions>
      </q-card>
    </div>
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
          <q-td key="client" :props="props">{{ props.row.client_details.name }}</q-td>
          <q-td key="client_mobile" :props="props">{{ props.row.client_details.mobile }}</q-td>
          <q-td key="total_sq_feet" :props="props">{{ props.row.total_sq_feet }}</q-td>
          <q-td key="cgst" :props="props">{{ parseFloat(props.row.cgst).toFixed(2) ?? 0.00 }}</q-td>
          <q-td key="sgst" :props="props">{{ parseFloat(props.row.sgst).toFixed(2) ?? 0.00 }}</q-td>
          <q-td key="total_amount" :props="props">{{ parseFloat(props.row.total_amount).toFixed(2) ?? 0.00 }}</q-td>
          <q-td key="action" :props="props">
            <div class="q-gutter-sm">
              <q-btn :to="'/bill_view/' + props.row.id" color="blue">View Bill</q-btn>
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
    <div class="q-pa-md text-center">
      <q-btn color="primary" to="/bill/list" label="View All Bills" />
    </div>
  </div>
</template>

<script setup>

import { reactive, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar'

const store = useStore(); // Get the store instance
const $q = useQuasar();

const today_bill_amount = ref(null);
const today_bill_generated = ref(null);
const today_quotation_amount = ref(null);
const today_quotation_generated = ref(null);

const token = store.getters['auth/getToken'];

const columns = [
  { name: 'serial_number', label: 'Sl.NO', field: 'serial_number', align: 'center', sortable: true },
  { name: 'client', label: 'Name', field: 'client', align: 'center', },
  { name: 'client_mobile', label: 'Mobile', field: 'client_mobile', align: 'center', },
  { name: 'total_sq_feet', label: 'Total SQ Feet', field: 'total_sq_feet', align: 'center', },
  { name: 'cgst', label: 'CGST', field: 'cgst', align: 'center', },
  { name: 'sgst', label: 'SGST', field: 'sgst', align: 'center', },
  { name: 'total_amount', label: 'Total Value', field: 'total_amount', align: 'center', },
  { name: 'action', label: 'Action', field: 'action', align: 'center', },
];

const state = reactive({ rows: [], loading: false });
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
    // Add the token to the headers
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/dashboard', { headers }); // Replace with your API endpoint
    state.rows = response.data.data; // Assuming your API response is an array of objects
    console.log("rows", state.rows);
    console.log(response.data.data);
    today_bill_amount.value = response.data.today_bill_amount;
    today_bill_generated.value = response.data.today_bill_generated;
    today_quotation_amount.value = response.data.today_quotation_amount;
    today_quotation_generated.value = response.data.today_quotation_generated;
    state.loading = false;
  } catch (error) {
    state.loading = false;
    console.error('Error fetching data:', error);
  }

};


onMounted(async () => {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  });
  await fetchDataList();
  $q.loading.hide();
});


</script>

<style>
.back {
  width: 23% !important;
  background-color: #80808012;
  box-shadow: 2px 2px 6px #8080806b !important;
  border: 1px solid #1976d240 !important;
}

.con {
  justify-content: space-between;
}

.q-separator--horizontal {
  display: block;
  height: 0px;
}

.text-h5 {
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 0rem;
  letter-spacing: normal;
}
</style>
