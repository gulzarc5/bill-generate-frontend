<template>
  <div class="q-pa-md items-start q-gutter-md">
    <q-card flat bordered class="my-card product-body">
      <q-card-section>
        <div class="text-h6">Add Product</div>
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div class="q-pa-md example-row-column-width">
          <form @submit.prevent="addProduct">
            <div class="row">
              <div class="col-md-6 col-sm-6 col-xs-12 q-pa-md">
                <label class="label-class" for="productName"
                  >Product Name</label
                >
                <q-input
                  outlined
                  v-model="formData.productName"
                  type="text"
                  label="Product Name"
                  :error-message="formData.apiValidationErrors?.product_name?.[0]"
                  :error="formData.apiValidationErrors?.product_name?.length > 0"
                />
              </div>

              <div class="col-md-2 col-sm-6 col-xs-12 q-pa-md" v-if="priceShow">
                  <label class="label-class" for="price"
                    >Quotation Price</label
                  >
                  <q-input
                    outlined
                    v-model="price"
                    type="number"
                    id="price"
                    label="Quotation Price"
                    readonly
                  />
              </div>
              <div class="col-md-2 col-sm-6 col-xs-12 q-pa-md" v-if="priceShow">
                  <label class="label-class" for="price"
                    >Billing Price</label
                  >
                  <q-input
                    outlined
                    v-model="billingPrice"
                    type="number"
                    label="Billing Price"
                    readonly
                  />
              </div>
              <div class="col-md-2 col-sm-6 col-xs-12 q-pa-md" v-if="priceShow">
                  <label class="label-class" for="price"
                    >Total Sq Feet</label
                  >
                  <q-input
                    outlined
                    v-model="totalSqFeet"
                    type="number"
                    label="Total Sq Feet"
                    readonly
                  />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="row">
                  <div class="col-md-6 col-sm-6 col-xs-12 q-pa-md">
                      <label for="selectMaterial">Material:</label>
                      <q-select
                        v-model="formData.selectMaterial"
                        @update:modelValue="handleChangeHeightWidth"
                        :options="materials"
                        :option-value="'id'"
                        :option-label="'name'"
                        label="Select Material"
                        name="selectMaterial"
                        emit-value
                        map-options
                        :error-message="formData.apiValidationErrors?.material_id?.[0]"
                        :error="formData.apiValidationErrors?.material_id?.length > 0"
                      ></q-select>
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12 q-pa-md">
                      <label for="glass_mm">Glass MM:</label>
                      <q-select
                        v-model="formData.selectGlassmm"
                        :options="glass_mms"
                        :option-value="'id'"
                        :option-label="'name'"
                        label="Select Glass MM"
                        name="selectGlassmm"
                        @update:modelValue="updateSelectedOptionTextGlassMM"
                        emit-value
                        map-options
                        :error-message="formData.apiValidationErrors?.glass_mm_id?.[0]"
                        :error="formData.apiValidationErrors?.glass_mm_id?.length > 0"
                      ></q-select>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="row">
                  <div class="col-md-6 col-sm-6 col-xs-12 q-pa-md">
                    <label class="label-class" for="productHeight"
                      >Product Height</label
                    >
                    <q-input
                      outlined
                      v-model="formData.productHeight"
                      type="number"
                      label="Product Height"
                      @blur="handleChangeHeightWidth"
                      lazy-rules
                      :error-message="formData.apiValidationErrors?.height?.[0]"
                      :error="formData.apiValidationErrors?.height?.length > 0"
                    />
                  </div>
                  <!-- <p class="para">X</p> -->
                  <div class="col-md-6 col-sm-6 col-xs-12 q-pa-md">
                    <label class="label-class" for="productWidth"
                      >Product Width</label
                    >
                    <q-input
                      outlined
                      v-model="formData.productWidth"
                      type="number"
                      label="Product Width"
                      @blur="handleChangeHeightWidth"
                      :error-message="formData.apiValidationErrors?.width?.[0]"
                      :error="formData.apiValidationErrors?.width?.length > 0"
                    />
                  </div>
                </div>
              </div>
            </div>


            <div class="row">
              <div class="col-md-3 col-sm-6 col-xs-12 q-pa-md">
                <label for="glass_mm">Brand:</label>
                <q-select
                  v-model="formData.selectBrand"
                  :options="brands"
                  :option-value="'id'"
                  :option-label="'name'"
                  label="Select Brand"
                  name="selectBrand"
                  emit-value
                  map-options
                  :error-message="formData.apiValidationErrors?.brand_id?.[0]"
                  :error="formData.apiValidationErrors?.brand_id?.length > 0"
                ></q-select>
              </div>
              <div class="col-md-3 col-sm-6 col-xs-12 q-pa-md">
                <label for="selectCategory">Category:</label>
                <q-select
                  v-model="formData.selectCategory"
                  :options="categories"
                  :option-value="'id'"
                  :option-label="'name'"
                  label="Select Category"
                  name="selectCategory"
                  emit-value
                  map-options
                  :error-message="formData.apiValidationErrors?.category_id?.[0]"
                  :error="formData.apiValidationErrors?.category_id?.length > 0"
                ></q-select>
              </div>
              <div class="col-md-6 col-sm-6 col-xs-12 q-pa-md">
                <label class="label-class" for="productLocation"
                  >Location</label
                >
                <q-input
                  outlined
                  v-model="formData.productLocation"
                  type="text"
                  id="name"
                  label="Location"
                  :error-message="formData.apiValidationErrors?.location?.[0]"
                  :error="formData.apiValidationErrors?.location?.length > 0"
                />
              </div>
            </div>

            <div class="row justify-between">

            </div>

            <div class="row">
              <div class="col-md-6 col-sm-6 col-xs-12 q-pa-md">
                <div class="">
                  <label class="label-class" for="hsn_code"
                    >HSN Code</label
                  >
                  <q-input
                    outlined
                    v-model="formData.hsn_code"
                    type="text"
                    id="name"
                    label="HSN Code"
                    :error-message="formData.apiValidationErrors?.hsn_code?.[0]"
                    :error="formData.apiValidationErrors?.hsn_code?.length > 0"
                  />
                </div>

              </div>
              <div class="col-md-6 col-sm-6 col-xs-12 q-pa-md">
                <div class="">
                  <label class="label-class" for="productAccesories"
                    >Accesories</label
                  >
                  <q-input
                    outlined
                    v-model="formData.productAccesories"
                    type="text"
                    id="name"
                    label="Accesories"
                    :error-message="formData.apiValidationErrors?.accessories?.[0]"
                    :error="formData.apiValidationErrors?.accessories?.length > 0"
                  />
                </div>

              </div>
            </div>
            <div class="">
              <label class="label-class" for="productDesc"
                >Product Description</label
              >
              <q-input
                outlined
                v-model="formData.productDesc"
                type="textarea"
                id="name"
                label="Product Description"
                :error-message="formData.apiValidationErrors?.desc?.[0]"
                :error="formData.apiValidationErrors?.desc?.length > 0"
              />
            </div>
            <div class="row">
                <div class="col-md-5 col-sm-6 col-xs-12">
                <label class="label-class" for="productImage"
                  >Product Image</label
                >
                <q-uploader
                  url=""
                  extensions=".gif,.jpg,.jpeg,.png"
                  @added="handleImageChange"
                  @removed="clearImage"
                  max-files="1"
                  hide-upload-btn
                />
              </div>
            </div>
            <!-- <img :src="imageUrl" alt="Selected Image" v-if="imageUrl" /> -->

            <div class="q-pa-md q-gutter-sm">
              <q-btn color="primary" type="submit" label="Submit" />
            </div>
          </form>
        </div>
      </q-card-section>
      <q-separator inset />
    </q-card>
  </div>
