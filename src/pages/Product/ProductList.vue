<template>
  <div class="q-pa-md q-product">
    <q-btn color="primary" to="/product" label="Add New Product" />
  </div>
  <div class="row items-start">
    <q-card :class="{ 'my-card-product': !$q.platform.is.mobile, 'mobile-card-product': $q.platform.is.mobile }"
      v-for="item in items" :key="item.id">
      <img :src="item.image" class="pic" />

      <p class="writeup">{{ item.height }}</p>
      <!-- <p class="writeup">88888</p> -->
      <img src="../../../public/images/3.png" class="arrow" />
      <img src="../../../public/images/3.png" class="arrow1" />
      <p class="high">{{ item.width }}</p>
      <!-- <p class="high">88888</p> -->
      <img src="../../../public/images/3.png" class="arrow2" />
      <img src="../../../public/images/3.png" class="arrow3" />
      <q-card-section>
        <p><b>{{ item.name }}</b></p>
        <p><b>Location : </b><br>{{ item.location ?? "Not Given" }}</p>
        <p><b>Glass: </b>{{ item.glass_mm ?? 0 }} MM</p>
        <p><b>Quotation Price: </b>₹ {{ item.total_price ? parseFloat(item.total_price).toFixed(2) : 0.00 }} </p>
        <p><b>Billing Price: </b>₹ {{ item.billing_price ? parseFloat(item.billing_price).toFixed(2) : 0.00 }} </p>
        <!-- <p>
          <b>Height x Width : {{ item.height }} x {{ item.width }}</b>
        </p>
        <p>
          <b>Category : {{ item.category_name }}</b>
        </p> -->
        <div class="row justify-between">
          <div class="col-5">
            <q-btn size="12px" @click="viewData(item)" label="View Details" outline color="purple" />
          </div>
          <div class="col-5">
            <q-btn size="12px" @click="updateData(item)" label="Edit Data" outline color="purple" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <!-- Edit Modal -->
  <q-dialog v-model="showEditModal" full-width>
    <q-card flat bordered :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }">
      <q-card-section>
        <div class="text-h6">Edit Product</div>
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div class="q-pa-md example-row-column-width">
          <form @submit.prevent="submitData">
            <div class="row">
              <div class="col-6 product_media q-pa-md">
                <label class="label-class" for="productName">Product Name</label>
                <q-input outlined v-model="formData.productName" type="text" label="Product Name"
                  :error-message="formData.apiValidationErrors?.product_name?.[0]"
                  :error="formData.apiValidationErrors?.product_name?.length > 0" />
              </div>

              <div class="col-2 product_media q-pa-md" v-if="priceShow">
                <label class="label-class" for="price">Quotation Price</label>
                <q-input outlined v-model="price" type="number" id="price" label="Quotation Price" readonly />
              </div>
              <div class="col-2 product_media q-pa-md" v-if="priceShow">
                <label class="label-class" for="price">Billing Price</label>
                <q-input outlined v-model="billingPrice" type="number" label="Billing Price" readonly />
              </div>
              <div class="col-2 product_media q-pa-md" v-if="priceShow">
                <label class="label-class" for="price">Total Sq Feet</label>
                <q-input outlined v-model="totalSqFeet" type="number" label="Total Sq Feet" readonly />
              </div>
            </div>
            <div class="row">
              <div class="col-6 product_media">
                <div class="row">
                  <div class="col-6 product_media q-pa-md">
                    <label for="selectMaterial">Material:</label>
                    <q-select v-model="formData.selectMaterial" @update:modelValue="handleChangeHeightWidth"
                      :options="materials" :option-value="'id'" :option-label="'name'" label="Select Material"
                      name="selectMaterial" emit-value map-options
                      :error-message="formData.apiValidationErrors?.material_id?.[0]"
                      :error="formData.apiValidationErrors?.material_id?.length > 0"></q-select>
                  </div>
                  <div class="col-6 product_media q-pa-md">
                    <label for="glass_mm">Glass MM:</label>
                    <q-select v-model="formData.selectGlassmm" :options="glass_mms" :option-value="'id'"
                      :option-label="'name'" label="Select Glass MM" name="selectGlassmm"
                      @update:modelValue="updateSelectedOptionTextGlassMM" emit-value map-options
                      :error-message="formData.apiValidationErrors?.glass_mm_id?.[0]"
                      :error="formData.apiValidationErrors?.glass_mm_id?.length > 0"></q-select>
                  </div>
                </div>
              </div>
              <div class="col-6 product_media">
                <div class="row">
                  <div class="col-6 product_media q-pa-md">
                    <label class="label-class" for="productHeight">Product Height</label>
                    <q-input outlined v-model="formData.productHeight" type="number" label="Product Height"
                      @blur="handleChangeHeightWidth" lazy-rules
                      :error-message="formData.apiValidationErrors?.height?.[0]"
                      :error="formData.apiValidationErrors?.height?.length > 0" />
                  </div>
                  <!-- <p class="para">X</p> -->
                  <div class="col-6 product_media q-pa-md">
                    <label class="label-class" for="productWidth">Product Width</label>
                    <q-input outlined v-model="formData.productWidth" type="number" label="Product Width"
                      @blur="handleChangeHeightWidth" :error-message="formData.apiValidationErrors?.width?.[0]"
                      :error="formData.apiValidationErrors?.width?.length > 0" />
                  </div>
                </div>
              </div>
            </div>


            <div class="row">
              <div class="col-3 product_media q-pa-md">
                <label for="glass_mm">Brand:</label>
                <q-select v-model="formData.selectBrand" :options="brands" :option-value="'id'" :option-label="'name'"
                  label="Select Brand" name="selectBrand" emit-value map-options
                  :error-message="formData.apiValidationErrors?.brand_id?.[0]"
                  :error="formData.apiValidationErrors?.brand_id?.length > 0"></q-select>
              </div>
              <div class="col-3 product_media q-pa-md">
                <label for="selectCategory">Category:</label>
                <q-select v-model="formData.selectCategory" :options="categories" :option-value="'id'"
                  :option-label="'name'" label="Select Category" name="selectCategory" emit-value map-options
                  :error-message="formData.apiValidationErrors?.category_id?.[0]"
                  :error="formData.apiValidationErrors?.category_id?.length > 0"></q-select>
              </div>
              <div class="col-6 product_media q-pa-md">
                <label class="label-class" for="productLocation">Location</label>
                <q-input outlined v-model="formData.productLocation" type="text" id="name" label="Location"
                  :error-message="formData.apiValidationErrors?.location?.[0]"
                  :error="formData.apiValidationErrors?.location?.length > 0" />
              </div>
            </div>

            <div class="row justify-between">

            </div>

            <div class="row">
              <div class="col-6 product_media q-pa-md">
                <div class="">
                  <label class="label-class" for="hsn_code">HSN Code</label>
                  <q-input outlined v-model="formData.hsn_code" type="text" id="name" label="HSN Code"
                    :error-message="formData.apiValidationErrors?.hsn_code?.[0]"
                    :error="formData.apiValidationErrors?.hsn_code?.length > 0" />
                </div>

              </div>
              <div class="col-6 product_media q-pa-md">
                <div class="">
                  <label class="label-class" for="productAccesories">Accesories</label>
                  <q-input outlined v-model="formData.productAccesories" type="text" id="name" label="Accesories"
                    :error-message="formData.apiValidationErrors?.accessories?.[0]"
                    :error="formData.apiValidationErrors?.accessories?.length > 0" />
                </div>

              </div>
            </div>
            <div class="">
              <label class="label-class" for="productDesc">Product Description</label>
              <q-input outlined v-model="formData.productDesc" type="textarea" id="name" label="Product Description"
                :error-message="formData.apiValidationErrors?.desc?.[0]"
                :error="formData.apiValidationErrors?.desc?.length > 0" />
            </div>
            <div class="row">
              <div class="col-5">
                <label class="label-class" for="productImage">Product Image</label>
                <q-uploader style="width: 100%" url="" extensions=".gif,.jpg,.jpeg,.png" @added="handleImageChange"
                  @removed="clearImage" max-files="1" hide-upload-btn />
              </div>
            </div>
            <!-- <img :src="imageUrl" alt="Selected Image" v-if="imageUrl" /> -->

            <div class="q-pa-md q-gutter-sm">
              <q-btn color="primary" type="submit" label="Submit" />
              <q-btn color="red" @click="showEditModal = false" label="Close" />
            </div>
          </form>
        </div>
      </q-card-section>
      <q-separator inset />
    </q-card>
  </q-dialog>

  <!-- Details Modal -->
  <q-dialog v-model="showDetailsModal">
    <q-card flat bordered :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }">
      <q-card-section>
        <div class="text-h6">Product Details</div>
      </q-card-section>
      <div class="example-row-column-width">
        <div class="row">
          <div class="col-9 product_media q-pa-md">
            <q-card flat bordered
              :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }">
              <q-card-section>
                <p class="product_p"><b class="product_label">Product Name: </b> {{ productData.name }}</p><br>
                <p class="product_p"><b class="product_label">Product HSN Code: </b> {{ productData.hsn_code }}</p><br>
                <p class="product_p"><b class="product_label">Height x Width: </b>{{ productData.height }} x
                  {{ productData.width }}</p><br>
                <p class="product_p"><b class="product_label">Product Glass MM: </b>{{ productData.glass_mm }}</p><br>
                <p class="product_p"><b class="product_label">Product Brand: </b>{{ productData.brand }}</p><br>
                <p class="product_p"><b class="product_label">Product Category: </b>{{ productData.category_name }}</p><br>
                <p class="product_p"><b class="product_label">Product Material: </b>{{ productData.material_name }}</p><br>
                <p class="product_p"><b class="product_label">Product Total Sq Feet: </b>{{ productData.area_sqfeet
                  ? productData.area_sqfeet.toFixed(2) : 0.00 }}</p><br>
                <p class="product_p"><b class="product_label">Quotation Price: </b>₹ {{ productData.total_price ?
                  productData.total_price.toFixed(2) : 0.00 }}</p><br>
                <p class="product_p"><b class="product_label">Billing Price: </b>₹ {{ productData.billing_price ?
                  productData.billing_price.toFixed(2) : 0.00 }}</p><br>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3 product_media q-pa-md">
            <q-card flat bordered
              :class="{ 'mobile-style-card': $q.platform.is.mobile, 'my-card': !$q.platform.is.mobile }">
              <q-card-section>
                <img :src="productData.image" class="details_demo" />
                <p class="details_writeup">{{ productData.height }}</p>
                <img src="../../../public/images/3.png" class="details_arrow" />
                <img src="../../../public/images/3.png" class="details_arrow1" />
                <p class="details_high">{{ productData.width }}</p>
                <!-- <p class="high">88888</p> -->
                <img src="../../../public/images/3.png" class="details_arrow2" />
                <img src="../../../public/images/3.png" class="details_arrow3" />
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 q-pa-md">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <p class="product_p"><b class="product_label">Location: </b>{{ productData.location }}</p><br>
                <p class="product_p"><b class="product_label">Accesories: </b>{{ productData.Accesories }}</p><br>
                <p class="product_p"><b class="product_label">Description: </b></p><br>
                <div class="row">
                  <div class="col-12">
                    <q-card flat bordered class="my-card">
                      <q-card-section>
                        <p style="word-break: break-all;">{{ productData.description }}</p>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn color="red" @click="showDetailsModal = false" label="Close" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { api } from "boot/axios";
