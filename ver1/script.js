// =====================================================
// Калькулятор диеты — основная логика
// Расчёт ИМТ и суточной нормы калорий (Миффлин-Сан Жеор)
// =====================================================

// --- Константы для интерпретации ИМТ ---

// Границы категорий ИМТ
var GRANICA_DEFICIT = 18.5;   // ниже — дефицит
var GRANICA_NORMA = 25.0;     // ниже — норма
var GRANICA_IZBYTOK = 30.0;   // ниже — избыток, выше — ожирение

// Описания категорий с CSS-классами
var KATEGORII_IMT = [
    { nazvanie: 'Дефицит',  klass: 'category-deficit' },
    { nazvanie: 'Норма',    klass: 'category-norm'    },
    { nazvanie: 'Избыток',  klass: 'category-excess'  },
    { nazvanie: 'Ожирение', klass: 'category-obesity' }
];

// Минимальное и максимальное значение ИМТ для позиции на шкале (визуально)
var IMT_MIN_SHKALA = 10;
var IMT_MAX_SHKALA = 45;

// =====================================================
// Основная функция расчёта
// =====================================================
function рассчитать() {
    // Считываем значения из формы
    var polEl = document.querySelector('input[name="pol"]:checked');
    var vozrastEl = document.getElementById('vozrast');
    var rostEl = document.getElementById('rost');
    var vesEl = document.getElementById('ves');
    var aktivnostEl = document.getElementById('aktivnost');

    // Получаем строковые значения
    var pol = polEl ? polEl.value : null;
    var vozrast = parseFloat(vozrastEl.value);
    var rost = parseFloat(rostEl.value);
    var ves = parseFloat(vesEl.value);
    var aktivnost = parseFloat(aktivnostEl.value);

    // Валидация введённых данных
    var oshibka = validirovat(pol, vozrast, rost, ves, aktivnost);
    if (oshibka) {
        pokazatOshibku(oshibka);
        skrytResultaty();
        return;
    }

    // Скрываем сообщение об ошибке, если оно было
    skrytOshibku();

    // Рассчитываем ИМТ
    var imt = rasschetatIMT(rost, ves);

    // Определяем категорию ИМТ
    var kategoriya = opredelitKategoriyu(imt);

    // Рассчитываем суточную норму калорий по Миффлину-Сан Жеору
    var kaloriiBase = rasschetatKaloriiBase(pol, vozrast, rost, ves);
    var kaloriiNorma = kaloriiBase * aktivnost;

    // Сохраняем параметры в URL для возможности поделиться ссылкой
    sohranitVUrl();

    // Отображаем результаты
    pokazatResultaty(imt, kategoriya, kaloriiBase, kaloriiNorma);
}

// =====================================================
// Расчёт индекса массы тела
// Формула: ИМТ = вес(кг) / рост²(м)
// =====================================================
function rasschetatIMT(rostCm, vesKg) {
    var rostM = rostCm / 100;          // переводим сантиметры в метры
    return vesKg / (rostM * rostM);    // формула ИМТ
}

// =====================================================
// Расчёт базового обмена веществ (формула Миффлина-Сан Жеора)
// Мужчины: 10*вес + 6.25*рост - 5*возраст + 5
// Женщины: 10*вес + 6.25*рост - 5*возраст - 161
// =====================================================
function rasschetatKaloriiBase(pol, vozrast, rostCm, vesKg) {
    var base = 10 * vesKg + 6.25 * rostCm - 5 * vozrast;
    if (pol === 'm') {
        return base + 5;      // поправка для мужчин
    } else {
        return base - 161;    // поправка для женщин
    }
}

// =====================================================
// Определение категории ИМТ
// Возвращает индекс в массиве KATEGORII_IMT
// =====================================================
function opredelitKategoriyu(imt) {
    if (imt < GRANICA_DEFICIT) {
        return 0; // Дефицит
    } else if (imt < GRANICA_NORMA) {
        return 1; // Норма
    } else if (imt < GRANICA_IZBYTOK) {
        return 2; // Избыток
    } else {
        return 3; // Ожирение
    }
}

