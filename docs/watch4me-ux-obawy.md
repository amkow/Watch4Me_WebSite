# Watch4Me – obawy UX (przegląd z 2026-11-05)

> **Zakres:** przegląd kodu backendu aplikacji (wdrożonego na Cloudflare Workers) oraz strony `index.html` z tego repozytorium.
> **Ograniczenie:** samej aplikacji nie uruchomiono – frontend leży w zasobach statycznych Workera, a adres był zablokowany w środowisku, w którym robiono przegląd. Wnioski dotyczą tego, co użytkownik dostaje z API i co obiecuje mu strona; frontend wymaga osobnego przeglądu.

## Priorytety w skrócie

| # | Problem | Waga | Gdzie poprawić |
|---|---|---|---|
| 1 | Strona obiecuje inne limity i funkcje niż aplikacja | Wysoka | strona + decyzja produktowa |
| 2 | Podejrzane limity planu Pro (miesięczny < dzienny, = Plus) | Wysoka | backend (konfiguracja) |
| 3 | Martwe przyciski na stronie, brak linku do aplikacji | Wysoka | strona |
| 4 | Niespójne i techniczne komunikaty błędów | Średnia | backend |
| 5 | Limity widoczne dopiero jako błąd | Średnia | frontend aplikacji |
| 6 | Digest tylko w aplikacji (brak maila / Notion / Slacka) | Średnia–wysoka | backend |
| 7 | Strona słabo przygotowana na telefony | Niska–średnia | strona |

---

## 1. Strona obiecuje coś innego, niż robi aplikacja

| Strona (`index.html`) | Backend w rzeczywistości |
|---|---|
| Free: „5 filmów / miesiąc” | 5 filmów (Gemini) **dziennie**, 10 miesięcznie |
| Plus: „100 filmów / miesiąc” | 50 dziennie, 100 miesięcznie – zgodne co do miesiąca |
| Pro: „Nieograniczone filmy” | 170 filmów (Gemini) miesięcznie |
| Eksport PDF, Word, CSV | w kodzie jest tylko eksport **Markdown** |
| Eksport do Notion, Zapier | brak integracji w kodzie |
| „Setki filmów naraz”, „playlista z 50 filmami w < 2 min” | jednorazowa analiza: **maks. 30 filmów** |
| „Wszystkie plany bezpłatne w Beta” | płatności Stripe (Plus/Pro) są już podpięte |

**Ryzyko:** użytkownik przychodzi po PDF, Notion albo „bez limitu” i odbija się od aplikacji. To podważa zaufanie już przy pierwszym użyciu.

**Do decyzji:** dopasować stronę do aplikacji (usunąć lub oznaczyć „wkrótce” brakujące funkcje) albo dobudować funkcje. Dopóki funkcji nie ma, strona nie powinna jej obiecywać.

## 2. Podejrzane limity planu Pro

- Pro: dziennie 500 filmów YouTube, ale **miesięcznie tylko 200**, czyli tyle samo co Plus.
- Pro i Plus mają ten sam miesięczny limit analiz (50).
- Miesięczny limit niższy niż dzienny sprawia, że dzienny nigdy nie ma znaczenia.

Wygląda to na pomyłkę w domyślnej konfiguracji. Warto też sprawdzić, czy limity nie są nadpisane w ustawieniach w bazie.

## 3. Martwe przyciski na stronie

- „Zaloguj”, „Zacznij za darmo” (nagłówek) i „▶ Zacznij za darmo” (hero) prowadzą do `href="#"`.
- Trzy przyciski planów to `<button>` bez akcji.
- Na stronie nie ma żadnego linku do aplikacji. Makieta pokazuje `app.watch4me.ai`, ale nic tam nie prowadzi.

**Propozycja:** CTA → aplikacja (rejestracja), przyciski planów → rejestracja z wybranym planem, „Zaloguj” → logowanie.

## 4. Komunikaty błędów

- **Mieszanka języków.** Część jest po polsku („Nie zalogowano”, „Playlista nie znaleziona”), część po angielsku („Video not found”, „User not found”, „videoIds array is required”, „Not found”).
- **Wyciek technicznych szczegółów.** „Internal server error: …” i „Błąd modelu AI: <treść wyjątku>” pokazują użytkownikowi surowe błędy. Szczegóły powinny trafiać do logów, a użytkownik dostawać zrozumiały komunikat z kolejnym krokiem.
- **Trzy różne komunikaty o braku logowania:** „Nie zalogowano”, „Musisz być zalogowany”, „Nie zalogowano — odśwież stronę i zaloguj się ponownie”. Tylko ostatni mówi, co zrobić, więc warto go używać wszędzie.
- **Wewnętrzne pojęcia na zewnątrz.** „analiz Llama”, „kredytów Gemini”: użytkownik nie wie, czym jest Llama. Lepiej mówić o „analizach” i „filmach”.

**Propozycja:** jeden słownik komunikatów (PL, ewentualnie EN), kody błędów dla frontendu i teksty po stronie frontendu.

## 5. Limity widoczne dopiero jako błąd

Komunikat „Dzienny limit X … wyczerpany. Spróbuj jutro.” nie mówi:
- ile zostało przed wyczerpaniem,
- kiedy dokładnie limit się odnowi (reset liczony jest według czasu polskiego),
- że można przejść na wyższy plan.

Backend ma już endpoint z limitami użytkownika. Aplikacja może pokazywać licznik („3 z 5 filmów dziś”), ostrzegać przed wyczerpaniem i proponować upgrade w komunikacie 429.

## 6. Digest tylko w aplikacji

Plan w `docs/watch4me-analiza-i-plan.md` stawia na digest wysyłany mailem albo do Notion/Slacka. Obecnie digest jest dostępny tylko w aplikacji (ostatnie 24 h, maks. 14 dni wstecz) i w kodzie nie ma wysyłki maili.

**Ryzyko:** przy pozycjonowaniu „Watch4Me ogląda YouTube za Ciebie” użytkownik nadal musi sam pamiętać, żeby wejść do aplikacji. To główna obietnica produktu.

**Propozycja:** cykliczny mail z digestem (np. przez cron Workera) jako pierwszy kanał, potem Notion/Slack.

## 7. Strona na telefonach

`index.html` ma jeden breakpoint (640px). Do sprawdzenia: nawigacja na wąskich ekranach, makieta aplikacji, karty cennika, rozmiary przycisków dotykowych.

---

## Następne kroki

1. Decyzja: dopasowujemy stronę do aplikacji czy dobudowujemy funkcje (pkt 1).
2. Sprawdzić i poprawić limity Pro (pkt 2).
3. Podpiąć przyciski na stronie; potrzebny docelowy adres aplikacji (pkt 3).
4. Punkty 4–6 wymagają repozytorium źródłowego aplikacji, nie tylko wdrożonego bundla.
5. Przegląd frontendu aplikacji po odblokowaniu dostępu (zrzuty ekranu, główny scenariusz: link → analiza → wynik).
