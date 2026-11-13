<template>
  <v-container fluid class="pa-0 year-calendar-bg fill-height align-start">
    <v-container class="py-8 px-4 px-md-10 w-100 mt-4" style="max-width: 1400px;">
      <!-- Top Header Bar with Year Selector & Controls -->
      <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center mb-8 ga-4">
        <div>
          <h1 class="text-h4 font-weight-black text-white tracking-wide">
            {{ selectedMonth !== null ? `${monthsData[selectedMonth]?.name ?? ''} ${currentYear}` : `YEARLY CALENDAR ${currentYear}` }}
          </h1>
          <p class="text-body-2 text-grey-lighten-2">
            {{ selectedMonth !== null ? 'Detailed month view with Philippine holidays & scheduled events' : 'Click any month card to open full screen or change year' }}
          </p>
        </div>

        <div class="d-flex align-center flex-wrap ga-3">
          <!-- Year Selector Switcher -->
          <div class="d-flex align-center bg-surface px-3 py-1 rounded-pill border">
            <v-btn icon variant="text" size="small" @click="currentYear--">
              <v-icon icon="mdi-chevron-left" color="white" />
            </v-btn>
            <span class="text-h6 font-weight-bold text-teal mx-3">{{ currentYear }}</span>
            <v-btn icon variant="text" size="small" @click="currentYear++">
              <v-icon icon="mdi-chevron-right" color="white" />
            </v-btn>
          </div>

          <v-btn
            v-if="selectedMonth !== null"
            color="primary"
            variant="flat"
            prepend-icon="mdi-arrow-left"
            class="text-none font-weight-bold"
            @click="selectedMonth = null"
          >
            Back to Year
          </v-btn>
        </div>
      </div>

      <!-- VIEW 1: FULL YEAR 12-MONTH GRID -->
      <v-row v-if="selectedMonth === null">
        <v-col
          cols="12" md="6" lg="4" xl="3"
          v-for="(month, mIndex) in monthsData"
          :key="mIndex"
        >
          <v-card
            elevation="4"
            rounded="xl"
            class="pa-5 month-card bg-surface border-opacity-50 border position-relative overflow-hidden cursor-pointer"
            @click="selectedMonth = mIndex"
          >
            <!-- Turquoise Month Header Banner -->
            <div class="d-flex justify-space-between align-center mb-4 month-banner px-3 py-2 rounded-lg">
              <span class="font-weight-bold text-uppercase text-black text-caption tracking-wider">{{ month.name }}</span>
              <span class="font-weight-bold text-black text-caption">{{ currentYear }}</span>
            </div>

            <!-- Month Body -->
            <div class="d-flex align-center justify-between">
              <div class="text-h2 font-weight-black text-teal mr-4">
                {{ String(mIndex + 1).padStart(2, '0') }}
              </div>
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between text-xxs font-weight-bold text-grey mb-1">
                  <span v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="d" class="weekday-cell text-center">
                    {{ d }}
                  </span>
                </div>
                <div class="mini-grid">
                  <div
                    v-for="(cell, cIdx) in month.cells"
                    :key="cIdx"
                    class="day-cell text-center text-xxs font-weight-medium position-relative"
                    :class="{ 
                      'text-grey-darken-2 opacity-30': cell.isInactive, 
                      'text-white': !cell.isInactive,
                      'has-holiday-dot': !cell.isInactive && getEventsForDate(mIndex, cell.day).length > 0
                    }"
                  >
                    {{ cell.day || '' }}
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- VIEW 2: EXPANDED FULL-SCREEN SINGLE MONTH VIEW -->
      <v-row v-else justify="center">
        <v-col cols="12" lg="11" v-if="selectedMonth !== null && monthsData[selectedMonth]">
          <v-card elevation="8" rounded="xl" class="pa-8 bg-surface border-opacity-50 border position-relative">
            <div class="d-flex justify-space-between align-center mb-6">
              <div>
                <h2 class="text-h3 font-weight-bold text-white mb-1">
                  {{ monthsData[selectedMonth]?.name }} {{ currentYear }}
                </h2>
                <p class="text-body-2 text-grey-lighten-1">Philippine national holidays & custom events for {{ currentYear }}. Click any date to add an entry.</p>
              </div>
              <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-plus"
                class="text-none font-weight-bold"
                @click="openAddDialog(null)"
              >
                Add Entry
              </v-btn>
            </div>

            <!-- Weekday Headers -->
            <v-row no-gutters class="text-center text-subtitle-2 font-weight-bold text-teal mb-4">
              <v-col v-for="d in ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']" :key="d">
                {{ d }}
              </v-col>
            </v-row>

            <!-- Large Month Grid -->
            <v-row no-gutters class="large-month-grid">
              <v-col
                cols="12/7"
                v-for="(cell, cIdx) in monthsData[selectedMonth]?.cells"
                :key="cIdx"
                class="pa-1"
              >
                <div
                  class="expanded-day-cell pa-3 rounded-lg d-flex flex-column justify-start position-relative"
                  :class="{
                    'inactive-cell': cell.isInactive,
                    'active-cell': !cell.isInactive
                  }"
                  @click="!cell.isInactive && openAddDialog(cell.day)"
                >
                  <span class="text-body-2 font-weight-bold" :class="cell.isInactive ? 'text-grey-darken-2' : 'text-white'">
                    {{ cell.day }}
                  </span>
                  <div class="mt-2 flex-grow-1 overflow-hidden">
                    <div
                      v-for="evt in getEventsForDate(selectedMonth, cell.day)"
                      :key="evt.id"
                      class="event-pill text-xxs font-weight-bold px-2 py-1 mb-1 rounded text-truncate text-white"
                      :class="evt.isHoliday ? 'bg-amber-darken-3' : 'bg-teal'"
                      :title="evt.title"
                    >
                      {{ evt.title }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Add Event Dialog -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card rounded="xl" class="pa-4 bg-surface border" v-if="selectedMonth !== null">
        <v-card-title class="text-white font-weight-bold mb-2">
          Add Event for {{ monthsData[selectedMonth]?.name }} {{ targetDay }}, {{ currentYear }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newTitle"
            label="Event Title *"
            variant="outlined"
            density="comfortable"
            class="mb-3 text-white"
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" color="grey" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" class="text-black font-weight-bold" @click="saveEvent">Save Event</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" rounded="pill">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const currentYear = ref(2027)
const selectedMonth = ref<number | null>(null)
const dialog = ref(false)
const targetDay = ref<number | null>(null)
const newTitle = ref('')

const getPhilippineHolidays = (year: number) => {
  return [
    { id: `ph-${year}-1`, year, month: 0, day: 1, title: '🇵🇭 New Year\'s Day', isHoliday: true },
    { id: `ph-${year}-2`, year, month: 1, day: 25, title: '🇵🇭 EDSA Revolution', isHoliday: true },
    { id: `ph-${year}-3`, year, month: 3, day: 9, title: '🇵🇭 Araw ng Kagitingan', isHoliday: true },
    { id: `ph-${year}-4`, year, month: 4, day: 1, title: '🇵🇭 Labor Day', isHoliday: true },
    { id: `ph-${year}-5`, year, month: 5, day: 12, title: '🇵🇭 Independence Day', isHoliday: true },
    { id: `ph-${year}-6`, year, month: 7, day: 21, title: '🇵🇭 Ninoy Aquino Day', isHoliday: true },
    { id: `ph-${year}-7`, year, month: 7, day: 31, title: '🇵🇭 National Heroes Day', isHoliday: true },
    { id: `ph-${year}-8`, year, month: 10, day: 1, title: '🇵🇭 All Saints\' Day', isHoliday: true },
    { id: `ph-${year}-9`, year, month: 10, day: 2, title: '🇵🇭 All Souls\' Day', isHoliday: true },
    { id: `ph-${year}-10`, year, month: 10, day: 30, title: '🇵🇭 Bonifacio Day', isHoliday: true },
    { id: `ph-${year}-11`, year, month: 11, day: 8, title: '🇵🇭 Feast of Immaculate Conception', isHoliday: true },
    { id: `ph-${year}-12`, year, month: 11, day: 25, title: '🇵🇭 Christmas Day', isHoliday: true },
    { id: `ph-${year}-13`, year, month: 11, day: 30, title: '🇵🇭 Rizal Day', isHoliday: true },
    { id: `ph-${year}-14`, year, month: 11, day: 31, title: '🇵🇭 New Year\'s Eve', isHoliday: true }
  ]
}

const customEvents = ref<Array<{ id: string; year: number; month: number; day: number; title: string; isHoliday: boolean }>>([
  { id: 'cust-1', year: 2027, month: 2, day: 14, title: '🚀 Project Launch', isHoliday: false }
])

const events = computed(() => {
  const phHolidays = getPhilippineHolidays(currentYear.value)
  const userEvents = customEvents.value.filter(e => e.year === currentYear.value)
  return [...phHolidays, ...userEvents]
})

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
})