// =====================================================
// Вычисляет положение стрелки на шкале (в процентах)
// Учитывает реальные пропорции сегментов шкалы (flex-значения в CSS),
// которые не совпадают с линейным распределением по ИМТ.
// Сегменты шкалы (flex): Дефицит=1.85, Норма=1.65, Избыток=1, Ожирение=2
// Итого flex: 6.5
// =====================================================
function poziciyaNaShkale(imt) {
    // Параметры сегментов: [нижняя граница ИМТ, верхняя граница ИМТ, flex-значение]
    var segmenty = [
        { ot: IMT_MIN_SHKALA, do: GRANICA_DEFICIT,  flex: 1.85 },  // Дефицит: ИМТ 10–18.5
        { ot: GRANICA_DEFICIT, do: GRANICA_NORMA,    flex: 1.65 },  // Норма:   ИМТ 18.5–25
        { ot: GRANICA_NORMA,   do: GRANICA_IZBYTOK,  flex: 1    },  // Избыток: ИМТ 25–30
        { ot: GRANICA_IZBYTOK, do: IMT_MAX_SHKALA,   flex: 2    }   // Ожирение: ИМТ 30–45
    ];

    // Суммарный flex всех сегментов
    var totalFlex = 0;
    for (var i = 0; i < segmenty.length; i++) {
        totalFlex += segmenty[i].flex;
    }

    // Ограничиваем значение ИМТ в пределах шкалы
    var imtOgranichennoe = Math.max(IMT_MIN_SHKALA, Math.min(IMT_MAX_SHKALA, imt));

    // Находим сегмент, в котором находится ИМТ, и накапливаем позицию
    var poziciya = 0;
    for (var j = 0; j < segmenty.length; j++) {
        var seg = segmenty[j];
        if (imtOgranichennoe <= seg.do) {
            // ИМТ находится внутри этого сегмента
            var dolya = (imtOgranichennoe - seg.ot) / (seg.do - seg.ot);
            poziciya += dolya * (seg.flex / totalFlex) * 100;
            break;
        } else {
            // ИМТ выше этого сегмента — добавляем его полную ширину
            poziciya += (seg.flex / totalFlex) * 100;
        }
    }

    return poziciya;
}

// =====================================================
// Отображает результаты на странице
// =====================================================
function pokazatResultaty(imt, kategoriyaIndeks, kaloriiBase, kaloriiNorma) {
    var kategoriya = KATEGORII_IMT[kategoriyaIndeks];

    // Отображаем числовое значение ИМТ (округляем до 2 знаков)
    document.getElementById('imtValue').textContent = imt.toFixed(2);

    // Отображаем название категории с нужным цветом
    var imtCategoryEl = document.getElementById('imtCategory');
    imtCategoryEl.textContent = kategoriya.nazvanie;
    imtCategoryEl.className = 'result-category ' + kategoriya.klass;

    // Перемещаем стрелку-указатель на шкале и отображаем значение ИМТ рядом
    var procent = poziciyaNaShkale(imt);
    document.getElementById('scaleIndicator').style.left = procent + '%';
    document.getElementById('scaleIndicatorValue').textContent = imt.toFixed(1);

    // Отображаем базовый обмен веществ
    document.getElementById('bazovyObmen').textContent = Math.round(kaloriiBase) + ' ккал/сут';

    // Отображаем суточную норму с учётом активности
    document.getElementById('sutochnyaNorma').textContent = Math.round(kaloriiNorma) + ' ккал/сут';

    // Отображаем советы по калориям
    var deficitKkal = Math.round(kaloriiNorma * 0.8);   // -20% для похудения
    var proficitKkal = Math.round(kaloriiNorma * 1.2);  // +20% для набора
    document.getElementById('caloriesTips').innerHTML =
        '<strong>Совет:</strong> Для поддержания веса потребляйте ' + Math.round(kaloriiNorma) + ' ккал/сут.<br>' +
        'Для снижения веса: ~' + deficitKkal + ' ккал/сут (дефицит 20%).<br>' +
        'Для набора веса: ~' + proficitKkal + ' ккал/сут (профицит 20%).';

    // Показываем блок результатов
    document.getElementById('resultsCard').style.display = 'block';

    // Прокручиваем страницу к результатам
    document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// =====================================================
// Сбрасывает форму и скрывает результаты
// =====================================================
function сбросить() {
    document.getElementById('vozrast').value = '';
    document.getElementById('rost').value = '';
    document.getElementById('ves').value = '';
    document.getElementById('aktivnost').selectedIndex = 0;

    // Возвращаем пол по умолчанию (мужской)
    document.getElementById('pol-m').checked = true;

    // Скрываем результаты и ошибки
    skrytResultaty();
    skrytOshibku();

    // Очищаем параметры в URL
    history.replaceState(null, '', window.location.pathname);
}

// =====================================================
// Вспомогательные функции отображения
// =====================================================

function pokazatOshibku(tekst) {
    var el = document.getElementById('errorMessage');
    el.textContent = tekst;
    el.style.display = 'block';
}

function skrytOshibku() {
    document.getElementById('errorMessage').style.display = 'none';
}

function skrytResultaty() {
    document.getElementById('resultsCard').style.display = 'none';
}

// =====================================================
// Валидация введённых данных
// Возвращает строку с ошибкой или null если всё ок
// =====================================================
function validirovat(pol, vozrast, rost, ves, aktivnost) {
    if (!pol) {
        return 'Пожалуйста, выберите пол.';
    }
    if (isNaN(vozrast) || vozrast === '') {
        return 'Пожалуйста, введите возраст.';
    }
    if (vozrast < 13 || vozrast > 80) {
        return 'Возраст должен быть от 13 до 80 лет (ограничение формулы Миффлина-Сан Жеора).';
    }
    if (isNaN(rost) || rost === '') {
        return 'Пожалуйста, введите рост.';
    }
    if (rost < 100 || rost > 250) {
        return 'Рост должен быть от 100 до 250 см.';
    }
    if (isNaN(ves) || ves === '') {
        return 'Пожалуйста, введите вес.';
    }
    if (ves < 20 || ves > 300) {
        return 'Вес должен быть от 20 до 300 кг.';
    }
    if (isNaN(aktivnost)) {
        return 'Пожалуйста, выберите уровень физической активности.';
    }
    return null; // ошибок нет
}

// =====================================================
// Управление меню справки
// =====================================================

// Переключает отображение выпадающего меню справки
function переключитьМенюСправки() {
    var menu = document.getElementById('helpMenu');
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
}

// Закрывает меню справки при клике вне его
document.addEventListener('click', function(event) {
    var container = document.getElementById('helpMenu');
    var btn = document.getElementById('helpBtn');
    if (!btn.contains(event.target) && !container.contains(event.target)) {
        container.style.display = 'none';
    }
});

// =====================================================
// Функции отображения справки в модальном окне
// Загружает markdown-файл и конвертирует в HTML
// =====================================================

// Конфигурация файлов справки
var FAJLY_SPRAVKI = {
    'bmi':     { zagolovok: 'Калькулятор индекса массы тела', fajl: 'help/bmi.md' },
    'mifflin': { zagolovok: 'Формула Миффлина-Сан Жеора для расчёта суточной нормы калорий', fajl: 'help/mifflin.md' }
};

// Открывает модальное окно со справкой
function открытьСправку(klyuch) {
    // Скрываем меню
    document.getElementById('helpMenu').style.display = 'none';

    var config = FAJLY_SPRAVKI[klyuch];
    if (!config) return;

    // Устанавливаем заголовок окна
    document.getElementById('modalTitle').textContent = config.zagolovok;
    document.getElementById('modalBody').innerHTML = '<p>Загрузка...</p>';
    document.getElementById('modalOverlay').style.display = 'flex';

    // Загружаем markdown-файл через fetch
    fetch(config.fajl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Не удалось загрузить файл справки.');
            }
            return response.text();
        })
        .then(function(markdownTekst) {
            // Конвертируем markdown в HTML с помощью библиотеки marked.js
            document.getElementById('modalBody').innerHTML = marked.parse(markdownTekst);
        })
        .catch(function(oshibka) {
            document.getElementById('modalBody').innerHTML =
                '<p style="color: red;">Ошибка загрузки справки: ' + oshibka.message + '</p>';
        });
}

