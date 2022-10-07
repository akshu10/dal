import { format, parseISO } from 'date-fns';

type PrettyFormat = 'compactDate';

const prettyDate = (date: string | Date, prettyFormat?: PrettyFormat): string => {
  const dateToFormat = typeof date === 'string' ? parseISO(date) : date;

  if (prettyFormat === 'compactDate') {
    return format(dateToFormat, 'dd MMM yyyy');
  } else {
    return format(dateToFormat, 'dd MMM yyyy HH:mm');
  }
};

export { prettyDate };
