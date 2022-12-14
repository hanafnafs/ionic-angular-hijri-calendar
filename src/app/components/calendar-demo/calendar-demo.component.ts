import { Component, Input, OnInit } from '@angular/core';
import { CalendarDay } from './calendar-day';
import * as moment from 'moment-hijri';

@Component({
  selector: 'app-calendar-demo',
  templateUrl: './calendar-demo.component.html',
  styleUrls: ['./calendar-demo.component.scss'],
})
export class CalendarDemoComponent implements OnInit {
  public calendar: CalendarDay[] = [];
  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() selectToday: boolean = true;
  @Input() mode: string = 'hijri';
  hijriMonths = [
    { text: 'محرم', value: 1, abbreviation: 'م' },
    { text: 'صفر', value: 2, abbreviation: 'ص' },
    { text: 'ربيع الأول', value: 3, abbreviation: 'ر.ا' },
    { text: 'ربيع الثاني', value: 4, abbreviation: 'ر' },
    { text: 'جمادى الأولى', value: 5, abbreviation: 'ج.ا' },
    { text: 'جمادى الآخرة', value: 6, abbreviation: 'ج' },
    { text: 'رجب', value: 7, abbreviation: 'ب' },
    { text: 'شعبان', value: 8, abbreviation: 'ش' },
    { text: 'رمضان', value: 9, abbreviation: 'ن' },
    { text: 'شوال', value: 10, abbreviation: 'ل' },
    { text: 'ذو القعدة', value: 11, abbreviation: 'ذ.ا' },
    { text: 'ذو الحجة', value: 12, abbreviation: 'ذ' },
  ];
  georMonths = [
    { text: 'يناير', value: 1 },
    { text: 'فبراير', value: 2 },
    { text: 'مارس', value: 3 },
    { text: 'ابريل', value: 4 },
    { text: 'مايو', value: 5 },
    { text: 'يوليو', value: 6 },
    { text: 'يونيه', value: 7 },
    { text: 'اغسطس', value: 8 },
    { text: 'سبتمبر', value: 9 },
    { text: 'اكتوبر', value: 10 },
    { text: 'نوفمبر', value: 11 },
    { text: 'ديسمبر', value: 12 },
  ];
  hijriYear;
  georYear;
  years = [];
  year;
  month = 9;
  days: any[];
  months = [];
  weekdaysEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  weekdaysAr = ['إثنـ', 'ثلثـ', 'أربـ', 'خميـ', 'جمـ', 'سبـ', 'أحـ'];
  selectedYearAndMonth = { year: {}, month: {} } as any;
  hijriMonth;
  constructor() {}

  ngOnInit(): void {
    // here we initialize the calendar
    let currentTime = new Date();
    if (this.mode == 'georgian') {
      this.georYear = currentTime.getFullYear();
      for (let i = 0; i < this.georYear; i++) {
        if (i < 90) {
          let val = this.georYear--;
          this.years.push({ text: val, value: val });
        } else {
          break;
        }
      }
      this.months = this.georMonths;
    } else {
      this.hijriYear = this.parseArabic(moment(currentTime).format('iYYYY'));
      for (let i = 0; i < this.hijriYear; i++) {
        if (i < 90) {
          let val = this.hijriYear--;
          this.years.push({ text: val, value: val });
        } else {
          break;
        }
      }
      this.months = this.hijriMonths;
    }
    if (this.selectToday) {
      let c_year, c_month;
      if (this.mode == 'georgian') {
        c_year = currentTime.getFullYear();
        c_month = currentTime.getMonth() + 1;
        this.days = this.generateDays(c_year, c_month, '0');
      } else {
        c_year = this.parseArabic(moment(currentTime).format('iYYYY'));
        c_month = this.parseArabic(moment(currentTime).format('iMM'));
        this.hijriMonth = c_month;
        let year = moment(c_year.toString(), 'iYYYY');
        year = this.parseArabic(
          moment(year).format('iYYYY[is]YYYY').split('is')[1]
        );

        let month = moment(c_year + '/' + c_month + '/1', 'iYYYY/iM/iD');
        // console.log('heye', month);
        month = this.parseArabic(
          moment(month)
            .format('iYYYY/iM/iD[is]YYYY/M/D')
            .split('is')[1]
            .split('/')[1]
        );
        // console.log('xxxxxx', c_month)
        // let day = this.parseArabic(moment(currentTime).format('iD'));
        // console.log("DAY: ", day)
        this.days = this.generateDays(year, month, '0');
        // console.log('cc', c_month, c_year, month, year);
      }
      this.years.map((year) => {
        if (year.value == c_year) {
          this.selectedYearAndMonth['year'] = year;
        }
      });
      this.months.map((month) => {
        if (month.value == c_month) {
          this.selectedYearAndMonth['month'] = month;
        }
      });
    }
    // console.log(this.selectedYearAndMonth);
  }

