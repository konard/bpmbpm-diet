// =====================================================
// Трекер питания — основная логика
// =====================================================

// =====================================================
// РАЗДЕЛ 1: СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// Единый объект, хранящий все данные текущей сессии
// =====================================================

var sostoyanie = {
    // Текущая выбранная дата в формате 'YYYY-MM-DD'
    tekushayaData: '',

    // Профиль пользователя
    profil: {
        pol: 'm',           // 'm' — мужской, 'f' — женский
        vozrast: 30,        // возраст в годах
        rost: 170,          // рост в сантиметрах
        ves: 70,            // вес в килограммах
        aktivnost: 1.55,    // коэффициент физической активности
        cel: 'maintain',    // 'lose' — похудение, 'maintain' — поддержание, 'gain' — набор
        belokProcent: 25,   // доля белков в % от калорий
        zhirProcent: 30,    // доля жиров в % от калорий
        uglevodyProcent: 45 // доля углеводов в % от калорий
    },

    // Дневник питания: ключ — дата ('YYYY-MM-DD'), значение — приёмы пищи
    // Структура каждого дня:
    // { zavtrak: [...], obed: [...], uzhin: [...], perekus: [...] }
    dnevnik: {},

    // Упражнения: ключ — дата, значение — массив упражнений
    uprazhneniya: {},

    // Текущий язык интерфейса
    yazyk: 'ru'
};

// =====================================================
// РАЗДЕЛ 2: ПЕРЕВОДЫ (I18N)
// Тексты интерфейса на русском и английском языках
// =====================================================

var PEREVODY = {
    ru: {
        appTitle: 'Трекер питания',
        tabDiary: 'Дневник',
        tabDashboard: 'Дашборд',
        tabProfile: 'Профиль',
        tabExercise: 'Упражнения',
        tabHelp: 'Справка',
        userBtn: 'Пользователь',
        loadUserData: 'Загрузить данные пользователя',
        saveUserData: 'Сохранить данные пользователя',
        loadTestData: 'Загрузить тестовые данные',
        profileTitle: 'Профиль',
        genderLabel: 'Пол',
        male: 'Мужской',
        female: 'Женский',
        ageLabel: 'Возраст, лет',
        heightLabel: 'Рост, см',
        weightLabel: 'Вес, кг',
        activityLabel: 'Физическая активность',
        act1: 'Минимальная (сидячая работа)',
        act2: 'Слабая (1–3 тренировки в неделю)',
        act3: 'Умеренная (3–4 тренировки в неделю)',
        act4: 'Высокая (5–7 дней в неделю)',
        act5: 'Экстремальная (ежедневно + физический труд)',
        goalLabel: 'Цель',
        goalLose: 'Снижение веса',
        goalMaintain: 'Поддержание веса',
        goalGain: 'Набор массы',
        proteinPctLabel: 'Белки, % калорий',
        fatPctLabel: 'Жиры, % калорий',
        carbsPctLabel: 'Углеводы, % калорий',
        saveProfile: 'Сохранить профиль',
        bmiTitle: 'Индекс массы тела (ИМТ)',
        bmiDeficit: 'Дефицит',
        bmiNorm: 'Норма',
        bmiExcess: 'Избыток',
        bmiObesity: 'Ожирение',
        caloriesTitle: 'Суточная норма калорий',
        bmrLabel: 'Базовый обмен (BMR):',
        tdeeLabel: 'Суточная норма (TDEE):',
        targetKcalLabel: 'Цель по калориям:',
        caloriesLabel: 'Калории',
        protein: 'Белки',
        fat: 'Жиры',
        carbs: 'Углеводы',
        addFoodTitle: 'Добавить продукт',
        searchPlaceholder: 'Поиск продукта...',
        portionLabel: 'Порция, г',
        addBtn: 'Добавить',
        cancelBtn: 'Отмена',
        loadUserTitle: 'Загрузить данные пользователя',
        helpTitle: 'Справка',
        helpGeneral: '📖 Общая справка',
        helpDiary: '📖 Дневник питания',
        helpProfile: '📖 Профиль и цели',
        helpNutrients: '📖 Витамины и минералы',
        mealBreakfast: 'Завтрак',
        mealLunch: 'Обед',
        mealDinner: 'Ужин',
        mealSnack: 'Перекус',
        dashCaloriesTitle: 'Калории сегодня',
        dashProteinTitle: 'Белки',
        dashFatTitle: 'Жиры',
        dashCarbsTitle: 'Углеводы',
        dashBmiTitle: 'ИМТ',
        dashTdeeTitle: 'Суточная норма (TDEE)',
        weekChartTitle: 'Калории за 7 дней',
        nutrientsProgressTitle: 'Витамины и минералы (% от нормы)',
        addExerciseTitle: 'Добавить упражнение',
        exerciseNameLabel: 'Название',
        exerciseNamePlaceholder: 'Бег, плавание...',
        exerciseDurationLabel: 'Длительность, мин',
        exerciseCalLabel: 'Сожжено ккал',
        foodColName: 'Продукт',
        foodColGrams: 'г',
        foodColKcal: 'ккал',
        foodColProtein: 'Б',
        foodColFat: 'Ж',
        foodColCarbs: 'У',
        exerciseTotalLabel: 'Сожжено калорий за день:',
        noFoodFound: 'Продукты не найдены',
        noExercise: 'Упражнения не добавлены',
        kcalUnit: 'ккал',
        gUnit: 'г',
        minUnit: 'мин'
    },
    en: {
        appTitle: 'Diet Tracker',
        tabDiary: 'Diary',
        tabDashboard: 'Dashboard',
        tabProfile: 'Profile',
        tabExercise: 'Exercise',
        tabHelp: 'Help',
        userBtn: 'User',
        loadUserData: 'Load user data',
        saveUserData: 'Save user data',
        loadTestData: 'Load test data',
        profileTitle: 'Profile',
        genderLabel: 'Gender',
        male: 'Male',
        female: 'Female',
        ageLabel: 'Age, years',
        heightLabel: 'Height, cm',
        weightLabel: 'Weight, kg',
        activityLabel: 'Physical activity',
        act1: 'Minimal (sedentary)',
        act2: 'Light (1–3 workouts/week)',
        act3: 'Moderate (3–4 workouts/week)',
        act4: 'High (5–7 days/week)',
        act5: 'Extreme (daily + physical work)',
        goalLabel: 'Goal',
        goalLose: 'Weight loss',
        goalMaintain: 'Maintain weight',
        goalGain: 'Gain mass',
        proteinPctLabel: 'Protein, % of calories',
        fatPctLabel: 'Fat, % of calories',
        carbsPctLabel: 'Carbs, % of calories',
        saveProfile: 'Save profile',
        bmiTitle: 'Body Mass Index (BMI)',
        bmiDeficit: 'Deficit',
        bmiNorm: 'Normal',
        bmiExcess: 'Excess',
        bmiObesity: 'Obese',
        caloriesTitle: 'Daily calorie target',
        bmrLabel: 'Basal metabolic rate (BMR):',
        tdeeLabel: 'Total daily energy expenditure (TDEE):',
        targetKcalLabel: 'Calorie goal:',
        caloriesLabel: 'Calories',
        protein: 'Protein',
        fat: 'Fat',
        carbs: 'Carbs',
        addFoodTitle: 'Add food',
        searchPlaceholder: 'Search food...',
        portionLabel: 'Portion, g',
        addBtn: 'Add',
        cancelBtn: 'Cancel',
        loadUserTitle: 'Load user data',
        helpTitle: 'Help',
        helpGeneral: '📖 General help',
        helpDiary: '📖 Food diary',
        helpProfile: '📖 Profile & goals',
        helpNutrients: '📖 Vitamins & minerals',
        mealBreakfast: 'Breakfast',
        mealLunch: 'Lunch',
        mealDinner: 'Dinner',
        mealSnack: 'Snack',
        dashCaloriesTitle: 'Calories today',
        dashProteinTitle: 'Protein',
        dashFatTitle: 'Fat',
        dashCarbsTitle: 'Carbs',
        dashBmiTitle: 'BMI',
        dashTdeeTitle: 'Daily norm (TDEE)',
        weekChartTitle: 'Calories for 7 days',
        nutrientsProgressTitle: 'Vitamins & minerals (% of norm)',
        addExerciseTitle: 'Add exercise',
        exerciseNameLabel: 'Name',
        exerciseNamePlaceholder: 'Running, swimming...',
        exerciseDurationLabel: 'Duration, min',
        exerciseCalLabel: 'Calories burned',
        foodColName: 'Food',
        foodColGrams: 'g',
        foodColKcal: 'kcal',
        foodColProtein: 'P',
        foodColFat: 'F',
        foodColCarbs: 'C',
        exerciseTotalLabel: 'Calories burned today:',
        noFoodFound: 'No foods found',
        noExercise: 'No exercises added',
        kcalUnit: 'kcal',
        gUnit: 'g',
        minUnit: 'min'
    }
};

