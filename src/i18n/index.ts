import en from './messages/en.json';
import fr from './messages/fr.json';
import de from './messages/de.json';
import es from './messages/es.json';
import it from './messages/it.json';
import pt from './messages/pt.json';
import pl from './messages/pl.json';
import ru from './messages/ru.json';
import uk from './messages/uk.json';
import cs from './messages/cs.json';
import sk from './messages/sk.json';
import hu from './messages/hu.json';
import ro from './messages/ro.json';
import tr from './messages/tr.json';
import sv from './messages/sv.json';

import { Locale } from './config';

const messages: Record<Locale, typeof en> = {
  en,
  fr,
  de,
  es,
  it,
  pt,
  pl,
  ru,
  uk,
  cs,
  sk,
  hu,
  ro,
  tr,
  sv,
};

export function getMessages(locale: Locale) {
  return messages[locale] || messages.en;
}

export type Messages = typeof en;

export default messages;
