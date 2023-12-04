<template>
	<div class="q-pa-md items-start q-gutter-md">
		<q-card flat bordered class="my-card-body">
			<q-card-section>
				<div class="text-h6 text-center">Prepare Bill</div>
			</q-card-section>

			<q-card-section class="q-pa-md">
				<div class="q-pa-md ">
					<div class="row">
						<div class="col-md-12 col-sm-12 col-xs-12">
							<div class="row">
								<div class="col-md-6 col-sm-12 col-xs-12">
									<!-- <label class="label-class" for="buyerNumber">Number of the Client</label> -->
									<q-input type="number" v-model="buyerNumber" @blur="fetchBuyer" label="Client Number" />
								</div>
								<div class="col-md-6 col-sm-12 col-xs-12" v-if="isShow">
									<q-input v-model="buyerID" class="hidden-input" hide-bottom-space label="Buyer ID"
										required />
									<p class="product_p"><b class="product_label">Name: </b> {{ buyerName }}</p><br>
									<p class="product_p"><b class="product_label">Mobile: </b> {{ buyerNumber }}</p><br>
									<p class="product_p"><b class="product_label">State: </b> {{ buyerState }}</p><br>
								</div>
							</div>

							<div class="row">
								<div class="col-md-3 col-sm-12 col-xs-12 q-pa-sm">
									<!-- <label for="selectSupplyType">Supply Type:</label> -->
									<q-select v-model="selectedSupplyType" :options="supplyType" :option-value="'key'"
										:option-label="'name'" label="Select Supply Type" name="selectSupplyType" emit-value
										map-options :error-message="formData.apiValidationErrors?.material_id?.[0]"
										:error="formData.apiValidationErrors?.material_id?.length > 0"></q-select>
								</div>
								<div class="col-md-3 col-sm-12 col-xs-12 q-pa-sm">
									<label for="selectSupplyType">Recipient Same as Shipped to:</label>
									<div class="q-gutter-sm">
										<q-radio v-model="recipient" val="1" label="No" />
										<q-radio v-model="recipient" val="2" label="Yes" />
									</div>
								</div>

								<div class="col-md-3 col-sm-12 col-xs-12 q-pa-sm" v-if="recipient == '2'">
									<q-input type="text" v-model="recipientName" label="Recipient Name" />
								</div>
								<div class="col-md-3 col-sm-12 col-xs-12 q-pa-sm" v-if="recipient == '2'">
									<q-input type="text" v-model="recipientMobile" label="Recipient Mobile" />
								</div>
							</div>
							<div class="row">
								<div class="col-md-3 col-sm-12 col-xs-12 q-pa-sm">
									<q-input type="text" v-model="eWayBill" label="E-Way Bill No" />
								</div>
								<div class="col-md-3 col-sm-12 col-xs-12 q-pa-sm">
									<q-input type="date" v-model="eWayBillDate" label="Select E-Way Bill Date" />
								</div>
								<div class="col-md-3 col-sm-12 col-xs-12 q-pa-sm">
									<q-input type="date" v-model="validDate" label="Select Valid Date" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</q-card-section>
			<q-separator inset />

			<q-table :rows="formRows" :columns="formColumns" row-key="id" hide-pagination flat :pagination="false"
				:rows-per-page-options="[0]">
				<template v-slot:body-cell="props">
					<q-td>
						<template v-if="props.col.field === 'product'">
							<q-select v-model="props.row.product" dense outlined :options="products" :option-value="'id'"
								:option-label="'name'" :label="props.col.label" :style="{ minWidth: '200px' }"
								@update:model-value="onProductSelect(props.row, props.col.field)" />
						</template>
						<template v-else-if="props.col.field === 'glass_mm'">
							<!-- <q-input v-model="props.row.glass_mm" dense outlined :placeholder="props.col.label"
								:disable="true" /> -->
							<q-select v-model="props.row.glass_mm" dense outlined :options="props.row.price_maps"
								:option-value="'glass_mm_id'" :option-label="'glass_mm'" :label="props.col.label"
								:style="{ minWidth: '200px' }"
								@update:model-value="onProductSelect(props.row, props.col.field)" />
						</template>
						<template v-else-if="props.col.field === 'height'">
							<span style="display:flex;padding-top: 10px;">
								<q-input v-model="props.row.height" dense outlined placeholder="Height"
									@blur="onProductSelect(props.row, props.col.field)" />
								<p style="padding:8px">X</p>
								<q-input v-model="props.row.width" dense outlined placeholder="Width"
									@blur="onProductSelect(props.row, props.col.field)" />
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
			</q-table>


			<q-card-section>
				<div class="text-h6 text-center">Summary Show</div>
			</q-card-section>
			<q-card-section id="product_div">
				<div class="example-row-column-width">
					<div class="row">
						<div class="col-md-4 col-sm-6 col-xs-12"></div>
						<div class="col-md-8 col-sm-6 col-xs-12">
							<div class="row summary">
								<div class="row">
									<div class="col-md-6 col-sm-12 col-xs-12">
										<p><b>Total Sq. Feet: </b> {{ calculateTotalSqFeet() }}</p>
									</div>
									<div class="col-md-6 col-sm-12 col-xs-12">
										<p><b>Average value per Sq.Feet: </b>{{ calculateAvgSqfeetAmount() }}</p>
									</div>
									<div class="col-md-6 col-sm-12 col-xs-12">
										<p><b>CGST @ 9%: </b>{{ calculateCgst() }}</p>
									</div>
									<div class="col-md-6 col-sm-12 col-xs-12">
										<p><b>SGST @ 9%: </b>{{ calculateSgst() }}</p>
									</div>
									<div class="col-md-6 col-sm-12 col-xs-12">
										<p><b>IGST @ 18%: </b>{{ calculateIgst() }}</p>
									</div>
									<div class="col-md-6 col-sm-12 col-xs-12">
										<p><b>Bill Total: </b>{{ parseFloat(calculateTotalAmount())
										}}</p>
									</div>

									<div class="col-md-3 col-sm-12 col-xs-12">
										<q-input type="number" v-model="discount" label="Enter Discount" />
									</div>
									<div class="col-md-3 col-sm-12 col-xs-12">
										<q-input type="number" v-model="cashReceived" label="Cash Received" />
									</div>
									<div class="col-md-3 col-sm-12 col-xs-12">
										<q-input type="number" v-model="transportCharge" label="Transport Charges"
											@update:model-value="setTransportCharge(transportCharge)" />
									</div>
									<div class="col-md-3 col-sm-12 col-xs-12">
										<q-input type="number" v-model="rundOfAmount" label="Round Off Amount"
											@update:model-value="setroundOfCharge(rundOfAmount)" />
									</div>
									<div class="col-md-6 col-sm-12 col-xs-12" style="padding-top: 10px;">
										<p><b>Bill Total: </b>{{ parseFloat((calculateTotalAmount() + rundOfAmountData) -
											discount).toFixed(2) }}</p>
									</div>
									<div class="col-md-6 col-sm-12 col-xs-12" style="padding-top: 10px;">
										<p><b>Outstanding Balance: </b>{{ parseFloat(((calculateTotalAmount() +
											rundOfAmountData)
											- discount) -
											cashReceived).toFixed(2) }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</q-card-section>

			<div class="q-pa-md q-gutter-sm text-center">
				<q-btn color="primary" @click="submitBill" type="button" label="Generate Bill" />
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
						<q-input class="col-6 q-pa-xs" label="Name" v-model="formData.buyerName" filled id="name"
							type="name" :error-message="formData.apiValidationErrors?.name?.[0]"
							:error="formData.apiValidationErrors?.name?.length > 0" />

						<q-input class="col-6 q-pa-xs" label="Email" v-model="formData.email" filled id="email" type="email"
							:error-message="formData.apiValidationErrors?.email?.[0]"
							:error="formData.apiValidationErrors?.email?.length > 0" />
					</div>
					<div class="row q-col-gutter-xs my-row">
						<q-input class="col-6 q-pa-xs" label="Mobile" v-model="formData.mobile" maxlength="10" filled
							type="tel" id="mobile" lazy-rules
							:rules="[val => val && val.length > 0 || 'Please Enter Mobile']"
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
						<q-input class="col-12 q-pa-xs" label="Address" v-model="formData.address" filled id="address"
							type="text" :error-message="formData.apiValidationErrors?.address?.[0]"
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
				<div class="text-h6">Bill</div>
			</q-card-section>

			<q-card-section class="q-pt-none">
				Bill Created Successfully
			</q-card-section>

			<q-card-actions align="right" class="bg-white text-teal">
				<q-btn flat label="OK" v-close-popup />
				<q-btn :to="`/bill_view/${billId}`" flat label="Show Bill" />
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
const billId = ref(null);
const isShow = ref(false);
const showButton = ref(true);

const buyerNumber = ref(null);
const selectedSupplyType = ref("B2B");
const recipient = ref("1");
const recipientName = ref(null);
const recipientMobile = ref(null);
const eWayBill = ref(null);
const eWayBillDate = ref(null);
const validDate = ref(null);
const discount = ref(0);
const cashReceived = ref(0);
const transportCharge = ref(0);
const transportChargeData = ref(0);
const totalCgst = ref(0);
const totalSgst = ref(0);
const totalIgst = ref(0);
const totalSqFeet = ref(0);
const rundOfAmount = ref(0);
const rundOfAmountData = ref(0);



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

const supplyType = [
	{
		'key': "B2B",
		'name': "B2B",
	},
	{
		'key': "B2C",
		'name': "B2C",
	}
]

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
		product: [],
		selectedProduct: '',
		quantity: '',
		height: '',
		width: '',
		glass_mm: '',
		selected_glass_mm: '',
		price_maps: '',
		amount: '',
		price_maps: [],
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
			product: [],
			selectedProduct: '',
			quantity: '',
			height: '',
			width: '',
			glass_mm: '',
			selected_glass_mm: '',
			amount: '',
			price_maps: [],
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
	if (field == 'product') {
		const selectedProduct = row[field];
		if (selectedProduct) {

			row.selected_glass_mm = selectedProduct.glass_mm
			row.price_maps = selectedProduct.price_maps
			row.height = selectedProduct.height
			row.width = selectedProduct.width
			row.selectedProduct = await selectedProduct.id;
			calculateProductSqFeet(row);
		} else {
			resetRow(row);
		}
	} else if (field == 'glass_mm') {
		row.selected_glass_mm = row.glass_mm.glass_mm_id
		calculateProductSqFeet(row);
	} else if (field == 'quantity' || field == 'height') {
		calculateProductSqFeet(row);
	} else {
		resetRow(row);
	}
};

