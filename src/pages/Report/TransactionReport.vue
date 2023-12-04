<template>
    <div class="q-pa-md items-start q-gutter-md">
        <q-card flat bordered class="my-card-body">
            <q-card-section>
                <div class="text-h6 text-center">Transactions</div>
            </q-card-section>

            <q-card-section class="q-pa-md">
                <div class="q-pa-md example-row-column-width">
                    <div class="row">
                        <div class="col-md-12 col-sm-12 col-xs-12">
                            <form @submit.prevent="generateReport">
                                <div class="row">
                                    <div class="col-md-4 col-sm-12 col-xs-12 q-pa-sm">
                                        <q-input outlined type="date" v-model="formData.startDate" label="From Date"
                                            :error-message="formData.apiValidationErrors?.startDate?.[0]"
                                            :error="formData.apiValidationErrors?.startDate?.length > 0" />
                                    </div>
                                    <div class="col-md-4 col-sm-12 col-xs-12 q-pa-sm">
                                        <q-input outlined type="date" v-model="formData.toDate" label="To Date"
                                            :error-message="formData.apiValidationErrors?.toDate?.[0]"
                                            :error="formData.apiValidationErrors?.toDate?.length > 0" />
                                    </div>
                                    <div class="col-md-4 col-sm-12 col-xs-12 q-pa-sm">
                                        <q-select outlined v-model="formData.selectClient" :options="clients"
                                            :option-value="'id'" :option-label="'name'" label="Select Client"
                                            name="selectClient" emit-value map-options
                                            :error-message="formData.apiValidationErrors?.client_id?.[0]"
                                            :error="formData.apiValidationErrors?.client_id?.length > 0"></q-select>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <q-btn color="primary" type="submit" label="Fetch Transactions" />
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
                <div class="text-h6 text-center">Transactions</div>
            </q-card-section>

            <q-card-section class="q-pa-md">
                <div class="q-pa-md example-row-column-width">
                    <div class="row">
                        <div class="col-md-12 col-sm-12 col-xs-12">
                            <div class="row">
                                <div class="col-4 col-md-4 col-sm-12 col-xs-12 q-pa-md">
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
                                            <q-btn flat color="primary">{{ formattedNumber(outstanding_amount) }}</q-btn>
                                        </q-card-actions>
                                    </q-card>
                                </div>
                                <div class="col-4 col-md-4 col-sm-12 col-xs-12 q-pa-md">
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
                                            <q-btn flat color="primary">{{ formattedNumber(cash_recieved) }}</q-btn>
                                        </q-card-actions>
                                    </q-card>
                                </div>
                                <div class="col-4 col-md-4 col-sm-12 col-xs-12 q-pa-md">
                                    <q-card class="my-card" flat bordered>
                                        <q-card-section horizontal class="con">
                                            <q-card-section class="q-pt-xs">
                                                <div class="text-overline">Total Sale</div>
                                                <!-- <div class="text-h5 q-mt-sm q-mb-xs">5000</div> -->
                                            </q-card-section>
                                        </q-card-section>
                                        <q-separator />

                                        <q-card-actions class="con">
                                            <!-- <q-btn flat>Generated </q-btn> -->
                                            <q-btn flat color="primary">{{ sale }}</q-btn>
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
                                            <q-input borderless dense debounce="300" color="primary" v-model="filter"
                                                placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>

                                        <template v-slot:body="props">
                                            <q-tr :props="props">
                                                <q-td key="created_at" :props="props">{{ props.row.created_at }}</q-td>
                                                <q-td key="type" :props="props">
                                                    <q-badge v-if="props.row.type == 1" color="green" label="Credit" />
                                                    <q-badge v-if="props.row.type == 2" color="red" label="Debit" />
                                                </q-td>
                                                <q-td key="amount" :props="props">{{ formattedNumber(props.row.amount) ??
                                                    0.00 }}</q-td>
                                                <q-td key="comment" :props="props">{{ formattedNumber(props.row.comment)
                                                }}</q-td>
                                                <q-td key="outstanding_amount" :props="props">{{
                                                    formattedNumber(props.row.outstanding_amount) ?? 0.00 }}</q-td>
                                                <!-- <q-td key="action" :props="props">
                                            <div class="q-gutter-sm">
                                                <q-btn v-if="isBill" :to="'/bill_view/' + props.row.id" color="blue">View Bill</q-btn>
                                                <q-btn v-if="isQuotation" :to="'/quotation/' + props.row.id" color="blue">View Quotation</q-btn>
                                            </div>
                                        </q-td> -->
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

const store = useStore();
const token = store.getters['auth/getToken'];
const $q = useQuasar();
const clients = ref(false);
const showReports = ref(false);
const sale = ref(null);
const outstanding_amount = ref(null);
const cash_recieved = ref(null);

const formData = ref({
    startDate: '',
    toDate: '',
    selectClient: '',
    apiValidationErrors: null,
});

function resetForm() {
    formData.value = {
        startDate: '',
        toDate: '',
        selectClient: '',
        apiValidationErrors: null,
    }
}

const columns = [
    { name: 'created_at', label: 'Date', field: 'created_at', align: 'center', sortable: true },
    { name: 'type', label: 'Transaction Type', field: 'type', align: 'center', sortable: true },
    { name: 'amount', label: 'Amount', field: 'amount', align: 'center', sortable: true },
    { name: 'comment', label: 'Comment', field: 'comment', align: 'center', sortable: true },
    { name: 'outstanding_amount', label: 'Outstanding Amount', field: 'outstanding_amount', align: 'center', sortable: true },
    //   { name: 'action', label: 'Action', field: 'action',    align: 'center', },
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
        message: 'Generating Transactions. Please be patient...'
    })
    const data = {
        startDate: formData.value.startDate,
        toDate: formData.value.toDate,
        client_id: formData.value.selectClient,
    };
    await api
        .post('/api/admin/transaction/fetch', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            $q.loading.hide()
            if (data.status == true) {
                outstanding_amount.value = data.outstanding_amount,
                    cash_recieved.value = data.cash_recieved,
                    sale.value = data.sale,
                    showReports.value = true;
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

const formattedNumber = (value) => {
    return Number(
        value.toString().match(/^\d+(?:\.\d{0,2})?/)
    )
}

</script>
