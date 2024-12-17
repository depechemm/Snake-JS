let snakeImg = new Image(); // создаем объект изображения для змейки
let bckImg = new Image(); // создаем объект изображения для фона
let foodImages = []; // массив для хранения изображений еды

let ctx; // контекст канваса для рисования
let gridSize = 30; // размер сетки для игры
let snake; // массив, представляющий змейку
let food = []; // массив для хранения координат еды
let direction; // текущее направление движения змейки
let changex = [-1, 0, 1, 0]; // массив изменений по оси X для направлений (влево, вверх, вправо, вниз)
let changey = [0, -1, 0, 1]; // массив изменений по оси Y для направлений
let paused; // флаг паузы игры
let speed = 100; // скорость игры (интервал обновления в миллисекундах)
let clock; // таймер для обновления игры
let score = 0; // текущий счет игрока
let randomIndex = 0; // индекс для генерации случайной еды

snakeImg.src = 'static/snake.png'; // задаем источник изображения змейки
bckImg.src = 'static/back.png'; // задаем источник изображения фона

// создаем изображения еды и добавляем их в массив
let foodImg1 = new Image();
foodImg1.src = 'static/food1.png';
foodImages.push(foodImg1);

let foodImg2 = new Image();
foodImg2.src = 'static/food2.png';
foodImages.push(foodImg2);

let foodImg3 = new Image();
foodImg3.src = 'static/food3.png';
foodImages.push(foodImg3);


window.onload = function () { // функция, выполняющаяся при загрузке страницы
  canvas = document.getElementById("canvas1"); // получаем элемент канваса
  ctx = canvas.getContext("2d"); // получаем контекст для рисования на канвасе
  canvas.width = 600; // устанавливаем ширину канваса
  canvas.height = 600; // устанавливаем высоту канваса

  snake = [[0, 0]]; // инициализируем змейку с начальной координатой
  direction = 2; // устанавливаем начальное направление (вправо)
  paused = true; // игра изначально приостановлена

  document.onkeydown = function (event) { // обработчик нажатия клавиш
    changeDirection(event); // изменяем направление в зависимости от нажатой клавиши
  };

  addFood(); // добавляем еду на игровое поле
  drawBackground(); // рисуем фон игры
}

function changeDirection(event) { // функция для изменения направления движения змейки
  if (!paused) { // если игра не приостановлена
    code = event.keyCode; // получаем код нажатой клавиши
    switch (code) { // проверяем код нажатой клавиши
      case 37: if (direction !== 2) { direction = 0; } break; // влево
      case 38: if (direction !== 3) { direction = 1; } break; // вверх
      case 39: if (direction !== 0) { direction = 2; } break; // вправо
      case 40: if (direction !== 1) { direction = 3; } break; // вниз
    }
  } else {
    console.log('Игра приостановлена!'); // выводим сообщение, если игра приостановлена
  }
}

function play() { // функция для начала или приостановки игры
  if (paused) {
    clock = setInterval(movement, speed); // запускаем таймер для обновления игры
  } else {
    clearInterval(clock); // останавливаем таймер, если игра приостановлена
  }
  paused = !paused; // переключаем состояние паузы
  ctx.fillStyle = 'white';
  ctx.font = '60px "Pixelify Sans"';
  if (paused) {
    ctx.fillText('Pause', 210, 270);
  }
}

function movement() { // функция для обновления положения змейки
  snake.push([setX(snake[snake.length - 1][0] + changex[direction]),
  setY(snake[snake.length - 1][1] + changey[direction])]); // добавляем новую координату головы змейки

  if (!dotBelongSnake(food[0], food[1])) { // если еда не принадлежит змейке
    delPart(snake[0][0], snake[0][1]); // удаляем последнюю часть хвоста змейки
    snake.shift(); // убираем первую часть хвоста из массива
  } else {
    updateScore(); // обновляем счет игрока
    addFood(); // добавляем новую еду, если змейка съела текущую
  }

  if (crash()) { // проверяем на столкновение со своим телом
    play(); // останавливаем игру
    alert("Game Over"); // выводим сообщение о конце игры
    clear(); // очищаем игровое поле и сбрасываем состояние игры
    play(); // перезапускаем игру
  }

  updateGame(); // обновляем отображение игры на канвасе
}

function setX(x) { // функция для установки координаты X с учетом границ канваса
  return x >= 0 ? x % (ctx.canvas.width / gridSize) : x + (ctx.canvas.width / gridSize);
}

function setY(y) { // функция для установки координаты Y с учетом границ канваса
  return y >= 0 ? y % (ctx.canvas.height / gridSize) : y + (ctx.canvas.height / gridSize);
}

function dotBelongSnake(x, y) { // проверка, принадлежит ли точка змейке
  let res = false;
  for (let i = 0; i < snake.length && !res; ++i) {
    res = Math.abs(x - snake[i][0]) < 1 && Math.abs(y - snake[i][1]) < 1; // проверяем, совпадают ли координаты с частью змейки
  }
  return res; // возвращаем результат проверки
}

function addFood() { // функция для добавления еды на игровое поле
  do {
    food[0] = Math.floor(Math.random() * (ctx.canvas.width / gridSize)); // генерируем случайную координату X для еды
    food[1] = Math.floor(Math.random() * (ctx.canvas.height / gridSize)); // генерируем случайную координату Y для еды
  } while (dotBelongSnake(food[0], food[1])); // повторяем, пока еда не попадает на тело змейки
  randomIndex = Math.floor(Math.random() * foodImages.length);
  drawFood(randomIndex); // рисуем еду на канвасе
}

function crash() { // функция проверки столкновения с телом змейки
  let res = false;
  for (let i = 0; i < snake.length - 1 && !res; ++i) {
    res = snake[i][0] === snake[snake.length - 1][0] && snake[i][1] === snake[snake.length - 1][1];
    // проверяем, совпадают ли координаты головы с любой частью тела змейки
  }
  return res; // возвращаем результат проверки столкновения
}

function drawSnake() { // функция для рисования змейки на канвасе
  for (let part of snake) {
    ctx.drawImage(snakeImg, part[0] * gridSize, part[1] * gridSize, gridSize, gridSize);
    // рисуем каждую часть змейки на канвасе в соответствующей позиции
  }
}

function drawFood() { // функция для рисования еды на канвасе
  ctx.drawImage(foodImages[randomIndex], food[0] * gridSize, food[1] * gridSize, gridSize, gridSize);
  // выбираем случайное изображение еды и рисуем его в заданной позиции
}

function drawBackground() { // функция для рисования фона игры на канвасе
  ctx.drawImage(bckImg, 0, 0, canvas.width, canvas.height);
}

function delPart(x, y) { // функция для удаления части тела змейки с канваса
  ctx.clearRect(x * gridSize, y * gridSize, gridSize, gridSize);
  ctx.drawImage(bckImg, x * gridSize, y * gridSize, gridSize, gridSize);
}

function clear() { // функция для очистки игрового поля и сброса состояния игры
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake = [[0, 0]]; // сбрасываем змейку в начальное состояние
  direction = 2;
  score = 0;
  document.getElementById("score").innerText = score;
  addFood(); // добавляем новую еду после сброса состояния игры
}

function updateGame() { // функция для обновления отображения игры на канвасе
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawFood();
  drawSnake();
}

function updateScore() { // функция для обновления счета игрока и отображения его на экране
  score++;
  document.getElementById("score").innerText = score;
}