const calculateProductSqFeet = (row) => {
	if (row.quantity && row.height && row.width && row.selected_glass_mm && row.glass_mm.bill_price) {
		let totalSqFeet = (formattedNumber(row.width) * formattedNumber(row.height)) / 89999;
		row.totalAmount = (formattedNumber(totalSqFeet) * formattedNumber(row.glass_mm.bill_price)) * formattedNumber(row.quantity);
		row.amount = (formattedNumber(totalSqFeet) * formattedNumber(row.glass_mm.bill_price));
		row.totalSqFeet = formattedNumber(totalSqFeet * row.quantity);
		addRow();
	}
}

const setTransportCharge = (newTransportCharge) => {
	transportChargeData.value = formattedNumber(newTransportCharge);
}
const setroundOfCharge = (newRoundOf) => {
	rundOfAmountData.value = formattedNumber(newRoundOf);
}

const calculateTotalSqFeet = () => {
	const totalSqFeetData = formRows.value.reduce((total, row) => total + row.totalSqFeet, 0);

	totalSqFeet.value = totalSqFeetData;
	return formattedNumber(totalSqFeet.value); // Round to two decimal places and convert to a formattedNumber
};
const calculateAvgSqfeetAmount = () => {
	const totalSqFeet = formRows.value.reduce((total, row) => total + row.totalSqFeet, 0);

	const totalAmount = formRows.value.reduce((total, row) => total + row.totalAmount, 0);
	if ((totalAmount > 0) && (totalSqFeet > 0)) {
		console.log("complete", totalAmount, totalSqFeet)
		return formattedNumber(formattedNumber(totalAmount) / formattedNumber(totalSqFeet)); // Round to two decimal places and convert to a formattedNumber
	} else {
		return formattedNumber(0); // Round to two decimal places and convert to a formattedNumber
	}
};

