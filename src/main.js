import './assets/main.css'
import './assets/styles/components.css'
import './assets/styles/prime-overrides.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from './router' // Importa la función
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia'
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";
import Button from "primevue/button";
import Card from "primevue/card";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import Checkbox from "primevue/checkbox";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import FileUpload from "primevue/fileupload";
import FloatLabel from "primevue/floatlabel";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Menu from "primevue/menu";
import Rating from "primevue/rating";
import Row from "primevue/row";
import Drawer from "primevue/drawer";
import Tag from "primevue/tag";
import Textarea from "primevue/textarea";
import Toolbar from "primevue/toolbar";
import Toast from "primevue/toast";
import SelectButton from "primevue/selectbutton";
import Sidebar from "primevue/sidebar";
import Carousel from 'primevue/carousel';

const app = createApp(App)
const pinia = createPinia()

app.use(pinia);

app.use(PrimeVue)
    .use(ConfirmationService)
    .use(ToastService);

app.component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-column', Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-checkbox', Checkbox)
    .component('pv-data-table', DataTable)
    .component('pv-dialog', Dialog)
    .component('pv-select', Select)
    .component('pv-select-button', SelectButton)
    .component('pv-file-upload', FileUpload)
    .component('pv-float-label', FloatLabel)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-input-text', InputText)
    .component('pv-input-number', InputNumber)
    .component('pv-menu', Menu)
    .component('pv-rating', Rating)
    .component('pv-row', Row)
    .component('pv-drawer', Drawer)
    .component('pv-tag', Tag)
    .component('pv-textarea', Textarea)
    .component('pv-toolbar', Toolbar)
    .component('pv-toast', Toast)
    .component('pv-carousel', Carousel)
    .component('pv-sidebar', Sidebar);

// Crea el router después de Pinia
const router = createAppRouter()
app.use(router)
// Pinia

app.mount('#app')