</template>

<style>
.para {
  padding-top: 38px;
}
.row-padding {
  padding-bottom: 20px;
}
</style>

<script setup>
import { reactive,ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'; // Import the useRouter function
import { useQuasar } from 'quasar';


const store = useStore();
const token = store.getters['auth/getToken'];
const $q = useQuasar()
const router = useRouter();
const priceShow = ref(false);
const price = ref(null);
const billingPrice = ref(null);
const totalSqFeet = ref(null);
const glassMmText = ref(null);
const glass_mms = ref(null);
const brands = ref(null);
const categories = ref(null);
const materials = ref(null);
const clearImage = ref(null);

const formData = ref({
    id:'',
    productName:'',
    hsn_code:'',
    productHeight:'',
    productWidth:'',
    selectGlassmm:'',
    selectBrand:'',
    selectCategory:'',
    selectMaterial:'',
    productLocation : '',
    productAccesories : '',
    productDesc : '',
    productImage : '',
    apiValidationErrors: null,
    glassMmText:''
});

const handleImageChange = (event) => {
  try {
    // console.log(event[0]);
    formData.value.productImage = event[0];
  } catch (error) {
    console.error('Error in handleImageChange:', error);
    // Handle the error as needed, e.g., display an error message to the user
  }
};
const updateSelectedOptionTextGlassMM = (newValue)=> {
  const selectedOption = glass_mms.value.find(option => option.id === newValue);
  if (selectedOption) {
    formData.value.glassMmText = selectedOption.name;
    handleChangeHeightWidth();
  } else {
    formData.value.glassMmText = ''; // No option selected
  }
};

const handleChangeHeightWidth = async() => {
  if (formData.value.productHeight && formData.value.productWidth && formData.value.glassMmText && isNumeric(formData.value.productHeight) && isNumeric(formData.value.productWidth) ) {
    await fetchPrice();
    console.log("called Inside");
  }
};

const isNumeric=(value) =>{
  return !isNaN(parseFloat(value)) && isFinite(value);
};

async function addProduct() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    product_name: formData.value.productName,
    hsn_code: formData.value.hsn_code,
    category_id: formData.value.selectCategory,
    material_id: formData.value.selectMaterial,
    height: formData.value.productHeight,
    width: formData.value.productWidth,
    glass_mm_id: formData.value.selectGlassmm,
    brand_id: formData.value.selectBrand,
    desc: formData.value.productDesc,
    location: formData.value.productLocation,
    accessories: formData.value.productAccesories,
    image:  formData.value.productImage,
  };
  if (price.value == null && totalSqFeet.value == null) {
    $q.loading.hide();
    $q.dialog({
      title: 'Error',
      message:  'Price Not Mapped'
    });
    return
  }else{
    

    await api
      .post('/api/admin/product/add', data , {
        headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
        }
      })
      .then(({ data }) => {
        $q.loading.hide()
        if (data.status == true) {
          router.push('/product/list');
          $q.notify({
            message: 'Data Added Successfully',
            color: 'green',
            position: 'center'
          })
          resetForm();
          // categoryName.value = null
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
            $q.dialog({
              title: 'Error',
              message:  error.response.data.message
            })
              formData.value.apiValidationErrors = error.response.data.errors;
          } else {
              console.log('Error:', error.response.status );
          }
      })
      .finally(() => {
        $q.loading.hide()
      });
  }
}