// =====================================================
// РАЗДЕЛ 3: ДАННЫЕ ПРОДУКТОВ И ПИТАТЕЛЬНЫХ ВЕЩЕСТВ
// =====================================================

var baza_produktov = [];       // массив продуктов из foods.json
var vitaminyDannyje = null;    // данные о витаминах
var mineralyDannyje = null;    // данные о минералах

// Имена приёмов пищи (ключи в объекте дневника)
var PRIEMY_PISHCHI = ['zavtrak', 'obed', 'uzhin', 'perekus'];

// Загрузка всех справочных данных при старте
function zagruzitDannye() {
    // Загружаем базу продуктов
    fetch('data/foods.json')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            baza_produktov = data.products;
        })
        .catch(function(err) {
            console.error('Ошибка загрузки базы продуктов:', err);
        });

    // Загружаем витамины и минералы
    Promise.all([
        fetch('data/vitamins.json').then(function(r) { return r.json(); }),
        fetch('data/minerals.json').then(function(r) { return r.json(); })
    ]).then(function(dannye) {
        vitaminyDannyje = dannye[0];
        mineralyDannyje = dannye[1];
    }).catch(function(err) {
        console.error('Ошибка загрузки данных питательных веществ:', err);
    });
}

// =====================================================
// РАЗДЕЛ 4: НАВИГАЦИЯ — ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
// =====================================================

// Показывает нужный раздел и скрывает остальные
function pokazatRazdel(nazvanie) {
    // Скрываем все секции
    var sekcii = document.querySelectorAll('.app-section');
    for (var i = 0; i < sekcii.length; i++) {
        sekcii[i].style.display = 'none';
    }

    // Убираем класс active со всех вкладок
    var vkladki = document.querySelectorAll('.nav-tab');
    for (var j = 0; j < vkladki.length; j++) {
        vkladki[j].classList.remove('active');
    }

    // Показываем нужную секцию
    var sekcia = document.getElementById('section-' + nazvanie);
    if (sekcia) {
        sekcia.style.display = 'block';
    }

    // Помечаем активную вкладку
    var aktivnayaVkladka = document.getElementById('tab-' + nazvanie);
    if (aktivnayaVkladka) {
        aktivnayaVkladka.classList.add('active');
    }

    // Обновляем содержимое раздела
    if (nazvanie === 'diary') {
        otobraziDnevnik();
    } else if (nazvanie === 'dashboard') {
        otobrazitDashboard();
    } else if (nazvanie === 'profile') {
        zapolnitFormuProfila();
    } else if (nazvanie === 'exercise') {
        otobrazitUprazhneniya();
    }

    // Закрываем все меню
    zakrytVseMenuShapki();
}

// =====================================================
// РАЗДЕЛ 5: ДАТА И ДНЕВНИК ПИТАНИЯ
// =====================================================

// Возвращает дату в формате 'YYYY-MM-DD'
function poluchitDatuKak_YYYY_MM_DD(data) {
    var god = data.getFullYear();
    var mesyac = String(data.getMonth() + 1).padStart(2, '0');
    var den = String(data.getDate()).padStart(2, '0');
    return god + '-' + mesyac + '-' + den;
}

// Переводим дату в читаемый вид для отображения
function formatirovatDatuDlyaEkrana(strokaData) {
    var chasti = strokaData.split('-');
    var data = new Date(parseInt(chasti[0]), parseInt(chasti[1]) - 1, parseInt(chasti[2]));

    var nazvaniaDnej = {
        ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };
    var nazvaniaMesyacev = {
        ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
             'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
        en: ['January', 'February', 'March', 'April', 'May', 'June',
             'July', 'August', 'September', 'October', 'November', 'December']
    };

    var yazyk = sostoyanie.yazyk;
    var denNedeli = nazvaniaDnej[yazyk][data.getDay()];
    var mesyac = nazvaniaMesyacev[yazyk][data.getMonth()];
    var den = data.getDate();
    var god = data.getFullYear();

    if (yazyk === 'ru') {
        return denNedeli + ', ' + den + ' ' + mesyac + ' ' + god;
    } else {
        return denNedeli + ', ' + mesyac + ' ' + den + ', ' + god;
    }
}

// Изменяет текущую дату на ±1 день
function izmentatDatu(delta) {
    var chasti = sostoyanie.tekushayaData.split('-');
    var data = new Date(parseInt(chasti[0]), parseInt(chasti[1]) - 1, parseInt(chasti[2]));
    data.setDate(data.getDate() + delta);
    sostoyanie.tekushayaData = poluchitDatuKak_YYYY_MM_DD(data);
    otobraziDnevnik();
}

// Возвращает объект дня из дневника (создаёт если нет)
function poluchitDenDnevnika(data) {
    if (!sostoyanie.dnevnik[data]) {
        sostoyanie.dnevnik[data] = {
            zavtrak: [],
            obed: [],
            uzhin: [],
            perekus: []
        };
    }
    return sostoyanie.dnevnik[data];
}

// Рассчитывает нутриенты продукта для заданного количества граммов
function schislatNutrienty(produkt, grammy) {
    var k = grammy / 100;  // коэффициент масштабирования
    var p = produkt.per100g;
    return {
        id:       produkt.id,
        nazvanie: produkt.name,
        grammy:   grammy,
        kcal:     Math.round(p.kcal    * k * 10) / 10,
        protein:  Math.round(p.protein * k * 10) / 10,
        fat:      Math.round(p.fat     * k * 10) / 10,
        carbs:    Math.round(p.carbs   * k * 10) / 10,
        fiber:    Math.round((p.fiber  || 0) * k * 10) / 10,
        // Микронутриенты для дашборда
        vit_d:    Math.round(p.vit_d   * k * 100) / 100,
        vit_c:    Math.round(p.vit_c   * k * 10)  / 10,
        vit_a:    Math.round(p.vit_a   * k * 10)  / 10,
        vit_b12:  Math.round(p.vit_b12 * k * 100) / 100,
        iron:     Math.round(p.iron    * k * 100) / 100,
        calcium:  Math.round(p.calcium * k * 10)  / 10,
        magnesium:Math.round(p.magnesium * k * 10) / 10,
        potassium:Math.round(p.potassium * k * 10) / 10,
        sodium:   Math.round(p.sodium  * k * 10)  / 10,
        zinc:     Math.round(p.zinc    * k * 100) / 100
    };
}

// Добавляет продукт в нужный приём пищи за текущую дату
function dobavitProductVDnevnik(priem, produkt, grammy) {
    var den = poluchitDenDnevnika(sostoyanie.tekushayaData);
    var zapis = schislatNutrienty(produkt, grammy);
    den[priem].push(zapis);
}

// Удаляет продукт из приёма пищи по индексу
function udalitProductIzDnevnika(priem, indeks) {
    var den = poluchitDenDnevnika(sostoyanie.tekushayaData);
    den[priem].splice(indeks, 1);
    otobraziDnevnik();
}

