<template>
  <div class="q-pa-md items-start q-gutter-md">
    <q-card flat bordered class="my-card-body">
      <q-card-section>
        <div class="text-h6 text-center">Search Report</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="q-pa-md example-row-column-width">
          <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
              <form @submit.prevent="generateReport">
                <div class="row">
                  <div class="col-md-3 col-sm-12 col-xs-12 q-pa-sm">
                    <q-input outlined type="date" v-model="formData.startDate" label="From Date"
                      :error-message="formData.apiValidationErrors?.startDate?.[0]"
                      :error="formData.apiValidationErrors?.startDate?.length > 0" />
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12 q-pa-sm">
                    <q-input outlined type="date" v-model="formData.toDate" label="To Date"
                      :error-message="formData.apiValidationErrors?.toDate?.[0]"
                      :error="formData.apiValidationErrors?.toDate?.length > 0" />
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12 q-pa-sm">
                    <q-select outlined v-model="formData.selectClient" :options="clients" :option-value="'id'"
                      :option-label="'name'" label="Select Client" name="selectClient" emit-value map-options
                      :error-message="formData.apiValidationErrors?.client_id?.[0]"
                      :error="formData.apiValidationErrors?.client_id?.length > 0"></q-select>
                  </div>
                  <div class="col-md-3 col-sm-12 col-xs-12 q-pa-sm">
                    <label for="type">Report Type:</label>
                    <div class="q-gutter-sm">
                      <q-radio v-model="formData.type" val="1" label="Bill" />
                      <q-radio v-model="formData.type" val="2" label="Quotation" />
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <q-btn color="primary" type="submit" label="Generate Report" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <div class="q-pa-md items-start q-gutter-md" v-if="showReports">
    <q-card flat bordered class="my-card-body">
      <q-card-section>
        <div class="text-h6 text-center">Reports</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="q-pa-md example-row-column-width">
          <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
              <div class="row">
                <div class="col-3 col-md-3 col-sm-12 col-xs-12 q-pa-md">
                  <q-card class="my-card" flat bordered>
                    <q-card-section horizontal class="con">
                      <q-card-section class="q-pt-xs">
                        <div v-if="isQuotation" class="text-overline">Total Quotations</div>
                        <div v-if="isBill" class="text-overline">Total Bills</div>
                        <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
                      </q-card-section>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions class="con">
                      <!-- <q-btn flat>Generated </q-btn> -->
                      <q-btn flat color="primary">{{ count }}</q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
                <div class="col-3 col-md-3 col-sm-12 col-xs-12 q-pa-md">
                  <q-card class="my-card" flat bordered>
                    <q-card-section horizontal class="con">
                      <q-card-section class="q-pt-xs">
                        <div class="text-overline">Total Amount</div>
                        <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
                      </q-card-section>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions class="con">
                      <!-- <q-btn flat>Generated </q-btn> -->
                      <q-btn flat color="primary">{{ amount }}</q-btn>
                    </q-card-actions>
                  </q-card>
                </div>

                <div v-if="isBill" class="col-3 col-md-3 col-sm-12 col-xs-12 q-pa-md">
                  <q-card class="my-card" flat bordered>
                    <q-card-section horizontal class="con">
                      <q-card-section class="q-pt-xs">
                        <div class="text-overline">Total Outstandings</div>
                        <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
                      </q-card-section>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions class="con">
                      <!-- <q-btn flat>Generated </q-btn> -->
                      <q-btn flat color="primary">{{ outstanding_amount }}</q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
                <div v-if="isBill" class="col-3 col-md-3 col-sm-12 col-xs-12 q-pa-md">
                  <q-card class="my-card" flat bordered>
                    <q-card-section horizontal class="con">
                      <q-card-section class="q-pt-xs">
                        <div class="text-overline">Total Cash Recieved</div>
                        <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
                      </q-card-section>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions class="con">
                      <!-- <q-btn flat>Generated </q-btn> -->
                      <q-btn flat color="primary">{{ cash_recieved }}</q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
                <div class="col-3 col-md-3 col-sm-12 col-xs-12 q-pa-md">
                  <q-card class="my-card" flat bordered>
                    <q-card-section horizontal class="con">
                      <q-card-section class="q-pt-xs">
                        <div class="text-overline">Total CGST</div>
                        <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
                      </q-card-section>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions class="con">
                      <!-- <q-btn flat>Generated </q-btn> -->
                      <q-btn flat color="primary">{{ cgst }}</q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
                <div class="col-3 col-md-3 col-sm-12 col-xs-12 q-pa-md">
                  <q-card class="my-card" flat bordered>
                    <q-card-section horizontal class="con">
                      <q-card-section class="q-pt-xs">
                        <div class="text-overline">Total SGST</div>
                        <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
                      </q-card-section>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions class="con">
                      <!-- <q-btn flat>Generated </q-btn> -->
                      <q-btn flat color="primary">{{ sgst }}</q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
                <div v-if="isBill" class="col-3 col-md-3 col-sm-12 col-xs-12 q-pa-md">
                  <q-card class="my-card" flat bordered>
                    <q-card-section horizontal class="con">
                      <q-card-section class="q-pt-xs">
                        <div class="text-overline">Total IGST</div>
                        <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
                      </q-card-section>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions class="con">
                      <!-- <q-btn flat>Generated </q-btn> -->
                      <q-btn flat color="primary">{{ isgt }}</q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
                <div v-if="isBill" class="col-6 col-md-6 col-sm-12 col-xs-12 q-pa-md">
                  <q-card class="my-card" flat bordered>
                    <q-card-section horizontal class="con">
                      <q-card-section class="q-pt-xs">
                        <div class="text-overline">Total Transaport Charges</div>
                        <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
                      </q-card-section>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions class="con">
                      <!-- <q-btn flat>Generated </q-btn> -->
                      <q-btn flat color="primary">{{ transport_charges }}</q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
                <div v-if="isBill" class="col-6 col-md-6 col-sm-12 col-xs-12 q-pa-md">
                  <q-card class="my-card" flat bordered>
                    <q-card-section horizontal class="con">
                      <q-card-section class="q-pt-xs">
                        <div class="text-overline">Total Discount</div>
                        <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
                      </q-card-section>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions class="con">
                      <!-- <q-btn flat>Generated </q-btn> -->
                      <q-btn flat color="primary">{{ discount }}</q-btn>
                    </q-card-actions>
                  </q-card>
                </div>

                <div class="col-12 col-md-12 col-sm-12 col-xs-12 q-pa-md">
                  <q-table flat bordered title="Treats" :rows="state.rows" :columns="columns" row-key="id"
                    :pagination="initialPagination" :loading="state.loading" :filter="filter"
                    no-data-label="I didn't find anything for you"
                    no-results-label="The filter didn't uncover any results">
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
                        <q-td key="created_at" :props="props">{{ props.row.created_at }}</q-td>
                        <q-td key="client" :props="props">{{ props.row.client }}</q-td>
                        <q-td key="total_amount" :props="props">{{ props.row.amount }}</q-td>
                        <q-td key="amount" :props="props">{{ props.row.amount }}</q-td>
                        <q-td key="cgst" :props="props">{{ props.row.cgst }}</q-td>
                        <q-td key="sgst" :props="props">{{ props.row.sgst }}</q-td>
                        <q-td key="igst" :props="props">{{ props.row.igst }}</q-td>
                        <q-td key="action" :props="props">
                          <div class="q-gutter-sm">
                            <q-btn v-if="isBill" :to="'/bill_view/' + props.row.id" color="blue">View Bill</q-btn>
                            <q-btn v-if="isQuotation" :to="'/quotation/' + props.row.id" color="blue">View
                              Quotation</q-btn>
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
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>