import { useQuasar } from "quasar";


const showEditModal = ref(false);
const showDetailsModal = ref(false);
const store = useStore();
const token = store.getters["auth/getToken"];
const $q = useQuasar();
const clearImage = ref(null);
const priceShow = ref(true);

const items = ref(null);

const formData = ref({
  id: '',
  productName: '',
  hsn_code: '',
  productHeight: '',
  productWidth: '',
  selectGlassmm: '',
  selectBrand: '',
  selectCategory: '',
  selectMaterial: '',
  productLocation: '',
  productAccesories: '',
  productDesc: '',
  productImage: '',
  apiValidationErrors: null,
  glassMmText: ''
});

const productID = ref(null);
const productName = ref(null);
const productHeight = ref(null);
const productWidth = ref(null);
const glass_mms = ref(null);
const selectGlassmm = ref(null);
const selectBrand = ref(null);
const brands = ref(null);
const selectCategory = ref(null);
const categories = ref(null);
const selectMaterial = ref(null);
const materials = ref(null);
const productCode = ref(null);
const productLocation = ref(null);
const productAccesories = ref(null);
const productDesc = ref(null);
const previewImage = ref(null);
const productImage = null;
const imageUrl = ref(null);
const price = ref(0);
const billingPrice = ref(0);
const totalSqFeet = ref(null);
const productData = ref(null);

