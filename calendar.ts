interface CalendarDate {
  cYear: number;      // 农历年
  cMonth: number;     // 农历月
  cDay: number;       // 农历日
  lYear: number;      // 公历年
  lMonth: number;     // 公历月
  lDay: number;       // 公历日
  lDayZH: string;     // 农历日中文
  animal: string;     // 生肖
  monthZH: string;    // 农历月中文
  term: string;       // 节气
  festival: string;   // 节日
  date: string;       // 日期字符串 YYYY-MM-DD
  sDay: number;       // 公历日
  gzYear: string;     // 干支纪年
  gzMonth: string;    // 干支纪月
  gzDay: string;      // 干支纪日
  isLeap: boolean;    // 是否闰月
  isToday?: boolean;  // 是否是今天
  isOtherMonth?: boolean; // 是否是其他月份的日期
}

export class Calendar {
  // 农历数据信息
  private lunarInfo = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
    0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0
  ]

  // 农历节日
  private festivals = {
    solar: { // 公历节日
      '1-1': '元旦',
      '2-14': '情人节',
      '3-8': '妇女节',
      '3-12': '植树节',
      '4-1': '愚人节',
      '5-1': '劳动节',
      '5-4': '青年节',
      '6-1': '儿童节',
      '7-1': '建党节',
      '8-1': '建军节',
      '9-10': '教师节',
      '10-1': '国庆节',
      '12-24': '平安夜',
      '12-25': '圣诞节'
    },
    lunar: { // 农历节日
      '1-1': '春节',
      '1-15': '元宵节',
      '2-2': '龙抬头',
      '5-5': '端午节',
      '7-7': '七夕节',
      '7-15': '中元节',
      '8-15': '中秋节',
      '9-9': '重阳节',
      '12-8': '腊八节',
      '12-23': '小年',
      '12-30': '除夕'
    }
  }

  // 添加节气数据
  private solarTerm = [
    '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
    '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
    '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
    '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
  ]

  private sTermInfo = [
    0, 21208, 42467, 63836, 85337, 107014, 128867, 150921,
    173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033,
    353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758
  ]

  // 天干地支数据
  private Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  private Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

  // 修改农历月份天数计算方法
  private getMonthDays(year: number, month: number): number {
    // 注意：month 参数从1开始
    if (month > 12 || month < 1) {
      return 0;
    }
    
    // 计算农历月份大小 29/30
    const bit = this.lunarInfo[year - 1900] & (0x10000 >> month);
    return bit ? 30 : 29;
  }

  // 获取闰月
  private getLeapMonth(year: number): number {
    return this.lunarInfo[year - 1900] & 0xf
  }

  // 修改农历年天数计算方法
  private getLunarYearDays(year: number): number {
    let sum = 348; // 12个月，每月29天，基本只有348天
    
    // 计算每个月是大月还是小月，大月30天，小月29天
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      sum += (this.lunarInfo[year - 1900] & i) ? 1 : 0;
    }
    
    // 加上闰月天数
    return sum + this.getLeapDays(year);
  }

  // 修改闰月天数计算方法
  private getLeapDays(year: number): number {
    const leapMonth = this.getLeapMonth(year);
    if (leapMonth > 0) {
      // 闰月是大月还是小月
      return (this.lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
  }

  // 辅助位运算函数
  private getBitInt(data: number, length: number, shift: number): number {
    return (data & (((1 << length) - 1) << shift)) >> shift
  }

  // 修改公历转农历的核心算法
  private solar2lunar(year: number, month: number, day: number): CalendarDate | null {
    // 验证日期
    if (year < 1900 || year > 2100) {
      return null;
    }

    // 计算与1900年1月31日相差的天数
    let offset = Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 31)) / 86400000);

    // 计算农历年
    let lunarYear = 1900;
    let yearDays = 0;
    
    for (; lunarYear < 2101 && offset > 0; lunarYear++) {
      yearDays = this.getLunarYearDays(lunarYear);
      offset -= yearDays;
    }

    if (offset < 0) {
      offset += yearDays;
      lunarYear--;
    }

    // 计算农历月
    let lunarMonth = 1;
    let isLeap = false;
    let monthDays = 0;
    
    // 获取闰月
    const leapMonth = this.getLeapMonth(lunarYear);

    for (; lunarMonth <= 12 && offset > 0; lunarMonth++) {
      // 闰月
      if (leapMonth > 0 && lunarMonth === (leapMonth + 1) && !isLeap) {
        --lunarMonth;
        isLeap = true;
        monthDays = this.getLeapDays(lunarYear);
      } else {
        monthDays = this.getMonthDays(lunarYear, lunarMonth);
      }

      // 解除闰月
      if (isLeap && lunarMonth === (leapMonth + 1)) {
        isLeap = false;
      }

      offset -= monthDays;
    }

    // 如果恰好减完
    if (offset === 0 && leapMonth > 0 && lunarMonth === leapMonth + 1) {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;
        --lunarMonth;
      }
    }

    // offset小于0时，在上个月
    if (offset < 0) {
      offset += monthDays;
      --lunarMonth;
    }

    // 农历日
    const lunarDay = offset + 1;

    // 计算节日
    const solarFestival =  (this.festivals.solar as Record<string, string>)[`${month}-${day}`] || '';
    // this.festivals.solar[`${month}-${day}`] || ''
    const lunarFestival = (this.festivals.lunar as Record<string, string>)[`${lunarMonth}-${lunarDay}`] || ''
    // this.festivals.lunar[`${lunarMonth}-${lunarDay}`] || ''

    // 生成农历日期字符串
    const lunarDayStr = this.getLunarDayString(lunarDay)
    const lunarMonthStr = (isLeap ? '闰' : '') + this.getLunarMonthString(lunarMonth)

    return {
      lYear: year,
      lMonth: month,
      lDay: day,
      cYear: lunarYear,
      cMonth: lunarMonth,
      cDay: lunarDay,
      isLeap: isLeap,
      lDayZH: lunarDayStr,
      monthZH: lunarMonthStr + '月',
      animal: this.getAnimal(lunarYear),
      term: this.getTerm(year, month, day),
      festival: solarFestival || lunarFestival,
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      sDay: day,
      gzYear: this.getGanZhiYear(lunarYear),
      gzMonth: this.getGanZhiMonth(year, month),
      gzDay: this.getGanZhiDay(year, month, day)
    }
  }

  // 获取农历日期字符串
  private getLunarDayString(day: number): string {
    const nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    const nStr2 = ['初', '十', '廿', '卅']
    let s
    switch (day) {
      case 10:
        s = '初十'
        break
      case 20:
        s = '二十'
        break
      case 30:
        s = '三十'
        break
      default:
        s = nStr2[Math.floor(day / 10)]
        s += nStr1[day % 10]
    }
    return s
  }

  // 获取农历月份符串
  private getLunarMonthString(month: number): string {
    const nStr3 = [
      '正', '二', '三', '四', '五', '六',
      '七', '八', '九', '十', '冬', '腊'
    ]
    return nStr3[month - 1]
  }

  // 获取生肖
  private getAnimal(year: number): string {
    const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
    return animals[(year - 4) % 12]
  }

  // 获取节气
  private getTerm(year: number, month: number, day: number): string {
    const n1 = month * 2 - 1
    const n2 = month * 2
    const dayN1 = this.getTermDay(year, n1)
    const dayN2 = this.getTermDay(year, n2)
    
    if (day === dayN1) return this.solarTerm[n1 - 1]
    if (day === dayN2) return this.solarTerm[n2 - 1]
    return ''
  }

  // 计算节气日期
  private getTermDay(y: number, n: number): number {
    const offDate = new Date((31556925974.7 * (y - 1900) + this.sTermInfo[n - 1] * 60000) + Date.UTC(1900, 0, 6, 2, 5))
    return offDate.getUTCDate()
  }

  // 计算干支纪年
  private getGanZhiYear(year: number): string {
    const ganKey = (year - 4) % 10
    const zhiKey = (year - 4) % 12
    return this.Gan[ganKey] + this.Zhi[zhiKey]
  }

  // 计算干支纪月
  private getGanZhiMonth(year: number, month: number): string {
    const ganKey = ((year - 1900) * 12 + month + 11) % 10
    const zhiKey = (month + 1) % 12
    return this.Gan[ganKey] + this.Zhi[zhiKey]
  }

  // 计算干支纪日
  private getGanZhiDay(year: number, month: number, day: number): string {
    const dateObj = new Date(year, month - 1, day)
    let dayCyclical = Math.floor(dateObj.getTime() / 86400000 + 25567 + 10)
    return this.Gan[dayCyclical % 10] + this.Zhi[dayCyclical % 12]
  }

  // 获取今天的日期信息
  public getToday(): CalendarDate {
    const today = new Date()
    const result = this.solar2lunar(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    )
    if (!result) {
      throw new Error('Invalid date')
    }
    return result
  }

  // 通过公历日期获取日期信息
  public getDateBySolar(year: number, month: number, day: number): CalendarDate {
    const result = this.solar2lunar(year, month, day)
    if (!result) {
      throw new Error('Invalid date')
    }
    return result
  }
}

// 导出接口以供其他文件使用
export type { CalendarDate } 