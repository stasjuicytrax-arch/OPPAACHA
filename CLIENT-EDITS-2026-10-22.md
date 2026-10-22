# Правки клиента от 22.10.2026: новая структура и контент

Источник: `client-brief/Oppaacha_Website_Brief.pdf` (8 стр.). Этот файл **заменяет** разделы ТЗ, которые ему противоречат (см. раздел 2). Палитра и дизайн-система (`DESIGN-SYSTEM.md`) не меняются.

**Суть правок:** страница строится вокруг музыки, релизов и достижений, а не вокруг фото. Меньше повторяющихся фото и пустых промежутков, компактные содержательные блоки. Booking всегда доступен из меню.

---

## 1. Новая структура страницы (порядок блоков)

| № | Блок | Что внутри |
|---|---|---|
| 1 | **Hero** | Видео Батура вместо вращающегося фотоколлажа; текст, жанры, логотипы лейблов, кнопки Listen · Watch · Booking |
| 2 | **Selected Releases** | 5 квадратных обложек, Listen on Spotify |
| 3 | **Upcoming collaboration with CamelPhat** | Видео «In My Hands», подпись «предстоящая коллаборация» |
| 4 | **Bio & Highlights** | Крупная вводная фраза, био из 3 абзацев, Music Highlights, Touring Highlights, 2 скриншота Diynamic, афиша австралийского тура |
| 5 | **Become Human Records** | Небольшой самостоятельный блок, не галерея |
| 6 | **Radio mixes** | SiriusXM и Insomniac Radio: карточки 3:4 с афишами и SoundCloud-плеерами |
| 7 | **Live on stage** | Компактная подборка видео (Батур, TRIP, Trip Main Stage, Savaya, Flava Moscow) |
| 8 | **Бегущая строка** | Остаётся на текущем месте, единообразные города |
| 9 | **Played by** | 6 артистов, единая система подписей |
| 10 | **Финальный блок** | 2 лучших фото, `Press photos & logos · Download rider · Booking`, контакты менеджера |

Меню: Intro / Releases / Live / Played by / Bio / Booking (финальный список сверить с блоками). Стеклянная капсула остаётся.

## 2. Что меняется относительно `TECH-SPEC.md` и `DESIGN-SYSTEM.md`

| Было в ТЗ | Теперь |
|---|---|
| Hero: компонент `tilted-grid-hero` (лента фото) | **Убрать фотоколлаж.** Hero = сильный концертный видеофрагмент (Батур, вид на вулкан). `tilted-grid-hero` в hero не использовать. Это ещё и снимает нагрузку на мобильных |
| Блок «Даты тура» (карточки дат) | **Заменяется на Touring Highlights** (4 пункта текстом). Списка дат в брифе нет и не нужен. Требование «все даты тура задействованы» читать так: **все 4 пункта Touring Highlights выведены** |
| Rider: 3 вкладки с полным текстом | **Убрать большой раздел.** Только кнопка `Download rider` на PDF (в финальном блоке) |
| Фото: карусель 8 студийных + сетка 5 live | **Оставить 2 лучших фото**, большую галерею убрать. Компонент `circular-carousel` из hero и фото-блока исключается; его можно использовать для Selected Releases на мобильных (см. 3.2), если вёрстка получится чище |
| Правило «все 12 видео и 13 фото на странице» | **Заменяется кураторской подборкой.** Клиент просит «сильную компактную подборку, не выкладывать все версии подряд». Новое правило проверки: каждый пункт из таблиц 3.x ниже выведен, лишнего нет |
| Hero-текст: из PromoKit | Готов: см. 3.1 |
| Showreel (диптих V02 + V03) | В брифе не упоминается. **Решение за заказчиком** (раздел 6, вопрос 1) |

Остаётся в силе: палитра Signal Red / Night, шрифты, сетка, Liquid Glass (меню, кнопки, плееры), антишаблонный контроль Impeccable, правила производительности на мобильных, запрет гигантской подложки в hero.

## 3. Контент по блокам

Тексты сайта **на английском**, правки и комментарии на русском. Все ссылки кликабельны.

### 3.1 Hero