const fetchProducts = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await api.get("/api/admin/product/list", { headers });
    items.value = response.data.data;
  } catch (error) {
    console.error("Error fetching gallery items:", error);
  }
};

onMounted(async () => {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  });
  await fetchProducts();
  await fetchGlassMM();
  await fetchBrand();
  await fetchCategory();
  await fetchMaterial();
  $q.loading.hide();
});

const fetchGlassMM = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await api.get("/api/admin/glass_mm/dropDownProduct", { headers });
    glass_mms.value = response.data.data;
  } catch (error) {
    console.error("Error fetching options:", error);
  }
};
const fetchBrand = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await api.get("/api/admin/brand/dropDown", { headers });
    brands.value = response.data.data;
  } catch (error) {
    console.error("Error fetching options:", error);
  }
};
const fetchCategory = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await api.get("/api/admin/category/dropDown", { headers });
    categories.value = response.data.data;
  } catch (error) {
    console.error("Error fetching options:", error);
  }
};
const fetchMaterial = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await api.get("/api/admin/material/dropDownProduct", { headers });
    // const response = await api.get("/api/admin/material/dropDown", { headers });
    materials.value = response.data.data;
  } catch (error) {
    console.error("Error fetching options:", error);
  }
};

async function updateData(data) {
  formData.value.id = data.id;
  formData.value.productName = data.name;
  formData.value.hsn_code = data.hsn_code;
  formData.value.productHeight = data.height;
  formData.value.productWidth = data.width;
  formData.value.selectGlassmm = Number(data.glass_mm_id);
  formData.value.selectBrand = Number(data.brand_id);
  formData.value.selectCategory = Number(data.category_id);
  formData.value.selectMaterial = Number(data.material_id);
  formData.value.productCode = data.item_code;
  formData.value.productLocation = data.location;
  formData.value.productAccesories = data.Accesories;
  formData.value.productDesc = data.description;
  formData.value.glassMmText = data.glass_mm;
  await fetchPrice();
  showEditModal.value = true;
}