// Считает итого нутриентов за день (все приёмы)
function schislatItogoDnya(data) {
    var itogo = { kcal: 0, protein: 0, fat: 0, carbs: 0 };
    var den = sostoyanie.dnevnik[data];
    if (!den) return itogo;

    for (var i = 0; i < PRIEMY_PISHCHI.length; i++) {
        var priem = den[PRIEMY_PISHCHI[i]];
        if (!priem) continue;
        for (var j = 0; j < priem.length; j++) {
            itogo.kcal    += priem[j].kcal    || 0;
            itogo.protein += priem[j].protein || 0;
            itogo.fat     += priem[j].fat     || 0;
            itogo.carbs   += priem[j].carbs   || 0;
        }
    }

    return {
        kcal:    Math.round(itogo.kcal    * 10) / 10,
        protein: Math.round(itogo.protein * 10) / 10,
        fat:     Math.round(itogo.fat     * 10) / 10,
        carbs:   Math.round(itogo.carbs   * 10) / 10
    };
}

// Считает суммарные микронутриенты за день (для дашборда)
function schislatMikroNutrienty(data) {
    var itogo = { vit_d: 0, vit_c: 0, vit_a: 0, vit_b12: 0,
                  iron: 0, calcium: 0, magnesium: 0, potassium: 0, sodium: 0, zinc: 0 };
    var den = sostoyanie.dnevnik[data];
    if (!den) return itogo;

    for (var i = 0; i < PRIEMY_PISHCHI.length; i++) {
        var priem = den[PRIEMY_PISHCHI[i]];
        if (!priem) continue;
        for (var j = 0; j < priem.length; j++) {
            var produkt = priem[j];
            itogo.vit_d     += produkt.vit_d     || 0;
            itogo.vit_c     += produkt.vit_c     || 0;
            itogo.vit_a     += produkt.vit_a     || 0;
            itogo.vit_b12   += produkt.vit_b12   || 0;
            itogo.iron      += produkt.iron      || 0;
            itogo.calcium   += produkt.calcium   || 0;
            itogo.magnesium += produkt.magnesium || 0;
            itogo.potassium += produkt.potassium || 0;
            itogo.sodium    += produkt.sodium    || 0;
            itogo.zinc      += produkt.zinc      || 0;
        }
    }
    return itogo;
}

// Рассчитывает цель по калориям из профиля
function rasschetatKaloriiCel() {
    var p = sostoyanie.profil;
    var bmr = rasschetatBMR(p.pol, p.vozrast, p.rost, p.ves);
    var tdee = bmr * p.aktivnost;

    if (p.cel === 'lose')     return Math.round(tdee * 0.8);
    if (p.cel === 'gain')     return Math.round(tdee * 1.15);
    return Math.round(tdee);  // maintain
}

// Рассчитывает цели по белкам/жирам/углеводам в граммах
function rasschetatCeliMakro() {
    var celKcal = rasschetatKaloriiCel();
    var p = sostoyanie.profil;
    return {
        protein: Math.round(celKcal * p.belokProcent / 100 / 4),  // 1г белка = 4 ккал
        fat:     Math.round(celKcal * p.zhirProcent  / 100 / 9),  // 1г жира  = 9 ккал
        carbs:   Math.round(celKcal * p.uglevodyProcent / 100 / 4) // 1г угл.  = 4 ккал
    };
}

// Отображает дневник питания на экране
function otobraziDnevnik() {
    // Обновляем отображение даты
    var dateEl = document.getElementById('dateDisplay');
    if (dateEl) {
        dateEl.textContent = formatirovatDatuDlyaEkrana(sostoyanie.tekushayaData);
    }

    // Рассчитываем итого дня
    var itogo = schislatItogoDnya(sostoyanie.tekushayaData);
    var celi = rasschetatCeliMakro();
    var celKcal = rasschetatKaloriiCel();

    // Показываем сводку (если есть данные)
    var summaryEl = document.getElementById('dailySummary');
    var den = sostoyanie.dnevnik[sostoyanie.tekushayaData];
    var estDannye = den && (
        (den.zavtrak && den.zavtrak.length > 0) ||
        (den.obed    && den.obed.length    > 0) ||
        (den.uzhin   && den.uzhin.length   > 0) ||
        (den.perekus && den.perekus.length > 0)
    );

    if (summaryEl) {
        summaryEl.style.display = estDannye ? 'block' : 'none';

        if (estDannye) {
            var t = PEREVODY[sostoyanie.yazyk];

            // Калории
            document.getElementById('summaryKcal').textContent = Math.round(itogo.kcal) + ' ' + t.kcalUnit;
            document.getElementById('summaryKcalGoal').textContent = '/ ' + celKcal + ' ' + t.kcalUnit;
            ustPolosuProcessa('progressKcal', itogo.kcal, celKcal);

            // Белки
            document.getElementById('summaryProtein').textContent = itogo.protein.toFixed(1) + ' ' + t.gUnit;
            ustPolosuProcessa('progressProtein', itogo.protein, celi.protein, 'protein-bar');

            // Жиры
            document.getElementById('summaryFat').textContent = itogo.fat.toFixed(1) + ' ' + t.gUnit;
            ustPolosuProcessa('progressFat', itogo.fat, celi.fat, 'fat-bar');

            // Углеводы
            document.getElementById('summaryCarbs').textContent = itogo.carbs.toFixed(1) + ' ' + t.gUnit;
            ustPolosuProcessa('progressCarbs', itogo.carbs, celi.carbs, 'carbs-bar');
        }
    }

    // Отображаем карточки приёмов пищи
    var container = document.getElementById('mealsContainer');
    if (!container) return;

    container.innerHTML = '';

    var nazvaniyaPriemov = {
        ru: { zavtrak: 'Завтрак', obed: 'Обед', uzhin: 'Ужин', perekus: 'Перекус' },
        en: { zavtrak: 'Breakfast', obed: 'Lunch', uzhin: 'Dinner', perekus: 'Snack' }
    };

    for (var i = 0; i < PRIEMY_PISHCHI.length; i++) {
        var klyuchPriema = PRIEMY_PISHCHI[i];
        var nazvaniePriema = nazvaniyaPriemov[sostoyanie.yazyk][klyuchPriema];
        container.appendChild(sozdatKartochkuPriema(klyuchPriema, nazvaniePriema));
    }
}

// Создаёт карточку одного приёма пищи
function sozdatKartochkuPriema(klyuchPriema, nazvanie) {
    var t = PEREVODY[sostoyanie.yazyk];
    var den = poluchitDenDnevnika(sostoyanie.tekushayaData);
    var produkty = den[klyuchPriema] || [];

    // Считаем ккал приёма
    var kcalPriema = 0;
    for (var i = 0; i < produkty.length; i++) {
        kcalPriema += produkty[i].kcal || 0;
    }

    var card = document.createElement('div');
    card.className = 'meal-card';

    // Заголовок карточки
    var header = document.createElement('div');
    header.className = 'meal-header';
    header.innerHTML =
        '<span class="meal-name">' + nazvanie + '</span>' +
        '<span class="meal-kcal">' + Math.round(kcalPriema) + ' ' + t.kcalUnit + '</span>';
    card.appendChild(header);

    // Таблица продуктов (если есть)
    if (produkty.length > 0) {
        var table = document.createElement('table');
        table.className = 'meal-foods';
        table.innerHTML =
            '<thead><tr>' +
            '<th>' + t.foodColName + '</th>' +
            '<th>' + t.foodColGrams + '</th>' +
            '<th>' + t.foodColKcal + '</th>' +
            '<th>' + t.foodColProtein + '</th>' +
            '<th>' + t.foodColFat + '</th>' +
            '<th>' + t.foodColCarbs + '</th>' +
            '<th></th>' +
            '</tr></thead><tbody></tbody>';

        var tbody = table.querySelector('tbody');

        for (var j = 0; j < produkty.length; j++) {
            var prod = produkty[j];
            var row = document.createElement('tr');
            // Используем замыкание через IIFE чтобы передать правильный индекс в onclick
            (function(priem, idx) {
                row.innerHTML =
                    '<td class="food-name-cell">' + prod.nazvanie + '</td>' +
                    '<td>' + prod.grammy + '</td>' +
                    '<td>' + Math.round(prod.kcal) + '</td>' +
                    '<td>' + prod.protein.toFixed(1) + '</td>' +
                    '<td>' + prod.fat.toFixed(1) + '</td>' +
                    '<td>' + prod.carbs.toFixed(1) + '</td>' +
                    '<td><button class="btn-delete-food" onclick="udalitProductIzDnevnika(\'' + priem + '\',' + idx + ')">✕</button></td>';
            })(klyuchPriema, j);
            tbody.appendChild(row);
        }

        card.appendChild(table);
    }

    // Кнопка добавления продукта
    var footer = document.createElement('div');
    footer.className = 'meal-footer';
    footer.innerHTML = '<button class="btn-add-food" onclick="otkrytPoiskProductov(\'' + klyuchPriema + '\')">' +
        '+ ' + t.addBtn + ' ' + t.foodColName.toLowerCase() +
        '</button>';
    card.appendChild(footer);

    return card;
}

