# Watch4Me – analiza rynku i plan dalszych działań

*Stan na: 5 października 2026*

> **Wniosek w skrócie:** ogólny pomysł „AI streszcza playlisty YouTube” już się nie broni – Google robi to za darmo, a konkurencja jest liczna.
> Pomysł broni się po zawężeniu: **Watch4Me jako automatyczne śledzenie kanałów YouTube z regularnym digestem** (mail → Notion/Slack), działające na serwerze 24/7, dla jednej konkretnej niszy.

---

## 1. Co się zmieniło na rynku (marzec → październik 2026)

### Google
- **Ask w YouTube** – przycisk „Ask” pod filmem z gotową opcją „Summarize the video”. Google zapowiada mocniejszą analizę wideo („agentic video understanding”) w nadchodzących miesiącach. *Nie zweryfikowano dostępności w Polsce / po polsku.*
- **Gemini (aplikacja)** – wyszukuje filmy, playlisty i kanały oraz streszcza ich treść.
- **Gemini Notebook (dawniej NotebookLM)** – zmiana nazwy 16.07.2026. Przyjmuje filmy YouTube jako źródła, daje czat z cytatami. Darmowe rozszerzenia importują całe playlisty i kanały jednym kliknięciem.

### Konkurencja w streszczaniu playlist
| Narzędzie | Co robi |
|---|---|
| NoteGPT | streszczenia wsadowe do 20 filmów naraz, mapy myśli |
| BibiGPT | czat po całej kolekcji/playliście, eksporty, zespoły |
| ChatYT | pobiera całą playlistę, streszczenie wybranego filmu |
| ScreenApp | streszczenia z rozdziałami i timestampami |
| YouTube Playlist Summarizer (Chrome) | Gemini, playlisty do 5000 filmów – **tylko ~81 użytkowników** |

**Wniosek:** „import całej playlisty” i „masowe przetwarzanie” nie są już wyróżnikiem. Limit 100 filmów na playlistę to środek stawki. Niska liczba użytkowników rozszerzenia sugeruje, że samo streszczanie playlist słabo przyciąga ludzi.

### HARPA AI – najbliższy kierunek
- Rozszerzenie Chrome: AI + automatyzacja przeglądarki, 100+ gotowych komend.
- Streszcza pojedyncze filmy YouTube (z timestampami), strony, PDF-y.
- Wiele modeli w jednym miejscu (GPT, Claude, Gemini, Grok, Perplexity, DeepSeek).
- **Monitoring stron** (zmiany cen, tekstu, treści) z ustawianą częstotliwością.
- Integracje (Make.com itp.), ok. **500 tys.+ użytkowników**, ocena 4,7, Pro ok. **$15/mies.**

**Słabe punkty HARPA (szansa dla Watch4Me):**
- działa w przeglądarce → monitoring wymaga włączonego komputera i Chrome,
- monitoruje strony ogólnie, nie *treść* filmów (brak „co nowego powiedziano na moich 20 kanałach”).

**Pozycjonowanie:** *„HARPA, ale dla YouTube i bez przeglądarki.”*

---

## 2. Technologia: Gemini API vs transkrypcje

### Obecne podejście Watch4Me: Gemini API z linkiem do YouTube
- **Zaleta:** analizuje obraz + dźwięk, nie tylko napisy – działa na filmach bez napisów, wyłapuje slajdy i kod na ekranie.
- **Oficjalnie wspierane przez Google** – czysta droga prawnie.
- Ta sama technologia jest jednak dostępna dla konkurencji (łatwa do skopiowania).

**Limity (szacunki, zweryfikować w AI Studio):**
- ok. 300 tokenów/s wideo ≈ **1 mln tokenów na godzinę** (niska rozdzielczość ≈ 3× mniej),
- darmowy poziom: ok. 8 h filmów YouTube dziennie, do ~10 filmów na zapytanie,
- maks. ok. 1 h filmu w wysokiej / ok. 3 h w niskiej rozdzielczości.

### Płatne API z transkrypcjami (Supadata, TranscriptAPI itp.) – **odradzane**
- Tańsze na film, ale **niezgodne z regulaminem YouTube** (zakaz automatycznego dostępu bez pisemnej zgody).
- Działają przez scraping wewnętrznych endpointów i sieci proxy – ryzyko, że przestaną działać z dnia na dzień.
- YouTube blokuje IP chmur (AWS, GCP, Azure…), więc darmowa biblioteka `youtube-transcript-api` nie działa na serwerze.
- Oficjalne YouTube Data API nie udostępnia cudzych napisów.

### Porównanie kosztów (film 30 min, szacunki)
| Sposób | Koszt na film |
|---|---|
| Płatne API transkrypcji + streszczenie tekstu | ~$0,002–0,02 |
| Gemini wideo, wysoka jakość (~540 tys. tokenów) | ~$0,05–0,16 |
| Gemini wideo, niska rozdzielczość (~180 tys. tokenów) | ~$0,02–0,05 |