async function viewData(data) {
  productData.value = data;
  showDetailsModal.value = true;
}

async function submitData() {
  const data = {
    product_id: formData.value.id,
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
    image: formData.value.productImage,
  };

  console.log(data);
  if (price.value == null && totalSqFeet.value == null) {
    $q.loading.hide();
    $q.dialog({
      title: 'Error',
      message: 'Price Not Mapped'
    });
    return
  } else {


    await api
      .post("/api/admin/product/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => {
        if (data.status == true) {
          $q.notify({
            message: "Data Updated Successfully",
            color: "green",
            position: "center",
          });
          // categoryName.value = null
          showEditModal.value = false;
          fetchProducts();
        } else {
          $q.notify({
            message: "Validation Errors",
            color: "red",
            position: "center",
          });
        }
      })
      .catch((error) => {
        $q.loading.hide();
        if (error.response && error.response.status === 422) {
          $q.dialog({
            title: 'Error',
            message: error.response.data.message
          })
          formData.value.apiValidationErrors = error.response.data.errors;
        } else {
          console.log('Error:', error.response.status);
        }
      })
      .finally(() => {
        $q.loading.hide();
      });
  }
}

const closeModal = () => {
  showEditModal.value = false;
  showDetailsModal.value = false;
  productID.value = ref(null);
  productName.value = ref(null);
  productHeight.value = ref(null);
  productWidth.value = ref(null);
  selectGlassmm.value = ref(null);
  selectBrand.value = ref(null);
  selectCategory.value = ref(null);
  selectMaterial.value = ref(null);
  productCode.value = ref(null);
  productLocation.value = ref(null);
  productAccesories.value = ref(null);
  productDesc.value = ref(null);
  previewImage.value = ref(null);
  const productImage = null;
  imageUrl.value = ref(null);
};

const handleImageChange = (event) => {
  try {
    // console.log(event[0]);
    formData.value.productImage = event[0];
    console.log(formData.value.productImage);
  } catch (error) {
    console.error('Error in handleImageChange:', error);
    // Handle the error as needed, e.g., display an error message to the user
  }
};

const updateSelectedOptionTextGlassMM = (newValue) => {
  const selectedOption = glass_mms.value.find(option => option.id === newValue);
  if (selectedOption) {
    formData.value.glassMmText = selectedOption.name;
    handleChangeHeightWidth();
  } else {
    formData.value.glassMmText = ''; // No option selected
  }
};