// Устанавливает ширину полосы прогресса
function ustPolosuProcessa(id, znachenie, cel, dopolnitelnyKlass) {
    var el = document.getElementById(id);
    if (!el) return;

    var procent = cel > 0 ? (znachenie / cel * 100) : 0;
    el.style.width = Math.min(procent, 100) + '%';

    // Убираем класс перебора и добавляем если нужно
    el.classList.remove('over-goal');
    if (procent > 100) {
        el.classList.add('over-goal');
    }
}

// =====================================================
// РАЗДЕЛ 6: ПОИСК ПРОДУКТОВ
// =====================================================

// Текущий выбранный приём пищи для добавления
var tekushchijPriem = 'zavtrak';
// Индекс выбранного продукта из результатов поиска
var vybrannyProdukt = null;

// Открывает модальное окно поиска продукта
function otkrytPoiskProductov(priem) {
    tekushchijPriem = priem;
    vybrannyProdukt = null;

    // Очищаем форму поиска
    document.getElementById('foodSearchInput').value = '';
    document.getElementById('foodSearchResults').innerHTML = '';
    document.getElementById('foodPreview').style.display = 'none';
    document.getElementById('btnAddFood').style.display = 'none';
    document.getElementById('foodPortionGrams').value = '100';
    document.getElementById('foodNutrientsPreview').innerHTML = '';

    document.getElementById('modalFoodSearch').style.display = 'flex';

    // Фокус на строке поиска
    setTimeout(function() {
        document.getElementById('foodSearchInput').focus();
    }, 100);
}

// Закрывает модальное окно поиска
function zakrytPoiskProductov(event) {
    // event === null — закрытие по кнопке; иначе — клик по фону
    if (event && event.target !== document.getElementById('modalFoodSearch')) return;
    document.getElementById('modalFoodSearch').style.display = 'none';
}

// Фильтрует продукты по поисковому запросу
function iskatProducty(zapros) {
    var resultsEl = document.getElementById('foodSearchResults');
    vybrannyProdukt = null;
    document.getElementById('foodPreview').style.display = 'none';
    document.getElementById('btnAddFood').style.display = 'none';

    if (!zapros || zapros.trim().length < 1) {
        resultsEl.innerHTML = '';
        return;
    }

    var zaprosNizhny = zapros.toLowerCase();

    // Ищем совпадения в русском и английском названии, категории
    var naideno = baza_produktov.filter(function(p) {
        return p.name.toLowerCase().indexOf(zaprosNizhny) !== -1 ||
               p.name_en.toLowerCase().indexOf(zaprosNizhny) !== -1 ||
               p.category.toLowerCase().indexOf(zaprosNizhny) !== -1 ||
               p.category_en.toLowerCase().indexOf(zaprosNizhny) !== -1;
    });

    pokazatResultatyPoiska(naideno);
}

// Отображает список найденных продуктов
function pokazatResultatyPoiska(produkty) {
    var t = PEREVODY[sostoyanie.yazyk];
    var resultsEl = document.getElementById('foodSearchResults');
    resultsEl.innerHTML = '';

    if (produkty.length === 0) {
        resultsEl.innerHTML = '<div class="empty-message">' + t.noFoodFound + '</div>';
        return;
    }

    for (var i = 0; i < produkty.length; i++) {
        var produkt = produkty[i];
        var item = document.createElement('div');
        item.className = 'food-result-item';

        // Название на текущем языке
        var imyaProduktа = (sostoyanie.yazyk === 'en' && produkt.name_en) ? produkt.name_en : produkt.name;
        var kategoriya = (sostoyanie.yazyk === 'en' && produkt.category_en) ? produkt.category_en : produkt.category;

        item.innerHTML =
            '<div>' +
            '<div class="food-result-name">' + imyaProduktа + '</div>' +
            '<div class="food-result-cat">' + kategoriya + '</div>' +
            '</div>' +
            '<div class="food-result-kcal">' + produkt.per100g.kcal + ' ' + t.kcalUnit + '/100г</div>';

        // Передаём id продукта через замыкание
        (function(prod) {
            item.onclick = function() {
                vybratProdukt(prod);
            };
        })(produkt);

        resultsEl.appendChild(item);
    }
}

// Выбирает продукт для добавления, показывает предпросмотр
function vybratProdukt(produkt) {
    vybrannyProdukt = produkt;

    // Выделяем выбранный пункт в списке
    var items = document.querySelectorAll('.food-result-item');
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('selected');
    }
    // Находим и выделяем нужный (по совпадению id)
    var vsePunkty = document.querySelectorAll('.food-result-item');
    for (var j = 0; j < vsePunkty.length; j++) {
        if (vsePunkty[j].querySelector('.food-result-name') &&
            vsePunkty[j].querySelector('.food-result-name').textContent === produkt.name ||
            vsePunkty[j].querySelector('.food-result-name') &&
            vsePunkty[j].querySelector('.food-result-name').textContent === produkt.name_en) {
            vsePunkty[j].classList.add('selected');
        }
    }

    // Название в предпросмотре
    var imya = (sostoyanie.yazyk === 'en' && produkt.name_en) ? produkt.name_en : produkt.name;
    document.getElementById('foodPreviewName').textContent = imya;

    // Показываем блок предпросмотра
    document.getElementById('foodPreview').style.display = 'block';
    document.getElementById('btnAddFood').style.display = 'inline-block';

    // Обновляем расчёты нутриентов
    obnovitPreview();
}

// Обновляет предпросмотр нутриентов при изменении порции
function obnovitPreview() {
    if (!vybrannyProdukt) return;

    var t = PEREVODY[sostoyanie.yazyk];
    var grammy = parseFloat(document.getElementById('foodPortionGrams').value) || 100;
    var n = schislatNutrienty(vybrannyProdukt, grammy);

    document.getElementById('foodNutrientsPreview').innerHTML =
        '<div class="nutrient-preview-item">' +
            '<span class="nutrient-preview-label">' + t.caloriesLabel + '</span>' +
            '<span class="nutrient-preview-value">' + Math.round(n.kcal) + '</span>' +
        '</div>' +
        '<div class="nutrient-preview-item">' +
            '<span class="nutrient-preview-label">' + t.protein + '</span>' +
            '<span class="nutrient-preview-value">' + n.protein.toFixed(1) + ' г</span>' +
        '</div>' +
        '<div class="nutrient-preview-item">' +
            '<span class="nutrient-preview-label">' + t.fat + '</span>' +
            '<span class="nutrient-preview-value">' + n.fat.toFixed(1) + ' г</span>' +
        '</div>' +
        '<div class="nutrient-preview-item">' +
            '<span class="nutrient-preview-label">' + t.carbs + '</span>' +
            '<span class="nutrient-preview-value">' + n.carbs.toFixed(1) + ' г</span>' +
        '</div>';
}

// Подтверждает добавление выбранного продукта в дневник
function podtverdritDobavlenie() {
    if (!vybrannyProdukt) return;

    var grammy = parseFloat(document.getElementById('foodPortionGrams').value) || 100;
    if (grammy <= 0 || isNaN(grammy)) return;

    dobavitProductVDnevnik(tekushchijPriem, vybrannyProdukt, grammy);

    // Закрываем модальное окно
    document.getElementById('modalFoodSearch').style.display = 'none';

    // Обновляем дневник
    otobraziDnevnik();
}