const fetchGlassMM = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/glass_mm/dropDownProduct', { headers });
    glass_mms.value = response.data.data;
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};
const fetchBrand = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/brand/dropDown', { headers });
    brands.value = response.data.data;
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};
const fetchCategory = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/category/dropDown', { headers });
    categories.value = response.data.data;
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};
const fetchMaterial = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    // const response = await api.get('/api/admin/material/dropDown', { headers });
    const response = await api.get('/api/admin/material/dropDownProduct', { headers });
    materials.value = response.data.data;
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};


const fetchPrice = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const data = {
      material_id: formData.value.selectMaterial,
      glass_mm_id: formData.value.selectGlassmm,
    };
    

    await api
      .post('/api/admin/product/fetch_price', data , {
        headers: {
              Authorization: `Bearer ${token}`
        }
      })
      .then(({ data }) => {
        $q.loading.hide()
        console.log(data);
        if (data.status) {
          if (data.price != null) {
            if (data.map_status) {
              const { productHeight, productWidth, glassMmText, mmToFeetConversion = 89999 } = formData.value || {};

              totalSqFeet.value = ((productHeight * productWidth)/mmToFeetConversion).toFixed(2);
              // // Calculate area in square feet considering glass thickness
              price.value = parseFloat(totalSqFeet.value*data.price).toFixed(2);
              billingPrice.value =  parseFloat(totalSqFeet.value*data.billing_price).toFixed(2);
              priceShow.value = true;

            } else {
              priceShow.value = false;
              totalSqFeet.value = null;
              price.value = null;
              $q.dialog({
                title: 'Error',
                message:  data.message,
              })
            }

          }else{
              priceShow.value = false;
              totalSqFeet.value = null;
              price.value = null;
              $q.dialog({
                title: 'Error',
                message:  data.message,
              })
          }
        }else{
          totalSqFeet.value = null;
          price.value = null;
          priceShow.value = false;
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
              // console.log(error.response.data.errors);
            } else {
              console.log('Error:', error.response.status );
            }
        })
      .finally(() => {
        $q.loading.hide()
      });
  } catch (error) {
    console.log('Error fetching options:', error);
  }
};



function resetForm () {
    formData.value = {
        id:'',
        productName:'',
        hsn_code:'',
        productHeight:'',
        productWidth:'',
        selectGlassmm:'',
        selectBrand:'',
        selectCategory:'',
        selectMaterial:'',
        productLocation : '',
        productAccesories : '',
        productDesc : '',
        productImage : '',
        apiValidationErrors: null,
    }
}

onMounted(async () => {
  await fetchGlassMM();
  await fetchBrand();
  await fetchCategory();
  await fetchMaterial();
});
</script>
<style>
.product-body {
  width: 100% !important;
}
</style>
