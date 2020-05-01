const totalBalance = document.querySelector('.total__balance'); // Баланс
const totalMoneyIncome = document.querySelector('.total__money-income'); // Доходы
const totalMoneyExpenses = document.querySelector('.total__money-expenses'); // Расходы
const historyList = document.querySelector('.history__list'); // История расходов
const form = document.getElementById('form'); // Форма
const operationName = document.querySelector('.operation__name'); // Поле для наименования операции 
const operationAmount = document.querySelector('.operation__amount'); // Поле для ввода суммы 
const operationAdd = document.querySelector('.operation__add'); // Кнопка добавления операции


// Генератор Id
const generateId = () => {
    // получаем и округляем число умножаем 1 и 8 нолей(100000000) переобразуем в 16-ричную систему
    return `iD${Math.round(Math.random() * 1e8).toString(16)}`
}


// Объект с даными
// Записываем то что пулучили из localStorage calc или пустой массив если в localStorage было пусто
let dbOperation = JSON.parse(localStorage.getItem('calc')) || [];


// Функция для создания элементов с обьека, в параметр передаем обьект
const renderOperation = (operation) => {

    // Присваиваем класс взвисимости от того сумма больше 0 или меньше
    const className = operation.amount < 0 ? 'history__item-minus' : 'history__item-plus';

    // создаем элемент li
    const listItem = document.createElement('li');
    // Добавляем общий класс
    listItem.classList.add('history__item');
    // Добавляем класс который попал в className
    listItem.classList.add(className);

    // Добавляем структуру в элемент li 
    listItem.innerHTML = `
        ${operation.description}
        <span class="history__money">${operation.amount} ₽</span>
        <button class="history_delete" data-id="${operation.id}">x</button>
    `;
    //Выводим на страницу перед закрывающимся тегом ul
    historyList.append(listItem);

}

// Обновление баланса
const updateBalance = () => {

    // через фильтр получаем в переменную обьекты которые больше 0
    // filter принимает 3 аргумента. Элемент, индекс и сам массив
    const resultIncome = dbOperation.filter((item, index, array) => {
        return item.amount > 0;
        // reduce принимает 4 аргумента. Предедущее значение, текущее значение, индекс, массив
    }).reduce((prevValue, currentValue) => prevValue + currentValue.amount, 0);

    // через фильтр получаем в переменную обьекты которые меньше 0
    const resultExpenses = dbOperation.filter((item, index, array) => {
        return item.amount < 0;
        // reduce принимает 4 аргумента. Предедущее значение, текущее значение, индекс, массив
    }).reduce((prevValue, currentValue) => prevValue + currentValue.amount, 0);

    // Выводин итог на страницу
    totalMoneyIncome.textContent = `${resultIncome} ₽`;
    totalMoneyExpenses.textContent = `${resultExpenses} ₽`;
    totalBalance.textContent = `${resultIncome + resultExpenses} ₽`;
};


// Функция инициализации 
const init = () => {
    // Ощищаем список ul
    historyList.textContent = '';

    // Проходимся по массиву и запускаем функцию renderOperation
    dbOperation.forEach(renderOperation);
    // dbOperation.forEach((item, index, array) => {
    //     renderOperation(item);
    // });
    updateBalance();
    // записываем в локалсторадж и сохраняем пару/ключ
    localStorage.setItem('calc', JSON.stringify(dbOperation));
};


// Удаление операций
const deleteOperation = (event) => {
    const target = event.target;
    if (target.classList.contains('history_delete')) {
        // Возращаем в массив все элементы кроме того на который был клик
        dbOperation = dbOperation
            .filter(operation => operation.id !== target.dataset.id);
        // обновляем список
        init();
    }


};

// Добавление операция
const addOperation = (event) => {
    event.preventDefault();

    // Получаем из инпута value
    const operationNameValue = operationName.value,
        operationAmountValue = operationAmount.value;

    //Сбрасываем цвет бордера 
    operationName.style.borderColor = null;
    operationAmount.style.borderColor = null;
    // Проверяем если оба инпута заполнены
    if (operationNameValue && operationAmountValue) {
        // Создаем обьект
        const operation = {
            // в ИД генерируем ид
            id: generateId(),
            // в description записываем данные введеные с operationNameValue
            description: operationNameValue,
            // в amount записываем данные введеные с operationAmountValue и переобразуем в числовой тип данных
            amount: Number(operationAmountValue), //конвертируем в число можно просто + или parseInt()
        };

        // Добавляем наш обьект в массив
        dbOperation.push(operation);
        // запускаем функцию инициализации для обновления списка и баланса
        init();
        // в случае если какой-то инпут пуст, изменяем цвет border
    } else {
        if (!operationNameValue) operationName.style.borderColor = 'red';
        if (!operationAmountValue) operationAmount.style.borderColor = 'red';
    }

    // Очищаем инпуты
    operationName.value = '';
    operationAmount.value = '';
};


form.addEventListener('submit', addOperation);

historyList.addEventListener('click', deleteOperation);

init();