*Ceny Flash-Lite: $0,10–0,30 / 1 mln tokenów wejścia (zależnie od wersji). Cena tokenów wideo/audio może się różnić – sprawdzić w oficjalnym cenniku.*

### Decyzja: Gemini wideo jako główna ścieżka, z obniżaniem kosztu
1. **Niska rozdzielczość** (`media_resolution: low`) – ok. 3× mniej tokenów.
2. **Wspólny cache** – każdy film przetwarzany raz, wysyłany wszystkim obserwującym kanał.
3. **Flash-Lite** do streszczeń, droższy model tylko na żądanie („pokaż szczegóły”).
4. **Przycinanie długich filmów** (`videoMetadata` start/end) – np. pierwsze 20 min streamu.
5. **Wykrywanie nowych filmów przez RSS kanału** (`youtube.com/feeds/videos.xml?channel_id=…`) – darmowe, oficjalny feed, bez limitów Data API.

---

## 3. Nowy kierunek: „Watch4Me ogląda YouTube za Ciebie”

Użytkownik dodaje kanały → Watch4Me sam przetwarza każdy nowy film → regularny **digest**.

**Dlaczego to ma sens:**
- Google (Ask, Gemini Notebook) działa tylko na żądanie – nie pilnuje kanałów.
- HARPA wymaga przeglądarki i nie analizuje treści filmów.
- Lepsza ekonomia dzięki wspólnemu cache (jeden film → wielu odbiorców).
- Nazwa „Watch4Me” wreszcie znaczy dosłownie to, co produkt robi.

Streszczanie playlist zostaje jako **darmowy wabik**: „wklej playlistę → dostań streszczenie → chcesz to co tydzień?”.

---

## 4. Plan działania

### Etap 0 – walidacja przed kodem (tydzień 1–2)
- [ ] Wybrać jedną niszę. **Rekomendacja: AI / tech** (dużo kanałów, szybkie zmiany, chętnie płacą). Alternatywy: marketing, finanse / krypto.
- [ ] Przerobić landing page na nowy przekaz, np. *„Śledź 30 kanałów o AI bez oglądania ani minuty. Co rano jeden mail z tym, co ważne.”* + lista oczekujących.
- [ ] Zrobić jeden prawdziwy digest obecnym kodem i pokazać go jako przykład.
- [ ] Opublikować w 3–5 miejscach: Reddit (r/artificial, r/LocalLLaMA, r/productivity), X, Product Hunt „Coming soon”, polskie grupy AI.
- **Kryterium:** ~100 zapisów w 2 tygodnie lub ≥10 osób z deklaracją płatności. Poniżej 30 → zmienić niszę/przekaz.

### Etap 1 – MVP (tydzień 3–5)
- [ ] Dodawanie kanałów (link lub gotowy zestaw, np. „Top 20 kanałów o AI”).
- [ ] Wykrywanie nowych filmów przez RSS.
- [ ] Przetwarzanie: Gemini, niska rozdzielczość, cache per film.
- [ ] Digest mailem (dzienny / tygodniowy): 3–5 punktów na film + link z timestampem.
- **Odpuścić na razie:** eksport PDF/Word, zespoły, aplikacja mobilna.

### Etap 2 – beta z płatnością (tydzień 6–10)
- [ ] Wpuścić 20–50 osób, rozmawiać z nimi.
- [ ] Włączyć płatność (Stripe) wcześnie – bez „darmowej bety bez limitu”.
- **Metryki:**
  - otwieralność digestów (cel > 40%),
  - retencja po 4 tygodniach,
  - średnia liczba kanałów na osobę,
  - koszt Gemini na użytkownika / miesiąc.

### Etap 3 – rozbudowa (miesiąc 3+, tylko jeśli Etap 2 się uda)
- [ ] Integracje: Notion, Slack, webhook, n8n / Zapier.
- [ ] Pytanie do archiwum: *„co w ostatnim miesiącu mówiono o X na moich kanałach?”*
- [ ] Plan dla zespołów.
- [ ] Kolejne nisze (gotowe zestawy kanałów).

---

## 5. Ceny – wstępna propozycja

| Plan | Cena | Zakres |
|---|---|---|
| Free | $0 | 3 kanały, digest tygodniowy, jednorazowe streszczenie playlisty |
| Pro | $9–12 / mies. | 30 kanałów, digest codzienny, Notion/Slack, archiwum |
| Team | od $39 / mies. | wspólne kanały, kilka osób, webhooki |

**Szacunek kosztu Pro:** ~100 filmów/mies. przy niskiej rozdzielczości + cache ≈ **$2–5 / użytkownika** → przy $9–12 marża się spina. Policzyć na prawdziwych filmach z wybranej niszy (średnia długość filmu zmienia wynik najbardziej).

---

## 6. Ryzyka i kryteria zatrzymania