// =====================================================
// РАЗДЕЛ 7: ПРОФИЛЬ И РАСЧЁТЫ
// Формулы из ver2
// =====================================================

// Расчёт ИМТ
// Формула: ИМТ = вес(кг) / рост²(м)
function rasschetatIMT(rostCm, vesKg) {
    var rostM = rostCm / 100;
    return vesKg / (rostM * rostM);
}

// Расчёт базового обмена (BMR) по формуле Миффлина-Сан Жеора
// Мужчины: 10*вес + 6.25*рост - 5*возраст + 5
// Женщины: 10*вес + 6.25*рост - 5*возраст - 161
function rasschetatBMR(pol, vozrast, rostCm, vesKg) {
    var base = 10 * vesKg + 6.25 * rostCm - 5 * vozrast;
    return pol === 'm' ? base + 5 : base - 161;
}

// Определяет индекс категории ИМТ (0-3)
function opredelitKategoriuIMT(imt) {
    if (imt < 18.5) return 0;  // Дефицит
    if (imt < 25.0) return 1;  // Норма
    if (imt < 30.0) return 2;  // Избыток
    return 3;                  // Ожирение
}

// Категории ИМТ
var KATEGORII_IMT = [
    { ru: 'Дефицит',  en: 'Underweight', klass: 'category-deficit' },
    { ru: 'Норма',    en: 'Normal',      klass: 'category-norm'    },
    { ru: 'Избыток',  en: 'Overweight',  klass: 'category-excess'  },
    { ru: 'Ожирение', en: 'Obese',       klass: 'category-obesity' }
];

// Вычисляет позицию стрелки на шкале ИМТ (в процентах)
// Из ver2: учитывает flex-пропорции сегментов
function poziciyaNaShkaleIMT(imt) {
    var IMT_MIN = 10, IMT_MAX = 45;
    var segmenty = [
        { ot: IMT_MIN, do: 18.5, flex: 1.85 },
        { ot: 18.5,    do: 25.0, flex: 1.65 },
        { ot: 25.0,    do: 30.0, flex: 1    },
        { ot: 30.0,    do: IMT_MAX, flex: 2 }
    ];

    var totalFlex = 0;
    for (var i = 0; i < segmenty.length; i++) totalFlex += segmenty[i].flex;

    var imtOgr = Math.max(IMT_MIN, Math.min(IMT_MAX, imt));
    var poziciya = 0;

    for (var j = 0; j < segmenty.length; j++) {
        var seg = segmenty[j];
        if (imtOgr <= seg.do) {
            poziciya += ((imtOgr - seg.ot) / (seg.do - seg.ot)) * (seg.flex / totalFlex) * 100;
            break;
        } else {
            poziciya += (seg.flex / totalFlex) * 100;
        }
    }

    return poziciya;
}

// Заполняет форму профиля значениями из состояния
function zapolnitFormuProfila() {
    var p = sostoyanie.profil;

    var polEl = document.getElementById(p.pol === 'm' ? 'pol-m' : 'pol-f');
    if (polEl) polEl.checked = true;

    var vozrastEl = document.getElementById('profVozrast');
    if (vozrastEl) vozrastEl.value = p.vozrast;

    var rostEl = document.getElementById('profRost');
    if (rostEl) rostEl.value = p.rost;

    var vesEl = document.getElementById('profVes');
    if (vesEl) vesEl.value = p.ves;

    var aktEl = document.getElementById('profAktivnost');
    if (aktEl) {
        for (var i = 0; i < aktEl.options.length; i++) {
            if (parseFloat(aktEl.options[i].value) === p.aktivnost) {
                aktEl.selectedIndex = i;
                break;
            }
        }
    }

    var celEl = document.getElementById('profCel');
    if (celEl) {
        for (var j = 0; j < celEl.options.length; j++) {
            if (celEl.options[j].value === p.cel) {
                celEl.selectedIndex = j;
                break;
            }
        }
    }

    var belokEl = document.getElementById('profBelok');
    if (belokEl) belokEl.value = p.belokProcent;

    var zhirEl = document.getElementById('profZhir');
    if (zhirEl) zhirEl.value = p.zhirProcent;

    var uglevodyEl = document.getElementById('profUglevody');
    if (uglevodyEl) uglevodyEl.value = p.uglevodyProcent;

    // Показываем результаты если данные есть
    if (p.rost && p.ves && p.vozrast) {
        otobrazitResultatyProfila();
    }
}

// Сохраняет профиль из формы в состояние
function sohranitProfil() {
    var polEl = document.querySelector('input[name="pol"]:checked');
    sostoyanie.profil.pol = polEl ? polEl.value : 'm';

    var v = parseFloat(document.getElementById('profVozrast').value);
    var r = parseFloat(document.getElementById('profRost').value);
    var w = parseFloat(document.getElementById('profVes').value);

    if (isNaN(v) || isNaN(r) || isNaN(w)) {
        alert(sostoyanie.yazyk === 'ru'
            ? 'Пожалуйста, заполните все поля профиля.'
            : 'Please fill in all profile fields.');
        return;
    }

    sostoyanie.profil.vozrast = v;
    sostoyanie.profil.rost = r;
    sostoyanie.profil.ves = w;
    sostoyanie.profil.aktivnost = parseFloat(document.getElementById('profAktivnost').value);
    sostoyanie.profil.cel = document.getElementById('profCel').value;

    var belok = parseInt(document.getElementById('profBelok').value) || 25;
    var zhir  = parseInt(document.getElementById('profZhir').value)  || 30;
    var uglevody = parseInt(document.getElementById('profUglevody').value) || 45;

    // Нормализуем чтобы в сумме было 100%
    var summa = belok + zhir + uglevody;
    if (summa !== 100) {
        belok = Math.round(belok / summa * 100);
        zhir  = Math.round(zhir  / summa * 100);
        uglevody = 100 - belok - zhir;
        document.getElementById('profBelok').value = belok;
        document.getElementById('profZhir').value = zhir;
        document.getElementById('profUglevody').value = uglevody;
    }

    sostoyanie.profil.belokProcent = belok;
    sostoyanie.profil.zhirProcent  = zhir;
    sostoyanie.profil.uglevodyProcent = uglevody;

    otobrazitResultatyProfila();
}

// Отображает рассчитанные результаты в разделе профиля
function otobrazitResultatyProfila() {
    var p = sostoyanie.profil;
    var t = PEREVODY[sostoyanie.yazyk];

    if (!p.rost || !p.ves || !p.vozrast) return;

    var imt = rasschetatIMT(p.rost, p.ves);
    var katIndeks = opredelitKategoriuIMT(imt);
    var kategoriya = KATEGORII_IMT[katIndeks];

    var bmr  = rasschetatBMR(p.pol, p.vozrast, p.rost, p.ves);
    var tdee = bmr * p.aktivnost;
    var celKcal = rasschetatKaloriiCel();

    // Заполняем ИМТ
    var imtEl = document.getElementById('profImtValue');
    if (imtEl) imtEl.textContent = imt.toFixed(2);

    var catEl = document.getElementById('profImtCategory');
    if (catEl) {
        catEl.textContent = kategoriya[sostoyanie.yazyk];
        catEl.className = 'result-category ' + kategoriya.klass;
    }

    // Позиция стрелки на шкале
    var procent = poziciyaNaShkaleIMT(imt);
    var indicatorEl = document.getElementById('profScaleIndicator');
    if (indicatorEl) indicatorEl.style.left = procent + '%';

    var indicatorValEl = document.getElementById('profScaleIndicatorValue');
    if (indicatorValEl) indicatorValEl.textContent = imt.toFixed(1);

    // BMR, TDEE, цель
    var bmrEl = document.getElementById('profBmr');
    if (bmrEl) bmrEl.textContent = Math.round(bmr) + ' ' + t.kcalUnit + '/сут';

    var tdeeEl = document.getElementById('profTdee');
    if (tdeeEl) tdeeEl.textContent = Math.round(tdee) + ' ' + t.kcalUnit + '/сут';

    var celEl = document.getElementById('profKcalCel');
    if (celEl) celEl.textContent = celKcal + ' ' + t.kcalUnit + '/сут';

    // Советы
    var tipsEl = document.getElementById('profTips');
    if (tipsEl) {
        var sovet = '';
        if (p.cel === 'lose') {
            sovet = t.goalLose + ': ' + Math.round(tdee * 0.8) + ' ' + t.kcalUnit + '/сут';
        } else if (p.cel === 'gain') {
            sovet = t.goalGain + ': ' + Math.round(tdee * 1.15) + ' ' + t.kcalUnit + '/сут';
        } else {
            sovet = t.goalMaintain + ': ' + Math.round(tdee) + ' ' + t.kcalUnit + '/сут';
        }
        tipsEl.textContent = sovet;
    }

    // Показываем блок результатов
    var resultsEl = document.getElementById('profileResults');
    if (resultsEl) resultsEl.style.display = 'block';
}