import { reactive, ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'; // Import the useRouter function
import { useQuasar } from 'quasar';
import { myHelperFunction } from './../../../utils';

const store = useStore();
const token = store.getters['auth/getToken'];
const $q = useQuasar();
const clients = ref(false);
const showReports = ref(false);
const isQuotation = ref(false);
const isBill = ref(true);
const count = ref(null);
const amount = ref(null);
const outstanding_amount = ref(null);
const cash_recieved = ref(null);
const cgst = ref(null);
const sgst = ref(null);
const igst = ref(null);
const transport_charges = ref(null);
const discount = ref(null);

const formData = ref({
  startDate: '',
  toDate: '',
  selectClient: '',
  type: '1',
  type: '1',
  apiValidationErrors: null,
});

function resetForm() {
  formData.value = {
    startDate: '',
    toDate: '',
    selectClient: '',
    type: '1',
    apiValidationErrors: null,
  }
}

const columns = [
  { name: 'created_at', label: 'Date', field: 'created_at', align: 'center', sortable: true },
  { name: 'client', label: 'Client Name', field: 'client', align: 'center', sortable: true },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'center', sortable: true },
  { name: 'cgst', label: 'CGST', field: 'cgst', align: 'center', sortable: true },
  { name: 'sgst', label: 'SGST', field: 'sgst', align: 'center', sortable: true },
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

onMounted(async () => {
  await fetchClients();
});

const fetchClients = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/buyers/dropDown', { headers });
    clients.value = response.data.data;
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};

async function generateReport() {
  formData.value.apiValidationErrors = null;
  $q.loading.show({
    message: 'Generating Reports. Please be patient...'
  })
  const data = {
    startDate: formData.value.startDate,
    toDate: formData.value.toDate,
    client_id: formData.value.selectClient,
    type: formData.value.type,
  };
  await api
    .post('/api/admin/report/fetch', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      $q.loading.hide()
      if (data.status == true) {
        count.value = data.count,
          amount.value = data.amount,
          outstanding_amount.value = data.outstanding_amount,
          cash_recieved.value = data.cash_recieved,
          cgst.value = data.cgst;
        sgst.value = data.sgst;
        igst.value = data.igst;
        transport_charges.value = data.transport_charges;
        discount.value = data.discount;
        showReports.value = true;
        if (formData.value.type == 1) {
          isBill.value = true;
          isQuotation.value = false;
        } else {
          isBill.value = false;
          isQuotation.value = true;
        }
        try {
          state.rows = data.data;
          state.loading = false;
        } catch (error) {
          state.loading = false;
          console.error('Error fetching data:', error);
        }
      } else {
        $q.notify({
          message: 'Something Not Right',
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

</script>