- **Google doda subskrypcje z digestem w YouTube** → obrona: integracje, archiwum, nisza.
- **Regulaminy YouTube i Gemini** dot. masowego przetwarzania – sprawdzić przed płatną wersją.
- **Koszty Gemini** przy darmowych planach – limity od pierwszego dnia.
- **Stop / pivot:** retencja po 4 tygodniach < 20% albo nikt nie płaci → nie dokładać funkcji, zmienić niszę lub zamknąć projekt.

---

## 7. Poprawki na obecnym landing page (`index.html`)

- [ ] `© 2024` w stopce → aktualny rok.
- [ ] Usunąć „Zaufali nam twórcy z…” i „Dołącz do tysięcy użytkowników” do czasu, aż będą prawdziwe.
- [ ] Zastąpić trzy plany po $0 jedną „Betą” + listą oczekujących.
- [ ] Dodać wyróżnik: *„rozumie też to, co widać na ekranie, nie tylko napisy”*.

---

## Źródła

**Google / YouTube**
- [Gemini Apps Help – Find and ask about YouTube content](https://support.google.com/gemini/answer/16622858?hl=en&co=GENIE.Platform%3DAndroid)
- [Android Police – ukryty przycisk Gemini w YouTube](https://www.androidpolice.com/stopped-scrubbing-through-long-youtube-videos-after-tapping-hidden-gemini-button/)
- [Search Engine Journal – Ask YouTube video understanding](https://www.searchenginejournal.com/google-video-understanding-ask-youtube/588123/)
- [NC State OIT – NotebookLM changes name to Gemini Notebook](https://oit.ncsu.edu/2026/07/17/notebooklm-changes-name-to-gemini-notebook/)
- [Bulk import YouTube playlists to NotebookLM](https://notebooklm-web-importer.com/docs/features/bulk-import-youtube-playlist)
- [YouTube – Terms of Service](https://www.youtube.com/terms)

**Konkurencja**
- [Unite.ai – 5 Best AI YouTube Summarizer Tools (September 2026)](https://www.unite.ai/youtube-summarizer-tools/)
- [BibiGPT – Top 10 YouTube summarizers 2026](https://bibigpt.co/en/blog/posts/top-youtube-ai-video-summary-tools)
- [YouTube Playlist Summarizer – Chrome Web Store](https://chromewebstore.google.com/detail/youtube-playlist-summariz/kihockjnbnonikclbnkmmpgcndgnhmmg?hl=en-US)
- [ChatYT – Playlist Summarizer](https://chatyt.io/youtube-playlist-summarizer)
- [notelm.ai – 8 Best YouTube Summary Chrome Extensions 2026](https://www.notelm.ai/blog/youtube-summary-chrome-extension)

**HARPA AI**
- [HARPA AI – oficjalna strona](https://harpa.ai/welcome)
- [bestaitools.com – HARPA AI review 2026](https://www.bestaitools.com/tool/harpa-ai/)
- [aigearbase – HARPA AI 2026 Review, Pricing](https://aigearbase.com/tool/harpa-ai)
- [chrome-stats – HARPA AI](https://chrome-stats.com/d/eanggfilgoajaocelnaflolkadkeghjp)
- [Make.com – HARPA AI integrations](https://www.make.com/en/integrations/harpa-ai/gemini-ai)

**Technologia i koszty**
- [yingtu.ai – Gemini API free tier limits 2026](https://yingtu.ai/en/blog/google-gemini-api-free-tier-limits-2026)
- [tkmxai – Gemini API in 2026](https://www.tkmxai.it.com/gemini-api-in-2026-4)
- [morphllm – Gemini API Pricing 2026](https://www.morphllm.com/gemini-api-pricing)
- [anotherwrapper – Gemini 3.5 Flash-Lite pricing](https://anotherwrapper.com/llm-pricing/gemini-3.5-flash-lite)
- [llmreference – Gemini 3.1 Flash-Lite](https://www.llmreference.com/model/gemini-3.1-flash-lite)
- [Phyllo – Is the YouTube API free in 2026](https://www.getphyllo.com/post/is-the-youtube-api-free-in-2026-quota-limits-costs-when-to-pay)
- [youtube-transcript-api – issue o blokadach](https://github.com/jdepoix/youtube-transcript-api/issues/593)
- [DEV – why your transcript scraper returns empty strings (2026)](https://dev.to/jamhimself/why-your-youtube-transcript-scraper-started-returning-empty-strings-and-how-to-fix-it-in-2026-20ed)
- [Supadata – best YouTube transcript API](https://supadata.ai/blog/best-youtube-transcript-api)
- [TranscriptAPI vs Supadata – porównanie 2026](https://transcriptapi.com/blog/youtube-transcript-api-comparison)

*Uwaga: wyszukiwanie obejmowało głównie źródła anglojęzyczne (US). Ceny i limity zmieniają się często – zweryfikować przed decyzjami finansowymi.*