// =====================================================
// РАЗДЕЛ 8: ДАШБОРД
// =====================================================

function otobrazitDashboard() {
    var t = PEREVODY[sostoyanie.yazyk];
    var itogo = schislatItogoDnya(sostoyanie.tekushayaData);
    var celKcal = rasschetatKaloriiCel();
    var celi = rasschetatCeliMakro();
    var p = sostoyanie.profil;

    // Калории
    var kcalEl = document.getElementById('dashKcal');
    if (kcalEl) kcalEl.textContent = Math.round(itogo.kcal) + ' ' + t.kcalUnit;
    var kcalSubEl = document.getElementById('dashKcalSub');
    if (kcalSubEl) {
        var ostatok = celKcal - Math.round(itogo.kcal);
        kcalSubEl.textContent = (ostatok >= 0 ? ostatok : 0) + ' ' + t.kcalUnit + ' осталось';
    }

    // Белки
    var protEl = document.getElementById('dashProtein');
    if (protEl) protEl.textContent = itogo.protein.toFixed(1) + ' г';
    var protSubEl = document.getElementById('dashProteinSub');
    if (protSubEl) protSubEl.textContent = '/ ' + celi.protein + ' г';

    // Жиры
    var fatEl = document.getElementById('dashFat');
    if (fatEl) fatEl.textContent = itogo.fat.toFixed(1) + ' г';
    var fatSubEl = document.getElementById('dashFatSub');
    if (fatSubEl) fatSubEl.textContent = '/ ' + celi.fat + ' г';

    // Углеводы
    var carbsEl = document.getElementById('dashCarbs');
    if (carbsEl) carbsEl.textContent = itogo.carbs.toFixed(1) + ' г';
    var carbsSubEl = document.getElementById('dashCarbsSub');
    if (carbsSubEl) carbsSubEl.textContent = '/ ' + celi.carbs + ' г';

    // ИМТ
    if (p.rost && p.ves) {
        var imt = rasschetatIMT(p.rost, p.ves);
        var katIdx = opredelitKategoriuIMT(imt);
        var bmiEl = document.getElementById('dashBmi');
        if (bmiEl) bmiEl.textContent = imt.toFixed(1);
        var bmiSubEl = document.getElementById('dashBmiSub');
        if (bmiSubEl) bmiSubEl.textContent = KATEGORII_IMT[katIdx][sostoyanie.yazyk];
    }

    // TDEE
    if (p.vozrast && p.rost && p.ves) {
        var bmr = rasschetatBMR(p.pol, p.vozrast, p.rost, p.ves);
        var tdee = Math.round(bmr * p.aktivnost);
        var tdeeEl = document.getElementById('dashTdee');
        if (tdeeEl) tdeeEl.textContent = tdee + ' ' + t.kcalUnit;
        var tdeeSubEl = document.getElementById('dashTdeeSub');
        if (tdeeSubEl) tdeeSubEl.textContent = 'BMR: ' + Math.round(bmr) + ' ' + t.kcalUnit;
    }

    // Недельный график
    otobrazitNedelnyGrafik();

    // Прогресс витаминов и минералов
    otobrazitProgressNutrienty();
}

// Отображает недельный CSS-график калорий
function otobrazitNedelnyGrafik() {
    var t = PEREVODY[sostoyanie.yazyk];
    var container = document.getElementById('weekChart');
    if (!container) return;

    container.innerHTML = '';

    // Собираем данные за последние 7 дней
    var dniNedeli = [];
    var chasti = sostoyanie.tekushayaData.split('-');
    var segodnya = new Date(parseInt(chasti[0]), parseInt(chasti[1]) - 1, parseInt(chasti[2]));

    for (var i = 6; i >= 0; i--) {
        var data = new Date(segodnya);
        data.setDate(data.getDate() - i);
        var dataStr = poluchitDatuKak_YYYY_MM_DD(data);
        var kcal = schislatItogoDnya(dataStr).kcal;
        dniNedeli.push({
            data: dataStr,
            kcal: kcal,
            segodnya: (dataStr === sostoyanie.tekushayaData)
        });
    }

    // Максимальное значение для масштабирования
    var maxKcal = Math.max.apply(null, dniNedeli.map(function(d) { return d.kcal; }));
    if (maxKcal < 100) maxKcal = rasschetatKaloriiCel(); // используем цель если нет данных

    var nazvaniaDnej = {
        ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    };

    for (var j = 0; j < dniNedeli.length; j++) {
        var den = dniNedeli[j];
        var vysota = maxKcal > 0 ? Math.round((den.kcal / maxKcal) * 100) : 0;

        var wrap = document.createElement('div');
        wrap.className = 'week-bar-wrap';

        var kcalLabel = document.createElement('div');
        kcalLabel.className = 'week-bar-kcal';
        kcalLabel.textContent = den.kcal > 0 ? Math.round(den.kcal) : '';

        var bar = document.createElement('div');
        bar.className = 'week-bar' + (den.segodnya ? ' today' : '');
        bar.style.height = Math.max(vysota, den.kcal > 0 ? 8 : 2) + 'px';

        var denLabel = document.createElement('div');
        var dataCh = den.data.split('-');
        var dataObj = new Date(parseInt(dataCh[0]), parseInt(dataCh[1]) - 1, parseInt(dataCh[2]));
        denLabel.className = 'week-bar-label';
        denLabel.textContent = nazvaniaDnej[sostoyanie.yazyk][dataObj.getDay()];

        wrap.appendChild(kcalLabel);
        wrap.appendChild(bar);
        wrap.appendChild(denLabel);
        container.appendChild(wrap);
    }
}

