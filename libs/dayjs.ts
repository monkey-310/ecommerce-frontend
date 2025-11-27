import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/en';

dayjs.locale('en');

const config = {
  thresholds: [
    { l: 's', r: 1 },
    { l: 'ss', r: 59, d: 'second' },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 6, d: 'day' },
    { l: 'w', r: 1 },
    { l: 'ww', r: 4, d: 'week' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y', r: 1 },
    { l: 'yy', d: 'year' },
  ],
};
dayjs.extend(relativeTime, config);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    ss: '%d seconds',
    m: '%d minute',
    mm: '%d minutes',
    h: '%d hour',
    hh: '%d hours',
    d: '%d day',
    dd: '%d days',
    w: '%d week',
    ww: '%d weeks',
    M: '%d month',
    MM: '%d months',
    y: '%d year',
    yy: '%d years',
  },
});

export function dayFromNow(date: string) {
  return dayjs(date).fromNow();
}

export function dayPublish(date: string) {
  return dayjs(date).format('HH:mm DD/MM/YYYY');
}
