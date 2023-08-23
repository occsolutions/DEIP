
import Alert from './alert.vue'
import AsyncBtn from './async-btn.vue'
import BackupAvailability from './backup-availability.vue'
import ChipStatus from './chip-status.vue'
import ColorCard from './color-card.vue'
import ColorPicker from './color-picker.vue'
import ConfirmationModal from './confirmation-modal.vue'
import ConfirmLogout from './confirm-logout.vue'
import ConfirmSpendDialog from './dialogs/confirm-spend.vue'
import DataTable from './data-table.vue'
import DatePicker from './date-picker.vue'
import DateRangeFilter from './date-range-filter.vue'
import DualList from './dual-list.vue'
import ErrorPage from './error-page.vue'
import FileUpload from './file-upload.vue'
import HelpModal from './help-modal.vue'
import Info from './info.vue'
import InputsAutocomplete from './inputs/autocomplete.vue'
import InputsCheckbox from './inputs/checkbox.vue'
import InputsInput from './inputs/input.vue'
import InputsSelect from './inputs/select.vue'
import InputsToken from './inputs/input-token.vue'
import Loading from './loading.vue'
import Navigation from './navigation/navigation.vue'
import StatusBox from './status-box.vue'
import Stepper from './stepper.vue'

import InfoDialog from './dialogs/info-dialogs.vue'
import TechnicalRequirements from './technical-requirements.vue'

const components = [
  { key: 'Alert', component: Alert },
  { key: 'AsyncBtn', component: AsyncBtn },
  { key: 'BackupAvailability', component: BackupAvailability },
  { key: 'ChipStatus', component: ChipStatus },
  { key: 'ColorCard', component: ColorCard },
  { key: 'ColorPicker', component: ColorPicker },
  { key: 'ConfirmationModal', component: ConfirmationModal },
  { key: 'ConfirmLogout', component: ConfirmLogout },
  { key: 'ConfirmSpendDialog', component: ConfirmSpendDialog },
  { key: 'DataTable', component: DataTable },
  { key: 'DatePicker', component: DatePicker },
  { key: 'DateRangeFilter', component: DateRangeFilter },
  { key: 'DualList', component: DualList },
  { key: 'ErrorPage', component: ErrorPage },
  { key: 'FileUpload', component: FileUpload },
  { key: 'HelpModal', component: HelpModal },
  { key: 'Info', component: Info },
  { key: 'InputsAutocomplete', component: InputsAutocomplete },
  { key: 'InputsCheckbox', component: InputsCheckbox },
  { key: 'InputsInput', component: InputsInput },
  { key: 'InputsSelect', component: InputsSelect },
  { key: 'InputsToken', component: InputsToken },
  { key: 'Loading', component: Loading },
  { key: 'Navigation', component: Navigation },
  { key: 'StatusBox', component: StatusBox },
  { key: 'Stepper', component: Stepper },
  { key: 'InfoDialog', component: InfoDialog },
  { key: 'TechnicalRequirements', component: TechnicalRequirements }
]

export default (vue: any) => {
  const prefix = 'X'
  components.forEach((component) => {
    vue.component(`${prefix}${component.key}`, component.component)
  })
}
