const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  // Логируем информацию о запросе
  const timestamp = new Date().toISOString();
  const { method, url: reqUrl } = req;
  console.log(`[${timestamp}] ${method} ${reqUrl}`);

  // Парсим URL для получения пути и параметров
  const parsedUrl = url.parse(reqUrl, true);
  const path = parsedUrl.pathname;

  // Обрабатываем разные пути
  if (path === '/user/register' && method === 'POST') {
    // Обработка регистрации пользователя
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      console.log('Данные регистрации:', body);
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: true, message: 'User registered' }));
    });

  } else if (path === '/user/login' && method === 'POST') {
    // Обработка входа пользователя
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      console.log('Данные входа:', body);
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: true, message: 'User logged in' }));
    });

  } else if (path === '/user/info' && method === 'GET') {
    // Пример GET запроса
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ username: 'testuser', email: 'test@example.com' }));

  } else {
    // Обработка неизвестных путей
    res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ success: false, message: 'Not Found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Попробуйте сделать запрос на http://localhost:${PORT}/user/register`);
});