  private getIncrement(year: number, month: number): number {
    let date = new Date('' + year + '-' + month + '-1');
    let increment = date.getDay() > 0 ? date.getDay() - 2 : 5;
    return increment;
  }

  private getDate(
    week: number,
    dayWeek: number,
    year: number,
    month: any,
    increment: number,
    exactDay?: any
  ) {
    // console.log(exactDay, increment, week, year, month);
    let date: any;
    let temp: string;
    let day = week * 7 + dayWeek - increment;
    if (this.mode == 'georgian') {
      exactDay = '1';
    }
    if (day <= 0) {
      let fechaAuxiliar = new Date('' + year + '-' + month + '-' + 1);
      date = new Date(
        fechaAuxiliar.getTime() + (day - 1) * 24 * 60 * 60 * 1000
      );
      // console.log('date', date); // past month days are here
    } else {
      if (this.mode == 'georgian') {
        date = new Date('' + year + '-' + month + '-' + day);
        if (isNaN(date.getTime())) {
          let fechaAuxiliar = new Date('' + year + '-' + month + '-1');
          date = new Date(
            fechaAuxiliar.getTime() + (day - 1) * 24 * 60 * 60 * 1000
          );
          // console.log('dataeeeee: ' , date)
        }
      } else {
        date = new Date(
          '' + year + '-' + month + '-' + (day + parseInt(exactDay))
        );
        if (isNaN(date.getTime())) {
          // console.log('other iff')
          let dummy = parseInt(month);
          let fechaAuxiliar = new Date(
            '' + year + '-' + dummy.toString() + '-1'
          );
          date = new Date(
            fechaAuxiliar.getTime() + (day - 1) * 24 * 60 * 60 * 1000
          );
          // console.log('dataeeeee: ' , date)
        }
      }
    }
    let hijri = moment(date).format('iYYYY/iMM/iDD');
    // let hijri = "cc";
    // console.log('hijri is : ', hijri)
    // let result = this.convertToHijri(year, month, day);
    // console.log(result)
    // console.log(date, day);
    return {
      date: date,
      day: date.getDate(),
      georgianMonth: date.getMonth(),
      hijriMonth: parseInt(this.parseArabic(hijri?.split('/')[1])),
      isMonth: date.getMonth() == month - 1,
      hijri: hijri,
    };
  }

  private generateDays(year: number, month: number, day?: any, inc?: any) {
    const increment = inc ? inc : this.getIncrement(year, month);
    // console.log('inc')
    const days = [];
    [0, 1, 2, 3, 4, 5].forEach((x, index) => {
      days.push([]);
      for (let y = 0; y < 7; y++) {
        days[index].push(this.getDate(x, y, year, month, increment, day));
      }
    });
    // console.log(days);
    return days;
  }

  parseArabic(arabicnumstr) {
    return arabicnumstr.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
      return d.charCodeAt(0) - 1632; // Convert Arabic numbers
    });
  }

  getCorrespondingMonth(monthOrder) {
    let res = this.parseArabic(monthOrder);
    return parseInt(res);
  }

  onPeriodChange(type, ev) {
    console.log(ev);
    if (this.mode == 'georgian') {
      if (type == 'year') {
        this.selectedYearAndMonth['year'] = ev.detail.value;
      } else {
        this.selectedYearAndMonth['month'] = ev.detail.value;
      }
      this.days = this.generateDays(
        this.selectedYearAndMonth['year'].value,
        this.selectedYearAndMonth['month'].value
      );
    } else {
      let year, month, day;
      year = moment(
        this.selectedYearAndMonth['year'].value.toString(),
        'iYYYY'
      );
      year = this.parseArabic(
        moment(year).format('iYYYY[is]YYYY').split('is')[1]
      );
      month = moment(
        this.selectedYearAndMonth['year'].value +
          '/' +
          this.selectedYearAndMonth['month'].value +
          '/1',
        'iYYYY/iM/iD'
      );
      this.hijriMonth = this.selectedYearAndMonth['month'].value;
      day = month._i.split('-')[2];
      month = this.parseArabic(
        moment(month)
          .format('iYYYY/iM/iD[is]YYYY/M/D')
          .split('is')[1]
          .split('/')[1]
      );
      // console.log(
      //   this.parseArabic(moment(month).format('iYYYY/iM/iD[is]YYYY/M/D'))
      // );
      // }
      // console.log(year, month, day, 'TESTT DATA');
      // this.days = this.generateDays(year, month, 1);
      this.days = this.generateDays(year, month, 0, -day);
    }
  }
}
