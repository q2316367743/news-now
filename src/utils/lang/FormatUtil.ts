import dayjs from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);
dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);

export const KB = 1024.0;
export const MB = 1024 * KB;
export const GB = 1024 * MB;

/**
 * 美化数据单位
 *
 * @param {number} value 需要美化的值
 */
export function prettyDataUnit(value: number) {
  if (value > GB) {
    let temp = value / GB;
    return temp.toFixed(2) + "GB";
  }
  if (value > MB) {
    let temp = value / MB;
    return temp.toFixed(2) + "MB";
  }
  if (value > KB) {
    let temp = value / KB;
    return temp.toFixed(2) + "KB";
  }
  return value + "B";
}

export function prettyDate(date?: number | string | Date) {
  const now = new Date().getTime();
  const old = date ? new Date(date).getTime() : new Date().getTime();
  const diffValue = now - old;
  let result: string;
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = month * 12;

  const _year = diffValue / year;
  const _month = diffValue / month;
  const _week = diffValue / (7 * day);
  const _day = diffValue / day;
  const _hour = diffValue / hour;
  const _min = diffValue / minute;

  if (_year >= 1) result = _year.toFixed(0) + "年前";
  else if (_month >= 1) result = _month.toFixed(0) + "个月前";
  else if (_week >= 1) result = _week.toFixed(0) + "周前";
  else if (_day >= 1) result = _day.toFixed(0) + "天前";
  else if (_hour >= 1) result = _hour.toFixed(0) + "个小时前";
  else if (_min >= 1) result = _min.toFixed(0) + "分钟前";
  else result = "刚刚";
  return result;
}

function padStartNumber(
  num: number,
  maxLength: number,
  fillString?: string,
): string {
  return `${num}`.padStart(maxLength, fillString);
}

export function prettyDateTime(date: number, showZero = false) {
  if (!date || date <= 0) {
    return showZero ? "00:00" : "--:--";
  }
  let minute = Math.floor(date / 60);
  let second = Math.floor(date % 60);
  return `${padStartNumber(minute, 2, "0")}:${padStartNumber(second, 2, "0")}`;
}
/**
 * 传入任意时区的时间（不携带时区），转换为 UTC 时间
 */
export function tranformToUTC(
  date: string,
  format?: string,
  timezone: string = "Asia/Shanghai",
): number {
  if (!format) return dayjs.tz(date, timezone).valueOf();
  return dayjs.tz(date, format, timezone).valueOf();
}

// cloudflare 里 dayjs() 结果为 0，不能放在 top
function words() {
  return [
    {
      startAt: dayjs(),
      regExp: /^(?:今[天日]|to?day?)(.*)/,
    },
    {
      startAt: dayjs().subtract(1, "days"),
      regExp: /^(?:昨[天日]|y(?:ester)?day?)(.*)/,
    },
    {
      startAt: dayjs().subtract(2, "days"),
      regExp: /^(?:前天|(?:the)?d(?:ay)?b(?:eforeyesterda)?y)(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(1))
        ? dayjs().weekday(1).subtract(1, "week")
        : dayjs().weekday(1),
      regExp: /^(?:周|星期)一(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(2))
        ? dayjs().weekday(2).subtract(1, "week")
        : dayjs().weekday(2),
      regExp: /^(?:周|星期)二(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(3))
        ? dayjs().weekday(3).subtract(1, "week")
        : dayjs().weekday(3),
      regExp: /^(?:周|星期)三(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(4))
        ? dayjs().weekday(4).subtract(1, "week")
        : dayjs().weekday(4),
      regExp: /^(?:周|星期)四(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(5))
        ? dayjs().weekday(5).subtract(1, "week")
        : dayjs().weekday(5),
      regExp: /^(?:周|星期)五(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(6))
        ? dayjs().weekday(6).subtract(1, "week")
        : dayjs().weekday(6),
      regExp: /^(?:周|星期)六(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(7))
        ? dayjs().weekday(7).subtract(1, "week")
        : dayjs().weekday(7),
      regExp: /^(?:周|星期)[天日](.*)/,
    },
    {
      startAt: dayjs().add(1, "days"),
      regExp: /^(?:明[天日]|y(?:ester)?day?)(.*)/,
    },
    {
      startAt: dayjs().add(2, "days"),
      regExp: /^(?:[后後][天日]|(?:the)?d(?:ay)?a(?:fter)?t(?:omrrow)?)(.*)/,
    },
  ];
}

const patterns = [
  {
    unit: "years",
    regExp: /(\d+)(?:年|y(?:ea)?rs?)/,
  },
  {
    unit: "months",
    regExp: /(\d+)(?:[个個]?月|months?)/,
  },
  {
    unit: "weeks",
    regExp: /(\d+)(?:周|[个個]?星期|weeks?)/,
  },
  {
    unit: "days",
    regExp: /(\d+)(?:天|日|d(?:ay)?s?)/,
  },
  {
    unit: "hours",
    regExp: /(\d+)(?:[个個]?(?:小?时|[時点點])|h(?:(?:ou)?r)?s?)/,
  },
  {
    unit: "minutes",
    regExp: /(\d+)(?:分[鐘钟]?|m(?:in(?:ute)?)?s?)/,
  },
  {
    unit: "seconds",
    regExp: /(\d+)(?:秒[鐘钟]?|s(?:ec(?:ond)?)?s?)/,
  },
];

