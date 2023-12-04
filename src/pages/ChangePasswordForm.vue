<template>
<div class="row">
    <div class="col">
      <div class="q-pa-md items-start q-gutter-md">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">Change Password</div>
          </q-card-section>


          <q-card-section class="q-pa-md">
            <div class="q-pa-md example-row-column-width">
                <form @submit.prevent="changePassword">
                  <div class="">
                    <label class="label-class" for="current_password"> Current Password</label>
                    <q-input
                      outlined
                      v-model="current_password"
                      type="text"
                      id="current_password"
                      label=" Current Password"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please Enter Current Password']"
                      required/>
                  </div>

                  <div class="">
                    <label class="label-class" for="current_password"> New Password</label>
                    <q-input
                      outlined
                      v-model="new_password"
                      type="text"
                      id="new_password"
                      label=" New Password"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please Enter New Password']"
                      required/>
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
const current_password = ref(null);
const new_password = ref(null);
const store = useStore();


const token = store.getters['auth/getToken'];
console.log(token);


async function changePassword() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    admin_id: 1,
    current_password: current_password.value,
    new_password: new_password.value,
  };



  await api
    .post('/api/admin/change_password', data , {
      headers: {
            Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      $q.loading.hide()
      $q.dialog({
        title: 'Success',
        message:  data.data.message
      })
      this.$refs.myForm.reset();
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
</style>

