import CategoryList from './../pages/Category/CategoryList.vue';
import CategoryForm from './../pages/Category/CategoryForm.vue';
import GlassForm from './../pages/GlassMM/GlassForm.vue';
import GlassList from './../pages/GlassMM/GlassList.vue';
import BrandForm from './../pages/Brand/BrandForm.vue';
import BrandList from './../pages/Brand/BrandList.vue';
import BuyerForm from './../pages/Buyer/BuyerForm.vue';
import BuyerList from './../pages/Buyer/BuyerList.vue';
import QuotationList from './../pages/Quotation/QuotationList.vue';
import QuotationGenerate from './../pages/Quotation/GenerateQuatation.vue';
import PriceMapList from './../pages/PriceMap/PriceMapList.vue';
import BillView from './../pages/Bill/BillView.vue';
import BillList from './../pages/Bill/BillList.vue';
import BillGenerate from './../pages/Bill/BillGenerate.vue';
import ReportGenerate from './../pages/Report/ReportGenerate.vue';
import TransactionReport from './../pages/Report/TransactionReport.vue';


const routes = [
  {
    path: '/',
    component: () => import('pages/LoginPage2.vue'),
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'),meta: { requiresAuth: true }  },
      { path: '/category', component: CategoryForm,meta: { requiresAuth: true }   },
      { path: '/category/list', component:CategoryList,meta: { requiresAuth: true }},
      { path: '/glass_mm', component: GlassForm,meta: { requiresAuth: true }   },
      { path: '/glass_mm/list', component:GlassList,meta: { requiresAuth: true }},
      { path: '/brand', component: BrandForm,meta: { requiresAuth: true }   },
      { path: '/brand/list', component:BrandList,meta: { requiresAuth: true }},
      { path: '/buyer', component: BuyerForm,meta: { requiresAuth: true }   },
      { path: '/client/list', component:BuyerList,meta: { requiresAuth: true }},
      { path: '/price_list/list', component:PriceMapList,meta: { requiresAuth: true }},

      { path: '/quotation/list', component:QuotationList,meta: { requiresAuth: true }},
      { path: '/quotation/generate', component:QuotationGenerate,meta: { requiresAuth: true }},
      { path: '/bill/list', component:BillList,meta: { requiresAuth: true }},
      { path: '/bill/generate', component:BillGenerate,meta: { requiresAuth: true }},
      { path: '/bill_view/:billId', component:BillView,meta: { requiresAuth: true }},
      { path: '/report', component:ReportGenerate,meta: { requiresAuth: true }},
      { path: '/transaction', component:TransactionReport,meta: { requiresAuth: true }},

      { path: '/material', component: () => import('src/pages/Material/MaterialForm.vue'),meta: { requiresAuth: true }   },
      { path: '/material/list', component: () => import('src/pages/Material/MaterialList.vue'),meta: { requiresAuth: true }   },
      { path: '/product', component: () => import('src/pages/Product/ProductForm.vue'),meta: { requiresAuth: true }   },
      { path: '/product/list', component: () => import('src/pages/Product/ProductList.vue'),meta: { requiresAuth: true }   },      
      { path: '/sub_admin/list', component: () => import('src/pages/SubAdmin/SubAdminList.vue'),meta: { requiresAuth: true }   },
      { path: '/sub_admin', component: () => import('src/pages/SubAdmin/SubAdminForm.vue'),meta: { requiresAuth: true }   },
      { path: '/change_password', component: () => import('src/pages/ChangePasswordForm.vue'),meta: { requiresAuth: true }   },
      { path: '/quotation/:quotationId', component: () => import('src/pages/Quotation/QuotationDetails.vue'),meta: { requiresAuth: true } ,props: true,  }
    ]
  }
]
export default routes