const patternSize = Object.keys(patterns).length;

/**
 * 预处理日期字符串
 * @param {string} date 原始日期字符串
 */
function toDate(date: string) {
  return date
    .toLowerCase()
    .replace(/(^an?\s)|(\san?\s)/g, "1") // 替换 `a` 和 `an` 为 `1`
    .replace(/[几幾]/g, "3") // 如 `几秒钟前` 视作 `3秒钟前`
    .replace(/[\s,]/g, "");
} // 移除所有空格

/**
 * 将 `['\d+时', ..., '\d+秒']` 转换为 `{ hours: \d+, ..., seconds: \d+ }`
 * 用于描述时间长度
 * @param {Array.<string>} matches 所有匹配结果
 */
function toDurations(matches: string[]) {
  const durations: Record<string, string> = {};

  let p = 0;
  for (const m of matches) {
    for (; p <= patternSize; p++) {
      const match = patterns[p].regExp.exec(m);
      if (match) {
        durations[patterns[p].unit] = match[1];
        break;
      }
    }
  }
  return durations;
}

export const parseDate = (date: string | number, ...options: any) =>
  dayjs(date, ...options).toDate();

export function parseRelativeDate(date: string, timezone: string = "UTC") {
  if (date === "刚刚") return new Date();
  // 预处理日期字符串 date

  const theDate = toDate(date);

  // 将 `\d+年\d+月...\d+秒前` 分割成 `['\d+年', ..., '\d+秒前']`

  const matches = theDate.match(/\D*\d+(?![:\-\/]|([ap])m)\D+/g);
  const offset = dayjs.duration({
    hours: (dayjs().tz(timezone).utcOffset() - dayjs().utcOffset()) / 60,
  });

  if (matches) {
    // 获得最后的时间单元，如 `\d+秒前`

    const lastMatch = matches.pop();

    if (lastMatch) {
      // 若最后的时间单元含有 `前`、`以前`、`之前` 等标识字段，减去相应的时间长度
      // 如 `1分10秒前`

      const beforeMatches = /(.*)(?:前|ago)$/.exec(lastMatch);
      if (beforeMatches) {
        matches.push(beforeMatches[1]);
        // duration 这个插件有 bug，他会重新实现 subtract 这个方法，并且不会处理 weeks。用 ms 就可以调用默认的方法
        return dayjs()
          .subtract(dayjs.duration(toDurations(matches)))
          .toDate();
      }

      // 若最后的时间单元含有 `后`、`以后`、`之后` 等标识字段，加上相应的时间长度
      // 如 `1分10秒后`

      const afterMatches = /(?:^in(.*)|(.*)[后後])$/.exec(lastMatch);
      if (afterMatches) {
        matches.push(afterMatches[1] ?? afterMatches[2]);
        return dayjs()
          .add(dayjs.duration(toDurations(matches)))
          .toDate();
      }

      // 以下处理日期字符串 date 含有特殊词的情形
      // 如 `今天1点10分`

      matches.push(lastMatch);
    }
    const firstMatch = matches.shift();

    if (firstMatch) {
      for (const w of words()) {
        const wordMatches = w.regExp.exec(firstMatch);
        if (wordMatches) {
          matches.unshift(wordMatches[1]);

          // 取特殊词对应日零时为起点，加上相应的时间长度

          return dayjs
            .tz(
              w.startAt
                .set("hour", 0)
                .set("minute", 0)
                .set("second", 0)
                .set("millisecond", 0)
                .add(dayjs.duration(toDurations(matches)))
                .add(offset),
              timezone,
            )
            .toDate();
        }
      }
    }
  } else {
    // 若日期字符串 date 不匹配 patterns 中所有模式，则默认为 `特殊词 + 标准时间格式` 的情形，此时直接将特殊词替换为对应日期
    // 如今天为 `2022-03-22`，则 `今天 20:00` => `2022-03-22 20:00`

    for (const w of words()) {
      const wordMatches = w.regExp.exec(theDate);
      if (wordMatches) {
        // The default parser of dayjs() can parse '8:00 pm' but not '8:00pm'
        // so we need to insert a space in between
        return dayjs
          .tz(
            `${w.startAt.add(offset).format("YYYY-MM-DD")} ${/a|pm$/.test(wordMatches[1]) ? wordMatches[1].replace(/a|pm/, " $&") : wordMatches[1]}`,
            timezone,
          )
          .toDate();
      }
    }
  }

  return date;
}

export function parseHtml(html: string): Document {
  return new DOMParser().parseFromString(html, "text/html");
}