```
Music producer & DJ
Owner of Become Human Records

Indie Dance · Melodic House / Techno

Releases on
Diynamic · Insomniac / IN / ROTATION · Smash The House · Armada · Kontor · Bar 25 Music
```
- Фон: **видео Батура** (общий план с пейзажем и вулканом, приоритетный материал). Кадр-ориентир: `client-brief/batur-hero-frame-1920x1080.jpg`. Кнопки: `Listen` (ведёт к Selected Releases) · `Watch` (к видео) · `Booking`.
- **Логотипы лейблов**: официальные, выровненные по визуальному размеру (оптически, не по ширине). Набор зафиксирован, менять не надо. Файлов логотипов в материалах пока нет (см. раздел 6).
- Подпись видео: съёмка **на фоне вулкана Батур, не на вершине**.
- Hero-видео: без звука, зацикленное, постер AVIF, на мобильных только постер или лёгкое превью (правила производительности).

### 3.2 Selected Releases

Пять квадратных обложек. Под каждой: название, артисты, лейбл, `Listen on Spotify`. Нажатие на обложку открывает ту же ссылку. Если возможно, аккуратное прослушивание на сайте (нажатие «Play» подгружает встроенный Spotify-плеер, не грузить 5 iframe сразу).

| # | Название | Лейбл | Ссылка |
|---|---|---|---|
| 01 | Oppaacha - Umbrella EP | Diynamic | https://open.spotify.com/album/3F5YBwYr8f1jUHrSwAF8Fq |
| 02 | Oppaacha - Oxygen EP | Diynamic | https://open.spotify.com/album/4Ud0PMfDjfTsTheM4iNSnC |
| 03 | Oppaacha - Arietta EP | Diynamic | https://open.spotify.com/album/1X2HpwjSDyYqBmOwho9rpC |
| 04 | Vion Konger & Oppaacha - Colosseum | Smash The House | https://open.spotify.com/album/7xlkPqNl1TN5C7TN3tanpt |
| 05 | REBRN & Oppaacha - Axe | Insomniac / IN / ROTATION | https://open.spotify.com/track/1O1yrsknsnNsLPTAllrSQy (прямая ссылка на трек) |

Обложки в материалах не присланы: получить через Spotify oEmbed при сборке (`https://open.spotify.com/oembed?url=<ссылка>`, поле `thumbnail_url`) и сохранить локально, либо запросить файлы.

### 3.3 Upcoming collaboration with CamelPhat

- Название: **CamelPhat & Oppaacha - In My Hands**.
- Выделить ближе к началу страницы. Видео, где CamelPhat играют совместный трек: https://drive.google.com/file/d/1rE7LjBWS4IyvXbXrOtaYeYcZjZKlKJkb/view?usp=drivesdk
- Подпись обязательно объясняет, что это **предстоящая коллаборация** (например: `Upcoming collaboration · CamelPhat play “In My Hands” live`).
- Кадр-ориентир: `client-brief/camelphat-in-my-hands-frame.jpg`.
- Тот же ролик используется в Played by: там карточка **ссылается на этот блок**, большого плеера второй раз не показывать.

### 3.4 Bio & Highlights

Фразу про underground и влияние 90-х/2000-х показать как **крупный вводный текст**, ниже био из трёх абзацев. Тексты (финальная редакция клиента, не править):