const monthNames = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
]

const monthsData = computed(() => {
  const year = currentYear.value
  return monthNames.map((name, mIdx) => {
    const firstDayIndex = new Date(year, mIdx, 1).getDay()
    const totalDays = new Date(year, mIdx + 1, 0).getDate()
    const prevMonthDays = new Date(year, mIdx, 0).getDate()

    const cells = []

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({ day: prevMonthDays - i, isInactive: true })
    }
    for (let d = 1; d <= totalDays; d++) {
      cells.push({ day: d, isInactive: false })
    }
    const remaining = 35 - cells.length
    const fillCount = remaining < 0 ? 42 - cells.length : (remaining <= 7 ? remaining : 42 - cells.length)
    for (let d = 1; d <= fillCount; d++) {
      cells.push({ day: d, isInactive: true })
    }

    return { name, cells }
  })
})

const getEventsForDate = (month: number, day: number) => {
  return events.value.filter(e => e.month === month && e.day === day)
}

const openAddDialog = (day: number | null) => {
  targetDay.value = day === null ? 1 : day
  newTitle.value = ''
  dialog.value = true
}

const saveEvent = () => {
  if (!newTitle.value.trim() || selectedMonth.value === null || targetDay.value === null) return
  customEvents.value.push({
    id: `evt-${Date.now()}`,
    year: currentYear.value,
    month: selectedMonth.value,
    day: targetDay.value,
    title: newTitle.value.trim(),
    isHoliday: false
  })
  snackbar.text = `Added "${newTitle.value}" successfully!`
  snackbar.color = 'success'
  snackbar.show = true
  dialog.value = false
  newTitle.value = ''
}
</script>

<style scoped>
.year-calendar-bg {
  background: linear-gradient(135deg, #121824 0%, #1a2234 100%);
  min-height: 100vh;
}

.month-card {
  background-color: #1e2532 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.month-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4) !important;
}

.month-banner {
  background: linear-gradient(135deg, #00b4d8 0%, #0096c7 100%);
  box-shadow: 0 2px 8px rgba(0, 180, 216, 0.3);
}

.text-teal {
  color: #00b4d8 !important;
}

.text-xxs {
  font-size: 0.65rem;
}

.weekday-cell {
  width: 14.28%;
}

.mini-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 4px;
}

.day-cell {
  padding: 2px 0;
}

.has-holiday-dot::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background-color: #ffb703;
  border-radius: 50%;
}

.cols-12\/7, .large-month-grid > .v-col {
  flex: 0 0 14.2857% !important;
  max-width: 14.2857% !important;
}

.expanded-day-cell {
  min-height: 115px;
  background-color: #242c3d;
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.expanded-day-cell:hover {
  background-color: #2d3748;
}

.inactive-cell {
  background-color: #1a202c !important;
  opacity: 0.4;
  cursor: default;
}
</style>