// Закрывает модальное окно справки
function закрытьСправку() {
    document.getElementById('modalOverlay').style.display = 'none';
}

// Закрытие по нажатию клавиши Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        закрытьСправку();
        document.getElementById('helpMenu').style.display = 'none';
    }
});

// =====================================================
// Сохранение параметров в URL и восстановление из URL
// Параметры: pol (m/f), vozrast, rost, ves, aktivnost
// =====================================================

// Сохраняет текущие значения формы в URL (hash-параметры)
function sohranitVUrl() {
    var polEl = document.querySelector('input[name="pol"]:checked');
    var pol = polEl ? polEl.value : '';
    var vozrast = document.getElementById('vozrast').value;
    var rost = document.getElementById('rost').value;
    var ves = document.getElementById('ves').value;
    var aktivnost = document.getElementById('aktivnost').value;

    // Формируем строку параметров
    var params = new URLSearchParams();
    if (pol)       params.set('pol', pol);
    if (vozrast)   params.set('vozrast', vozrast);
    if (rost)      params.set('rost', rost);
    if (ves)       params.set('ves', ves);
    if (aktivnost) params.set('aktivnost', aktivnost);

    // Записываем параметры в хэш-часть URL (без перезагрузки страницы)
    history.replaceState(null, '', '?' + params.toString());
}

// Восстанавливает значения формы из URL (если параметры есть)
function vosstanovitIzUrl() {
    var params = new URLSearchParams(window.location.search);

    var pol       = params.get('pol');
    var vozrast   = params.get('vozrast');
    var rost      = params.get('rost');
    var ves       = params.get('ves');
    var aktivnost = params.get('aktivnost');

    // Заполняем поля формы, если параметры присутствуют в URL
    if (pol === 'm' || pol === 'f') {
        var radioId = pol === 'm' ? 'pol-m' : 'pol-f';
        document.getElementById(radioId).checked = true;
    }
    if (vozrast) document.getElementById('vozrast').value = vozrast;
    if (rost)    document.getElementById('rost').value = rost;
    if (ves)     document.getElementById('ves').value = ves;
    if (aktivnost) {
        var select = document.getElementById('aktivnost');
        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].value === aktivnost) {
                select.selectedIndex = i;
                break;
            }
        }
    }

    // Если все основные параметры присутствуют — автоматически рассчитываем результат
    if (vozrast && rost && ves) {
        рассчитать();
    }
}

// Восстанавливаем данные из URL сразу при загрузке скрипта
// (скрипт подключён в конце body, поэтому DOM уже готов)
vosstanovitIzUrl();
