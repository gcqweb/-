# -
the 24 solar terms，
中国农历、中国传统节日、二十四节气以及一些国际节日。查询特定年份的所有中国传统节日和二十四节气，并获取国际节日信息。

英文描述
The CulturalDateTimeCalculator class is designed to calculate and handle various cultural dates, especially focusing on the Chinese lunar calendar, traditional Chinese festivals, the Twenty-Four Solar Terms, and some international holidays. This class offers convenient methods for converting Gregorian dates to corresponding lunar dates, querying all traditional Chinese festivals and solar terms for a specified year, and obtaining information about international holidays. Additionally, it helps developers easily integrate these functionalities into their applications, providing users with a richer calendar experience.

```
import { Calendar, type CalendarDate } from '../utils/calendar'

onMounted(() => {
  const calendar = new Calendar()
  // 获取今天的日期信息
  const today = calendar.getToday()
  // 获取指定公历日期的信息(包含节假日/节气)
  const date = calendar.getDateBySolar(2024, 12,6)
  console.log('today, date：',today, date);
})
