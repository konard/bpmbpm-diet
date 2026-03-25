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
// Шкала покрывает диапазон IMT_MIN_SHKALA..IMT_MAX_SHKALA
// =====================================================
function poziciyaNaShkale(imt) {
    // Ограничиваем значение в пределах шкалы
    var imtOgranichennoe = Math.max(IMT_MIN_SHKALA, Math.min(IMT_MAX_SHKALA, imt));
    var procent = (imtOgranichennoe - IMT_MIN_SHKALA) / (IMT_MAX_SHKALA - IMT_MIN_SHKALA) * 100;
    return procent;
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

    // Перемещаем стрелку-указатель на шкале
    var procent = poziciyaNaShkale(imt);
    document.getElementById('scaleIndicator').style.left = procent + '%';

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