// Отображает прогресс витаминов и минералов за день
function otobrazitProgressNutrienty() {
    var container = document.getElementById('nutrientsProgressContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!vitaminyDannyje || !mineralyDannyje) {
        container.innerHTML = '<div class="empty-message">Загрузка данных...</div>';
        return;
    }

    var p = sostoyanie.profil;
    if (!p.vozrast || !p.rost) {
        container.innerHTML = '<div class="empty-message">' +
            (sostoyanie.yazyk === 'ru' ? 'Заполните профиль для просмотра' : 'Fill profile to see progress') +
            '</div>';
        return;
    }

    // Получаем нормы из ver2-функций
    var gruppa = opredelitGruppuVozrasta(p.vozrast);

    // Собираем прогресс по витаминам
    var mikroSumma = schislatMikroNutrienty(sostoyanie.tekushayaData);

    // Маппинг между id витамина в vitamins.json и ключом в mikroSumma
    var mapVitaminy = {
        'vit_d':    { klyuch: 'vit_d',   edV: 'мкг' },
        'vit_c':    { klyuch: 'vit_c',   edV: 'мг'  },
        'vit_a':    { klyuch: 'vit_a',   edV: 'мкг' },
        'vit_b12':  { klyuch: 'vit_b12', edV: 'мкг' }
    };
    var mapMineraly = {
        'iron':     { klyuch: 'iron',      edV: 'мг'  },
        'calcium':  { klyuch: 'calcium',   edV: 'мг'  },
        'magnesium':{ klyuch: 'magnesium', edV: 'мг'  },
        'potassium':{ klyuch: 'potassium', edV: 'мг'  },
        'zinc':     { klyuch: 'zinc',      edV: 'мг'  }
    };

    // Отображаем только те витамины, для которых есть данные из продуктов
    for (var i = 0; i < vitaminyDannyje.vitamins.length; i++) {
        var vit = vitaminyDannyje.vitamins[i];
        var mapping = mapVitaminy[vit.id];
        if (!mapping) continue;

        var znachenie = najtiZnachenieVGruppah(vit, gruppa, p.pol);
        if (!znachenie) continue;

        var norma = znachenie.rda !== null ? znachenie.rda : znachenie.ai;
        if (!norma) continue;

        var potrebleno = mikroSumma[mapping.klyuch] || 0;
        container.appendChild(sozdatStrokuProgressa(vit.name, potrebleno, norma, vit.unit));
    }

    for (var j = 0; j < mineralyDannyje.minerals.length; j++) {
        var min = mineralyDannyje.minerals[j];
        var map = mapMineraly[min.id];
        if (!map) continue;

        var znMin = najtiZnachenieVGruppah(min, gruppa, p.pol);
        if (!znMin) continue;

        var normaMin = znMin.rda !== null ? znMin.rda : znMin.ai;
        if (!normaMin) continue;

        var potreblenoMin = mikroSumma[map.klyuch] || 0;
        container.appendChild(sozdatStrokuProgressa(min.name, potreblenoMin, normaMin, min.unit));
    }
}

// Создаёт строку прогресса для одного нутриента
function sozdatStrokuProgressa(nazvanie, potrebleno, norma, edinica) {
    var procent = norma > 0 ? Math.round(potrebleno / norma * 100) : 0;
    var row = document.createElement('div');
    row.className = 'nutrient-row';

    var barKlass = procent > 100 ? 'nutrient-row-bar over' : 'nutrient-row-bar';

    row.innerHTML =
        '<div class="nutrient-row-name" title="' + nazvanie + '">' + nazvanie + '</div>' +
        '<div class="nutrient-row-bar-wrap">' +
            '<div class="' + barKlass + '" style="width:' + Math.min(procent, 100) + '%"></div>' +
        '</div>' +
        '<div class="nutrient-row-pct">' + procent + '%</div>';

    return row;
}

// Вспомогательные функции из ver2 для определения группы и значений
function opredelitGruppuVozrasta(vozrast) {
    if (vozrast < 1)  return '0-6 months';
    if (vozrast < 4)  return '1-3 years';
    if (vozrast < 9)  return '4-8 years';
    if (vozrast < 14) return '9-13 years';
    if (vozrast < 19) return '14-18 years';
    if (vozrast < 31) return '19-30 years';
    if (vozrast < 51) return '31-50 years';
    if (vozrast < 71) return '51-70 years';
    return '70+ years';
}

function najtiZnachenieVGruppah(element, gruppa, pol) {
    var gruppaKey = gruppa;
    // Для женщин в определённых возрастах используем отдельные записи
    if (pol === 'f') {
        var zhenskieGruppy = ['14-18 years', '19-30 years', '31-50 years', '51-70 years', '70+ years'];
        if (zhenskieGruppy.indexOf(gruppa) !== -1) {
            gruppaKey = gruppa + ' f';
        }
    }

    var massiv = element.groups;
    for (var i = 0; i < massiv.length; i++) {
        if (massiv[i].life_stage === gruppaKey) {
            return massiv[i];
        }
    }
    // Пробуем без суффикса 'f'
    for (var j = 0; j < massiv.length; j++) {
        if (massiv[j].life_stage === gruppa) {
            return massiv[j];
        }
    }
    return null;
}

// =====================================================
// РАЗДЕЛ 9: УПРАЖНЕНИЯ
// =====================================================

function otobrazitUprazhneniya() {
    var t = PEREVODY[sostoyanie.yazyk];

    // Заголовок раздела с датой
    var titleEl = document.getElementById('exerciseDateTitle');
    if (titleEl) {
        titleEl.textContent = formatirovatDatuDlyaEkrana(sostoyanie.tekushayaData);
    }

    var listEl = document.getElementById('exerciseList');
    if (!listEl) return;

    var uprazhneniya = sostoyanie.uprazhneniya[sostoyanie.tekushayaData] || [];

    if (uprazhneniya.length === 0) {
        listEl.innerHTML = '<div class="empty-message">' + t.noExercise + '</div>';
        return;
    }

    // Считаем итого ккал
    var totalKcal = 0;
    var html = '<div class="exercise-list">';

    for (var i = 0; i < uprazhneniya.length; i++) {
        var ex = uprazhneniya[i];
        totalKcal += ex.kaloriiSozhzheno || 0;

        html += '<div class="exercise-item">' +
            '<div class="exercise-info">' +
                '<div class="exercise-name">' + ex.nazvanie + '</div>' +
                '<div class="exercise-meta">' + ex.minuty + ' ' + t.minUnit + '</div>' +
            '</div>' +
            '<div class="exercise-kcal">' + ex.kaloriiSozhzheno + ' ' + t.kcalUnit + '</div>' +
            '<button class="btn-delete-food" onclick="udalitUprazhnenie(' + i + ')">✕</button>' +
        '</div>';
    }

    html += '</div>';
    html += '<div class="exercise-total">' + t.exerciseTotalLabel + ' <strong>' + totalKcal + ' ' + t.kcalUnit + '</strong></div>';

    listEl.innerHTML = html;
}

// Добавляет новое упражнение
function dobavitUprazhnenie() {
    var t = PEREVODY[sostoyanie.yazyk];

    var nazvanie = document.getElementById('exNazvanie').value.trim();
    var minuty = parseInt(document.getElementById('exMinuty').value) || 0;
    var kalorii = parseInt(document.getElementById('exKalorii').value) || 0;

    if (!nazvanie) {
        alert(t.exerciseNameLabel + ': ' + (sostoyanie.yazyk === 'ru' ? 'введите название' : 'enter name'));
        return;
    }

    if (!sostoyanie.uprazhneniya[sostoyanie.tekushayaData]) {
        sostoyanie.uprazhneniya[sostoyanie.tekushayaData] = [];
    }

    sostoyanie.uprazhneniya[sostoyanie.tekushayaData].push({
        nazvanie: nazvanie,
        minuty: minuty,
        kaloriiSozhzheno: kalorii
    });

    // Очищаем форму
    document.getElementById('exNazvanie').value = '';
    document.getElementById('exMinuty').value = '';
    document.getElementById('exKalorii').value = '';

    otobrazitUprazhneniya();
}

// Удаляет упражнение по индексу
function udalitUprazhnenie(indeks) {
    var uprazhneniya = sostoyanie.uprazhneniya[sostoyanie.tekushayaData];
    if (uprazhneniya) {
        uprazhneniya.splice(indeks, 1);
    }
    otobrazitUprazhneniya();
}

// =====================================================
// РАЗДЕЛ 10: УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ И ДАННЫМИ
// =====================================================

// Переключает меню «Пользователь» в шапке
function pereklyuchitMenuPolzovatelya() {
    var menu = document.getElementById('userMenu');
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
}

// Закрывает все меню в шапке
function zakrytVseMenuShapki() {
    var userMenu = document.getElementById('userMenu');
    if (userMenu) userMenu.style.display = 'none';
}

// Закрытие меню при клике вне его
document.addEventListener('click', function(event) {
    var dropdown = document.getElementById('userDropdown');
    if (dropdown && !dropdown.contains(event.target)) {
        var menu = document.getElementById('userMenu');
        if (menu) menu.style.display = 'none';
    }
});

