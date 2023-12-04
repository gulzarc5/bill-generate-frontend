<template>
<div class="row">
    <div class="col">
      <div class="q-pa-md items-start q-gutter-md">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">Add New Buyer</div>
          </q-card-section>


          <q-card-section class="q-pa-md">
            <div class="q-pa-md example-row-column-width">
                <form @submit.prevent="addBuyer">
                  <div class="">
                    <label for="name"> Name</label>
                    <q-input
                    v-model="name"
                    filled
                    id="name"
                    type="name"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please Enter Name']"
                    required
                    />
                  </div>
                  <div class="">
                    <label for="email"> Email</label>
                    <q-input
                    v-model="email"
                    filled id="email"
                    type="email"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please Enter Email']"
                    required
                    />
                  </div>
                  <div class="">
                    <label for="mobile"> Mobile</label>
                     <q-input
                      v-model="tel"
                      maxlength="10"
                      filled
                      type="tel"
                      id="mobile"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please Enter Mobile']"
                      required
                     />
                  </div>
                  <div class="">
                    <label for="mobile"> Gst Number</label>
                     <q-input
                      v-model="gst"
                      maxlength="10"
                      filled
                      type="text"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please Enter GST Number']"
                      required
                     />
                  </div>
                  <div class="">
                    <label for="state"> State</label>
                    <q-input
                      v-model="state"
                      filled
                      id="state"
                      type="text"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please Enter State']"
                      required
                    />
                  </div>
                  <div class="">
                    <label for="city"> City</label>
                    <q-input
                      v-model="city"
                      filled
                      id="city"
                      type="text"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please Enter City']"
                      required
                    />
                  </div>
                  <div class="">
                    <label for="pin"> Pin</label>
                    <q-input
                      v-model="pin"
                      filled
                      id="pin"
                      type="text"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please Enter Pin']"
                      required
                    />
                  </div>
                  <div class="">
                    <label for="address"> Address</label>
                    <q-input
                      v-model="address"
                      filled
                      id="address"
                      type="text"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please Enter Address']"
                      required
                    />
                  </div>


                  <div class="q-pa-md q-gutter-sm">
                    <q-btn color="primary" type="submit" label="Submit" />
                  </div>


                </form>
            </div>
          </q-card-section>
          <q-separator inset />
        </q-card>
      </div>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'; // Import the useRouter function
import { useQuasar } from 'quasar';


const router = useRouter(); // Get the router instance
const $q = useQuasar()
const name = ref(null);
const email = ref(null);
const tel = ref(null);
const state = ref(null);
const city = ref(null);
const pin = ref(null);
const address = ref(null);
const gst = ref(null);
const store = useStore();


const token = store.getters['auth/getToken'];


async function addBuyer() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    name: name.value,
    email: email.value,
    mobile: tel.value,
    state: state.value,
    city: city.value,
    pin: pin.value,
    address: address.value,
    gst: gst.value,
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
        // brandName.value = null
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

</script>

<style>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
.normal_gradient {
  background: linear-gradient(145deg, rgb(74, 94, 137) 15%, #b61924 70%);
}
.dark_gradient {
  background: linear-gradient(145deg, rgb(11, 26, 61) 15%, #4c1014 70%);
}
.login-form {
  position: absolute;
}
.my-card {
  width: 100% !important;
}
</style>