// Compute the total amount
const calculateTotalAmount = () => {
	const totalAmount = formRows.value.reduce((total, row) => total + row.totalAmount, 0);
	const totalAmountCalculated = formattedNumber(totalAmount) + formattedNumber(transportChargeData.value) + (((formattedNumber(totalAmount) + formattedNumber(transportChargeData.value)) * 18) / 100);

	return formattedNumber(totalAmountCalculated); // Round to two decimal places and convert to a formattedNumber
};
// Compute the total amount
const calculateCgst = () => {
	if (buyerState.value != null && buyerState.value.toLowerCase() == "karnataka") {
		const totalAmount = formRows.value.reduce((total, row) => total + row.totalAmount, 0);
		totalCgst.value = formattedNumber(((formattedNumber(totalAmount) + formattedNumber(transportChargeData.value)) * 9) / 100);
		return totalCgst.value; // Round to two decimal places and convert to a formattedNumber
	} else {
		return formattedNumber(parseFloat(0));
	}
};
const calculateIgst = () => {
	if (buyerState.value != null && buyerState.value.toLowerCase() != "karnataka") {
		const totalAmount = formRows.value.reduce((total, row) => total + row.totalAmount, 0);
		totalIgst.value = formattedNumber(((formattedNumber(totalAmount) + formattedNumber(transportChargeData.value)) * 18) / 100);
		return totalIgst.value; // Round to two decimal places and convert to a formattedNumber
	} else {
		return parseFloat(0).toFixed(2);
	}
};
// Compute the total amount
const calculateSgst = () => {
	if (buyerState.value != null && buyerState.value.toLowerCase() == "karnataka") {
		const totalAmount = formRows.value.reduce((total, row) => total + row.totalAmount, 0);
		totalSgst.value = formattedNumber(((formattedNumber(totalAmount) + formattedNumber(transportChargeData.value)) * 9) / 100);
		return totalSgst.value; // Round to two decimal places and convert to a number
	} else {
		return parseFloat(0).toFixed(2);
	}

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
			// this.$refs.myForm.reset();
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
				gst.value = data.data.gst;
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
	gst.value = ref(null);
};