```
BIO
Behind Oppaacha is Vladislav Liuborets, whose relationship with electronic music dates back to 2007.
At just 12 years old, he discovered trance and EDM and began making his first tracks.

By 2021, he had completely rethought his approach to production and created Oppaacha - a project
focused on a more underground club sound, while keeping the influence of the ’90s and 2000s that
had shaped his musical taste from the beginning. The first release under the Oppaacha name followed
that same year.

Perhaps it was this balance between past and present that caught Solomun’s attention. Over the
following three years, Oppaacha had five releases on Diynamic and spent two consecutive years
among the label’s Top 10 artists.

MUSIC HIGHLIGHTS
• #3 Trending Indie Dance Artist - BeatStats
• “Don’t Stop” - #2 on Solomun’s Momentum Chart
• BBC Radio 1 support from Pete Tong
• Guest mixes on Insomniac Radio & SiriusXM
• Support from Tiësto, CamelPhat, R3HAB & Steve Angello
• Music played at Tomorrowland, EDC & Ultra
• Featured in the Tomorrowland Official Playlist
• 4M+ streams · 100K+ Shazams

TOURING HIGHLIGHTS
• Debut Australian tour - Melbourne & Sydney, 2025
• TRIP Festival headliner - 2025
• Closing set on the final day of Day Zero at Savaya Bali - 2026
• Selected appearances across Bali, Ibiza, Singapore, Bangkok, Ulaanbaatar & Istanbul

BECOME HUMAN RECORDS
Founded by Oppaacha in 2026, Become Human Records saw one of its releases reach #1 on
Beatport’s Mainstage chart within its first three months.
```
Правила подачи:
- **Diynamic Top 10** раскрывается в био, в highlights **не повторяется** (в списке выше его нет, так и оставить).
- Streams / Shazams / DJ supports **уплотнить**: цифрам достаточно небольшой строки рядом с достижениями, не крупных счётчиков.
- **Два скриншота Diynamic** привязать к абзацу про Top 10: `client-brief/chart-diynamic-1-position-8.jpg` (позиция #8) и `client-brief/chart-diynamic-2-position-10.jpg` (позиция #10). Превью, по нажатию полный рейтинг в стеклянном лайтбоксе. Не обрезать.
- **Афиша австралийского тура** (`client-brief/poster-australian-tour.jpg`) привязать к пункту `Debut Australian tour` в Touring Highlights.

### 3.5 Become Human Records

Небольшой самостоятельный блок: текст из 3.4 (абзац BECOME HUMAN RECORDS) и, если есть, логотип лейбла. Не превращать в ещё одну галерею.

### 3.6 Radio mixes

Для обоих миксов встроенные **SoundCloud-плееры** (грузить по нажатию, не при загрузке страницы). Афиши из присланных файлов. Единый формат карточек: **пропорции 3:4**, одинаковые отступы, заголовок и короткая подпись. Изображение открывается целиком по нажатию, **мелкий текст и логотипы не обрезать** (в карточке `object-fit: contain` с фоном под цвет афиши, в лайтбоксе оригинал).

| Карточка | Заголовок / подпись | Афиша | Ссылка |
|---|---|---|---|
| **SiriusXM - Guest mix** | OCHO Mix 59 / Diplo’s Revolution · роль **Guest mix** сохранить | `client-brief/poster-siriusxm-ocho.png` | https://soundcloud.com/entergrayarea/oppaacha-exclusive-set-ocho-september (название: Oppaacha Exclusive Set - OCHO September) |
| **Insomniac Radio - Guest mix** | Silver Panda / PF 95 - Oppaacha | `client-brief/poster-insomniac-radio.jpg` | https://soundcloud.com/silverpandamusic/pf-95-oppaacha |

### 3.7 Live on stage

Источник: папка Live / Showreel / новые видео https://drive.google.com/drive/folders/1-5Vfg-rugjoISCycTot8Ok20UCY9Y51Z?usp=drive_link

**Приоритет: новые видео с Батура и TRIP.** Материал с Батура рассмотреть для первого экрана и основного видео.

Новые видео (скачать в `Все что нужно тут/Video/New/`):
| Видео | Ссылка |
|---|---|
| Батур / Vulcano Batur Set | https://drive.google.com/file/d/1hyg5s6bWfumracU9A0AXOSkd_VgQuH-A/view?usp=drivesdk (то же видео использовано в hero как приоритетный кадр) |
| Батур / Promise Yourself Batur, 16:9 | https://drive.google.com/file/d/1WFGb55HhTPHxmV9fzVYNTNYZWAaixW3B/view?usp=drivesdk |
| TRIP / Umbrella | https://drive.google.com/file/d/1YBAAJt1hvsb0FbrtPbtm8kNrg_DirI1u/view?usp=drivesdk |
| TRIP 2025 / Axe | https://drive.google.com/file/d/1sF7YVcE7PgDICE3J2UykWSEj7VFL-Gr-/view?usp=drivesdk |

**Текущий отбор (Live on stage):**
- Trip Main Stage: **оставить**.
- Первое Savaya Bali: **оставить**.
- Третья карточка (тоже Savaya Bali): **убрать**. По порядку на сайте это `V06` (`_True_ Bali Savaya.mov`). Подтвердить, что имелась в виду именно она.
- Четвёртая карточка с Savaya: **оставить** (`V07`).
- Flava Moscow: **оставить** (`V08`).
- Новые TRIP-видео использовать **вместо более слабых или повторяющихся** фрагментов. Итог: сильная компактная подборка, не все версии подряд.

**Формат подписи:** `площадка / событие · город`; название трека отдельной строкой, если нужно. **Убрать** рабочие названия «Flava Back» и конструкции с «Los Goodman» / «Gioli & Assia». Названия файлов в интерфейс не выносить.

### 3.8 Бегущая строка

Оставляем. Города оформлять **единообразно**, площадки указывать **вместе с городом** (формат `Venue, City`). **Разделить подписями** два типа: «мои выступления» (Performed at) и «фестивали, где звучала моя музыка» (Music played at). Известные позиции из брифа: Savaya Bali, TRIP Festival, Flava Moscow, Batur Bali; Music played at: Tomorrowland, EDC, Ultra. Городов, не названных в брифе, не выдумывать.

### 3.9 Played by

Источник: папка поддержки https://drive.google.com/drive/folders/1L2YquISzBEMDkcC9iGPNzF2R37-1ggJD?usp=drive_link

Основной состав из 6 артистов; для каждого самый сильный фрагмент:

| Артист | Трек / событие | Ссылка на видео |
|---|---|---|
| Adriatique | My Soul | https://drive.google.com/file/d/18KGhamD2NKnFnTqtKA7Bdt_XjeW2r4TH/view?usp=drivesdk |
| Solomun | Don’t Stop · новый ролик 2026 | https://drive.google.com/file/d/19ZuMOwIZmDPLxJhwdXk7nMcqoeOJ7iZJ/view?usp=drivesdk |
| CamelPhat | In My Hands · предстоящая коллаборация | https://drive.google.com/file/d/1rE7LjBWS4IyvXbXrOtaYeYcZjZKlKJkb/view?usp=drivesdk (**та же карточка, что в 3.3; не дублировать большой плеер, связать со ссылкой на блок коллаборации**) |
| R3HAB | Colosseum | https://drive.google.com/file/d/1XnCq0p4srg6rt3QZsq4b4heW2yGngTvd/view?usp=drivesdk |
| Layton Giordani | Stomp The Floor | https://drive.google.com/file/d/11nX_s1WgYZPfbLaeibUpbPk6tI1xj-bX/view?usp=drivesdk |
| Vintage Culture | (место сохраняем) | **Ролика пока нет.** Взять из папки поддержки после загрузки. Пока карточка-заглушка, помеченная `TODO_VINTAGE_CULTURE`, в продакшн не уходит |

- **Solomun:** в папке два новых ролика с Don’t Stop. Сравнить и выбрать один для основной карточки. Второй: https://drive.google.com/file/d/16B__Eif4xo8miExwYek8VbdugCnnPH8I/view?usp=drivesdk
- **Единая система подписей:** `Артист → мой трек → событие или площадка (если известны)`. Не переносить технические названия файлов.

### 3.10 Финальный блок (фото, райдер, контакты)

- **Два лучших фото** из присланных (выбрать по кадру: сильные, разные по композиции, не повторять кадры из hero).
- Компактная строка действий: `Press photos & logos · Download rider · Booking`.
- `Download rider` ведёт на PDF `rider/OPPAACHA-Rider.pdf` (0.9 МБ, уже в проекте). Большого раздела с текстом райдера нет.
- `Press photos & logos`: сохранить действующую ссылку на пресс-папку. `Booking` остаётся доступен и из меню.
- **Сохраняем действующие контакты менеджера** (те, что сейчас на сайте: mailto, WhatsApp, Telegram, Spotify, Instagram, Beatport, SoundCloud). Адрес почты показывать текстом с кнопкой «скопировать».

## 4. Материалы, которые нужно скачать или предоставить

| Что | Откуда | Зачем |
|---|---|---|
| 4 новых видео Батур / TRIP | Google Drive (ссылки в 3.7) | Live и hero |
| 6 роликов Played by (5 есть, Vintage Culture нет) | Google Drive (ссылки в 3.9) | Played by |
| Обложки 5 релизов | Spotify oEmbed или файлы | Selected Releases |
| Официальные логотипы лейблов: Diynamic, Insomniac / IN / ROTATION, Smash The House, Armada, Kontor, Bar 25 Music | **файлов нет**, нужны от клиента (SVG/PNG прозрачные) | Hero |
| Ролик Vintage Culture | клиент | Played by |
| Окончательный фрагмент Батура для hero | клиент выбирает | Hero |

Файлы с Google Drive терминал сам может не скачать (нужен доступ). Скачайте их вручную в `Все что нужно тут\Video\New\` и `...\Support\`, затем запускайте обработку по правилам TECH-SPEC раздел 4 (сжатие, постеры, превью).

## 5. Что обновить в проверке полноты (`verify-coverage.mjs`)

Новый манифест проверок (падать, если не выполнено):
1. 5 релизов: обложка, название, лейбл, ссылка Spotify.
2. Блок коллаборации: видео CamelPhat, подпись содержит слово `Upcoming`.
3. Highlights: Music 8 пунктов, Touring 4 пункта; в Music нет повтора Diynamic Top 10.
4. Скриншоты Diynamic (2) рядом с абзацем про Top 10, афиша тура у пункта про Австралию.
5. Радио: 2 карточки 3:4, у каждой плеер и афиша.
6. Live: выведены Trip Main Stage, Savaya (первое), Savaya (четвёртое), Flava Moscow, плюс выбранные Батур / TRIP; **нет** `V06`; нет строк `Flava Back`, `Los Goodman`, `Gioli`.
7. Played by: 6 карточек; CamelPhat не имеет второго большого плеера.
8. Нет маркеров `TODO_*` в production-сборке.
9. Отчёт `COVERAGE.md` по этим пунктам.

## 6. Открытые вопросы к заказчику

1. **Showreel (V02 `dr17.mp4`, V03 Desa Kitsuné) и V01 (Tomorrowland), V09 (Umbrella Zürich):** в брифе клиента они не упомянуты. Оставляем, убираем или заменяем новыми видео? По умолчанию: **убрать отдельный блок Showreel**, Live собрать из нового отбора.
2. Присылает ли клиент **логотипы лейблов** в векторе? Без них hero не закончить.
3. **Био: «five releases on Diynamic»** против списка Selected Releases (3 релиза на Diynamic). Уточнить у клиента, что имеется в виду (EP и синглы?), чтобы цифры не расходились.
4. **Hero-видео:** окончательный фрагмент Батура пока не выбран. Использовать `Vulcano Batur Set` по умолчанию.
5. **Третья карточка Savaya** = `V06`? Подтвердить.
6. Меню: подтвердить список пунктов (Intro / Releases / Live / Played by / Bio / Booking).

## 6.5 Что в этой версии даёт выигрыш по скорости

Убрав фотоколлаж, большую галерею, карусель фото, блок дат с карточками и полный райдер, мы снимаем основную часть тяжёлых слоёв на мобильных. Тяжёлым остаётся стекло: упрощённый режим на мобильных из предыдущего промпта обязателен.

## 7. Промпты для терминала

### Промпт A: применить бриф (один раз, большой)
```
Прочитай CLIENT-EDITS-2026-10-22.md и client-brief/Oppaacha_Website_Brief.pdf. Это правки клиента: они заменяют противоречащие разделы TECH-SPEC.md. DESIGN-SYSTEM.md (палитра, шрифты, Liquid Glass, запрет серой подложки в hero) остаётся в силе.

Сделай по шагам, после каждого шага git commit и git push в origin main:
1. Обнови content/*.json по разделам 3.1-3.10 (тексты дословно, ссылки как в таблицах). Если данных нет, оставь маркер TODO_* и перечисли в конце, чего не хватает.
2. Перестрой порядок блоков по таблице раздела 1.
3. Hero: убери фотоколлаж (tilted-grid-hero), поставь видео Батура (если файла ещё нет, используй кадр client-brief/batur-hero-frame-1920x1080.jpg как постер), добавь тексты, ряд логотипов лейблов (пока заглушки-текст, если логотипы не присланы) и кнопки Listen · Watch · Booking.
4. Selected Releases, блок коллаборации CamelPhat, Bio & Highlights, Become Human Records, Radio mixes, Played by, финальный блок: по разделу 3. Все плееры (Spotify, SoundCloud) подгружай по нажатию.
5. Убери: блок дат тура, полный раздел Rider (кнопка Download rider остаётся), большую фото-галерею, лишние Live-видео (V06 и дубли).
6. Подписи: формат площадка / событие · город; без Flava Back, Los Goodman, Gioli.
7. Перепиши scripts/verify-coverage.mjs по разделу 5 и обнови COVERAGE.md.
8. После каждого блока critique, детектор Impeccable, правки, затем пуш.
```

### Промпт B: когда придут видео и логотипы
```
Новые файлы лежат в Все что нужно тут\Video\New и Support. Для каждого прогони медиа-пайплайн TECH-SPEC раздел 4 (1080 и 720 mp4, 6-секундное превью, AVIF-постер, манифест). Подставь в Live: Батур Vulcano Set, Promise Yourself Batur, TRIP Umbrella, TRIP 2025 Axe. Выбери 4-5 сильнейших, остальные не выкладывай. Подставь логотипы лейблов в hero (выровнять по оптическому размеру, монохромные, в цвет --ink). Обнови COVERAGE.md, critique, пуш.
```
