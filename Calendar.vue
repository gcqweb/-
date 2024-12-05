<template>
  <div class="calendar-wrapper">
    <div v-if="selectedDateInfo" class="date-detail">
      <div class="detail-item">
        <span>公历：</span>
        <span>{{ selectedDateInfo.lYear }}年{{ selectedDateInfo.lMonth }}月{{ selectedDateInfo.lDay }}日</span>
      </div>
      <div class="detail-item">
        <span>农历：</span>
        <span>{{ selectedDateInfo.monthZH }}{{ selectedDateInfo.lDayZH }}</span>
      </div>
      <div class="detail-item">
        <span>干支：</span>
        <span>{{ selectedDateInfo.gzYear }}年 {{ selectedDateInfo.gzMonth }}月 {{ selectedDateInfo.gzDay }}日</span>
      </div>
      <div class="detail-item">
        <span>属相：</span>
        <span>{{ selectedDateInfo.animal }}</span>
      </div>
      <div v-if="selectedDateInfo.term" class="detail-item">
        <span>节气：</span>
        <span>{{ selectedDateInfo.term }}</span>
      </div>
      <div v-if="selectedDateInfo.festival" class="detail-item">
        <span>节日：</span>
        <span>{{ selectedDateInfo.festival }}</span>
      </div>
    </div>

    <div class="date-jump">
      <input type="number" v-model="jumpYear" placeholder="年" min="1900" max="2100" />
      <input type="number" v-model="jumpMonth" placeholder="月" min="1" max="12" />
      <button @click="jumpToDate">跳转</button>
    </div>

    <div class="calendar-header">
      <button @click="prevMonth">&lt;</button>
      <span>{{ currentYear }}年{{ currentMonth }}月</span>
      <button @click="nextMonth">&gt;</button>
    </div>
    
    <div class="calendar-body">
      <div class="calendar-weeks">
        <span v-for="week in weeks" :key="week">{{ week }}</span>
      </div>
      
      <div class="calendar-days">
        <div
          v-for="day in days"
          :key="day.date"
          class="calendar-day"
          :class="{ 
            'is-today': day.isToday,
            'is-selected': isSelected(day.date),
            'other-month': day.isOtherMonth
          }"
          @click="selectDate(day)"
        >
          <div class="solar-day">{{ day.sDay }}</div>
          <div class="lunar-day">
            <template v-if="day.term">
              <span class="term">{{ day.term }}</span>
            </template>
            <template v-else>
              {{ day.lDayZH }}
            </template>
          </div>
          <div class="festival" v-if="day.festival">{{ day.festival }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Calendar, type CalendarDate } from '../utils/calendar'

const calendar = new Calendar()
const weeks = ['日', '一', '二', '三', '四', '五', '六']

const currentDate = ref(new Date())
const selectedDate = ref('')
const days = ref<CalendarDate[]>([])

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)

const selectedDateInfo = ref<CalendarDate | null>(null)
const jumpYear = ref<number>(new Date().getFullYear())
const jumpMonth = ref<number>(new Date().getMonth() + 1)

const generateCalendar = () => {
  const year = currentYear.value
  const month = currentMonth.value
  
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  
  const daysArray = []
  
  // 填充上个月的日期
  const firstDayWeek = firstDay.getDay()
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate()
  
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 2, prevMonthLastDay - i)
    daysArray.push({
      ...calendar.getDateBySolar(prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate()),
      isOtherMonth: true
    })
  }
  
  // 当月日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateInfo = calendar.getDateBySolar(year, month, i)
    daysArray.push({
      ...dateInfo,
      isToday: dateInfo.date === calendar.getToday().date
    })
  }
  
  // 填充下个月的日期
  const remainingDays = 42 - daysArray.length // 保持6行7列的格式
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(year, month, i)
    daysArray.push({
      ...calendar.getDateBySolar(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate()),
      isOtherMonth: true
    })
  }
  
  days.value = daysArray
}

const selectDate = (day: CalendarDate) => {
  selectedDate.value = day.date
  selectedDateInfo.value = day
  emit('select', day)
}

const isSelected = (date: string) => date === selectedDate.value

const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 2)
  generateCalendar()
  emit('change', { year: currentYear.value, month: currentMonth.value })
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value)
  generateCalendar()
  emit('change', { year: currentYear.value, month: currentMonth.value })
}

const jumpToDate = () => {
  if (jumpYear.value && jumpMonth.value) {
    currentDate.value = new Date(jumpYear.value, jumpMonth.value - 1, 1)
    generateCalendar()
    emit('change', { year: jumpYear.value, month: jumpMonth.value })
  }
}

const emit = defineEmits(['select', 'change', 'init'])

onMounted(() => {
  generateCalendar()
  emit('init', { year: currentYear.value, month: currentMonth.value })
  const calendar = new Calendar()

// 获取今天的日期信息
const today = calendar.getToday()

// 获取指定公历日期的信息
const date = calendar.getDateBySolar(2024, 12,6)
console.log(today, date,'today, date');


})
</script>

<style scoped>
.calendar-wrapper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #eee;
  border-radius: 8px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.calendar-weeks {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 8px;
}

.calendar-day {
  aspect-ratio: 1;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
}

.calendar-day:hover {
  background-color: #f5f5f5;
}

.calendar-day.is-today {
  background-color: #e6f7ff;
}

.calendar-day.is-selected {
  background-color: #1890ff;
  color: white;
}

.calendar-day.other-month {
  color: #999;
}

.solar-day {
  font-size: 16px;
  font-weight: bold;
}

.lunar-day {
  font-size: 12px;
}

.festival {
  font-size: 10px;
  color: #ff4d4f;
}

.date-detail {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 16px;
}

.detail-item {
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
}

.date-jump {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.date-jump input {
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.date-jump button {
  padding: 4px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.date-jump button:hover {
  background: #40a9ff;
}
</style>