// product_div
const submitBill = async () => {
	$q.loading.show({
		message: "Some important process  is in progress. Hang on...",
	});
	const billData = {
		mobile: buyerNumber.value,
		products: formRows.value,
		is_same: recipient.value,
		recipient_name: recipientName.value,
		recipient_mobile: recipientMobile.value,
		e_way_bill_no: eWayBill.value,
		eWayBillDate: eWayBillDate.value,
		e_way_bill_valid_date: validDate.value,
		supply_type: selectedSupplyType.value,
		discount: discount.value,
		transportCharge: transportChargeData.value,
		cash_recieved: cashReceived.value,
		totalCgst: totalCgst.value,
		totalSgst: totalSgst.value,
		totalIgst: totalIgst.value,
		totalSqFeet: totalSqFeet.value,
		rundOfAmount: rundOfAmountData.value,
	}
	try {
		const headers = {
			Authorization: `Bearer ${token}`,
		};
		const response = await api.post("/api/admin/bill/create", billData, { headers });
		if (response.data.status) {
			$q.loading.hide();
			persistent.value = true;
			billId.value = response.data.bill_id;
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
	selectedSupplyType.value = "B2B";
	recipientName.value = null;
	recipientMobile.value = null;
	buyerCity.value = '';
	isShow.value = false;
	recipient.value = '1';
	eWayBill.value = null;
	eWayBillDate.value = null;
	validDate.value = null;
	discount.value = 0;
	cashReceived.value = 0;
	totalAmountCalculated.value = 0;
	transportChargeData.value = 0;
	transportCharge.value = 0;
	buyerID.value = null;
	buyerEmail.value = null;
	buyerState.value = null;
	buyerPin.value = null;
	buyerAddress.value = null;
	totalCgst.value = 0;
	totalSgst.value = 0;
	totalIgst.value = 0;
	totalSqFeet.value = 0;
	rundOfAmountData.value = 0;
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

.q-card__section--vert {
	padding: 4px !important;
}
</style>