// Показывает модальное окно со списком пользователей
function pokazatSpisokPolzovateley() {
    zakrytVseMenuShapki();

    var container = document.getElementById('userListButtons');
    if (!container) return;

    container.innerHTML = '';

    // SPISOK_POLZOVATELEY определён в user.js
    for (var i = 0; i < SPISOK_POLZOVATELEY.length; i++) {
        var polzovatel = SPISOK_POLZOVATELEY[i];
        var btn = document.createElement('button');
        btn.className = 'user-list-btn';
        btn.textContent = polzovatel.nazvanie;

        // Передаём путь к файлу через замыкание
        (function(fajl) {
            btn.onclick = function() {
                zagruzitDannyePolzovatelya(fajl);
            };
        })(polzovatel.fajl);

        container.appendChild(btn);
    }

    document.getElementById('modalUserList').style.display = 'flex';
}

// Закрывает модальное окно списка пользователей
function zakrytSpisokPolzovateley(event) {
    if (event && event.target !== document.getElementById('modalUserList')) return;
    document.getElementById('modalUserList').style.display = 'none';
}

// Загружает данные пользователя из файла
function zagruzitDannyePolzovatelya(fajl) {
    document.getElementById('modalUserList').style.display = 'none';

    fetch(fajl)
        .then(function(r) {
            if (!r.ok) throw new Error('Файл не найден: ' + fajl);
            return r.json();
        })
        .then(function(dannye) {
            primenytDannyePolzovatelya(dannye);
        })
        .catch(function(err) {
            alert((sostoyanie.yazyk === 'ru' ? 'Ошибка загрузки: ' : 'Load error: ') + err.message);
        });
}

// Загружает тестовые данные (первый пользователь из списка)
function zagruzitTestovyeDannye() {
    zakrytVseMenuShapki();
    if (SPISOK_POLZOVATELEY.length > 0) {
        zagruzitDannyePolzovatelya(SPISOK_POLZOVATELEY[0].fajl);
    }
}

// Применяет загруженные данные к состоянию приложения
function primenytDannyePolzovatelya(dannye) {
    if (dannye.profil) {
        sostoyanie.profil = Object.assign({}, sostoyanie.profil, dannye.profil);
    }
    if (dannye.dnevnik) {
        sostoyanie.dnevnik = dannye.dnevnik;
    }
    if (dannye.uprazhneniya) {
        sostoyanie.uprazhneniya = dannye.uprazhneniya;
    }

    // Обновляем текущий раздел
    var activnayaSekcia = document.querySelector('.app-section[style="display: block;"]');
    if (activnayaSekcia) {
        var id = activnayaSekcia.id.replace('section-', '');
        pokazatRazdel(id);
    } else {
        otobraziDnevnik();
    }
}

// Собирает текущие данные пользователя в объект для сохранения
function sobratDannyePolzovatelya() {
    return {
        version: '1.0',
        profil: sostoyanie.profil,
        dnevnik: sostoyanie.dnevnik,
        uprazhneniya: sostoyanie.uprazhneniya
    };
}

// Сохраняет (скачивает) данные пользователя через браузер
function sohranitDannyePolzovatelya() {
    zakrytVseMenuShapki();

    var dannye = sobratDannyePolzovatelya();
    var json = JSON.stringify(dannye, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);

    // Создаём временную ссылку и нажимаем её программно
    var a = document.createElement('a');
    a.href = url;
    a.download = 'user_data_' + sostoyanie.tekushayaData + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// =====================================================
// РАЗДЕЛ 11: ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА
// =====================================================

// Переключает язык интерфейса между RU и EN
function pereklyuchitYazyk() {
    sostoyanie.yazyk = (sostoyanie.yazyk === 'ru') ? 'en' : 'ru';
    primenytYazyk(sostoyanie.yazyk);

    // Обновляем кнопку переключения
    var btn = document.getElementById('btnYazyk');
    if (btn) {
        btn.textContent = (sostoyanie.yazyk === 'ru') ? 'EN' : 'RU';
    }

    // Обновляем отображение текущего раздела
    var activnayaSekcia = document.querySelector('.nav-tab.active');
    if (activnayaSekcia) {
        var id = activnayaSekcia.id.replace('tab-', '');
        pokazatRazdel(id);
    }
}

// Применяет переводы ко всем элементам с атрибутом data-i18n
function primenytYazyk(kod) {
    var t = PEREVODY[kod];
    if (!t) return;

    // Заменяем текстовое содержимое элементов по ключу
    var elementy = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elementy.length; i++) {
        var klyuch = elementy[i].getAttribute('data-i18n');
        if (t[klyuch] !== undefined) {
            elementy[i].textContent = t[klyuch];
        }
    }

    // Заменяем placeholder для input элементов
    var placholdery = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < placholdery.length; j++) {
        var klyuchPl = placholdery[j].getAttribute('data-i18n-placeholder');
        if (t[klyuchPl] !== undefined) {
            placholdery[j].placeholder = t[klyuchPl];
        }
    }

    // Заменяем тексты опций в select
    var opcii = document.querySelectorAll('[data-i18n-opt]');
    for (var k = 0; k < opcii.length; k++) {
        var klyuchOpt = opcii[k].getAttribute('data-i18n-opt');
        if (t[klyuchOpt] !== undefined) {
            opcii[k].textContent = t[klyuchOpt];
        }
    }

    // Обновляем атрибут lang у <html>
    document.documentElement.lang = kod;
}

// =====================================================
// РАЗДЕЛ 12: СПРАВКА
// Загружает Markdown-файлы и отображает в модальном окне
// =====================================================

// Конфигурация файлов справки
var FAJLY_SPRAVKI = {
    'help':      { ru: 'Общая справка',      en: 'General help',        fajl: 'help/help.md'      },
    'diary':     { ru: 'Дневник питания',     en: 'Food diary',          fajl: 'help/diary.md'     },
    'profile':   { ru: 'Профиль и цели',      en: 'Profile & goals',     fajl: 'help/profile.md'   },
    'nutrients': { ru: 'Витамины и минералы', en: 'Vitamins & minerals', fajl: 'help/nutrients.md' }
};

// Открывает модальное окно справки
function otkrytSpravku(klyuch) {
    var config = FAJLY_SPRAVKI[klyuch];
    if (!config) return;

    var zagolovok = config[sostoyanie.yazyk] || config.ru;
    document.getElementById('helpModalTitle').textContent = zagolovok;
    document.getElementById('helpModalBody').innerHTML = '<p>Загрузка...</p>';
    document.getElementById('modalHelp').style.display = 'flex';

    // Загружаем markdown-файл
    fetch(config.fajl)
        .then(function(r) {
            if (!r.ok) throw new Error('Failed to fetch');
            return r.text();
        })
        .then(function(md) {
            document.getElementById('helpModalBody').innerHTML = marked.parse(md);
        })
        .catch(function(err) {
            document.getElementById('helpModalBody').innerHTML =
                '<p style="color:red;">Ошибка загрузки справки: ' + err.message + '</p>';
        });
}

// Закрывает модальное окно справки
function zakrytSpravku(event) {
    if (event && event.target !== document.getElementById('modalHelp')) return;
    document.getElementById('modalHelp').style.display = 'none';
}

// =====================================================
// РАЗДЕЛ 13: ИНИЦИАЛИЗАЦИЯ
// Запуск приложения при загрузке страницы
// =====================================================

function init() {
    // Устанавливаем текущую дату
    sostoyanie.tekushayaData = poluchitDatuKak_YYYY_MM_DD(new Date());

    // Загружаем справочные данные
    zagruzitDannye();

    // Применяем язык по умолчанию
    primenytYazyk('ru');

    // Показываем раздел «Дневник» по умолчанию
    pokazatRazdel('diary');
}

// Закрытие модальных окон клавишей Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        zakrytPoiskProductov(null);
        zakrytSpisokPolzovateley(null);
        zakrytSpravku(null);
        document.getElementById('modalFoodSearch').style.display = 'none';
        document.getElementById('modalUserList').style.display = 'none';
        document.getElementById('modalHelp').style.display = 'none';
        zakrytVseMenuShapki();
    }
});

// Запускаем приложение когда DOM готов
document.addEventListener('DOMContentLoaded', init);