const handleChangeHeightWidth = async () => {
  console.log(formData.value.glassMmText);
  if (formData.value.productHeight && formData.value.productWidth && formData.value.glassMmText && isNumeric(formData.value.productHeight) && isNumeric(formData.value.productWidth)) {
    await fetchPrice();
    console.log("called Inside");
  }
};


const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
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
      .post('/api/admin/product/fetch_price', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(({ data }) => {
        $q.loading.hide()
        if (data.status) {
          if (data.price != null) {

            const { productHeight, productWidth, glassMmText, mmToFeetConversion = 89999 } = formData.value || {};
            totalSqFeet.value = ((productHeight * productWidth) / mmToFeetConversion).toFixed(2);
            // // Calculate area in square feet considering glass thickness
            price.value = parseFloat(totalSqFeet.value * data.price).toFixed(2);
            billingPrice.value = parseFloat(totalSqFeet.value * data.billing_price).toFixed(2);
            priceShow.value = true;
          } else {
            priceShow.value = false;
            totalSqFeet.value = null;
            price.value = null;
            $q.dialog({
              title: 'Error',
              message: 'Price Not Mapped'
            })
          }
        } else {
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
          console.log('Error:', error.response.status);
        }
      })
      .finally(() => {
        $q.loading.hide()
      });
  } catch (error) {
    console.log('Error fetching options:', error);
  }
};


</script>

<style scoped>
.my-card-product {
  width: 31% !important;
  background-color: white !important;
  box-shadow: 2px 2px 6px #8080806b !important;
  border: 1px solid #1976d240 !important;
  margin: 10px;
}

.my-card-product-edit {
  width: 90% !important;
  background-color: white !important;
  box-shadow: 2px 2px 6px #8080806b !important;
  border: 1px solid #1976d240 !important;
  margin: 10px;
}

.mobile-card-product {
  width: 91% !important;
  background-color: white !important;
  box-shadow: 2px 2px 6px #8080806b !important;
  border: 1px solid #1976d240 !important;
  margin: 10px;
}

.q-product {
  padding: 20px px;
  border: 1px solid #ffd4d4;
  margin: 10px;
  border-radius: 10px;
}

.pic {
  padding: 30px;
  height: 225px;
}

.writeup {
  writing-mode: vertical-lr;
  text-orientation: upright;
  position: absolute;
  top: 78px;
  left: 5px;
}

.high {
  position: absolute;
  top: 200px;
  left: 120px;
  letter-spacing: 3px;
}

.para {
  padding-top: 38px;
}

.row-padding {
  padding-bottom: 20px;
}

.hidden-input {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
}

.arrow {
  position: absolute;
  top: 19px;
  width: 32px !important;
  height: 65px;
}

.arrow1 {
  position: absolute;
  top: 147px;
  width: 32px !important;
  height: 59px;
  transform: rotate(180deg);
}

.arrow2 {
  position: absolute;
  top: 182px;
  width: 32px !important;
  height: 60px;
  left: 35px;
  transform: rotate(270deg);
}

.arrow3 {
  position: absolute;
  top: 182px;
  width: 32px !important;
  height: 60px;
  left: 245px;
  transform: rotate(90deg);
}

.details_demo {
  margin-left: 30px;
  height: 220px;
  width: 220px;
}

.details_arrow {
  position: absolute;
  top: 6px;
  width: 32px !important;
  height: 65px;
  left: 11px;
}

.details_arrow1 {
  position: absolute;
  top: 186px;
  width: 32px !important;
  height: 59px;
  left: 11px;
  transform: rotate(180deg);
}

.details_arrow2 {
  position: absolute;
  top: 215px;
  width: 32px !important;
  height: 60px;
  left: 51px;
  transform: rotate(270deg);
}

.details_arrow3 {
  position: absolute;
  top: 215px;
  width: 32px !important;
  height: 60px;
  left: 230px;
  transform: rotate(90deg);
}

.details_writeup {
  writing-mode: vertical-lr;
  text-orientation: upright;
  position: absolute;
  top: 93px;
  left: 16px;
}

.details_high {
  position: absolute;
  top: 236px;
  left: 130px;
  letter-spacing: 3px;
}

.product_p {
  margin: 0 0 -9px !important;
  font-size: 17px;
}

.product_label {
  color: #1976d2;
}

@media (max-width: 576px) {
  .product_media {
    width: 100%;
  }
}
</style>
