const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`

const showProgram = document.querySelector('#show-program')
const program = document.querySelector('#program')
const form = document.querySelector('#service-form')
const guide = document.querySelector('#guide')
const audio = document.querySelector('#audio')
const catalog = document.querySelector('#catalog')
const choiceErr = document.querySelector('#choice-error')
const dataErr = document.querySelector('#data-error')
const result = document.querySelector('#result')
const reportJson = document.querySelector('#report-json')

let data;
try {
  data = JSON.parse(sourceJson)
  form.hidden = false
} catch (error) {
  dataErr.hidden = false
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = services.filter((service) =>
    (service.id === 'guide' && guideChecked) ||
    (service.id === 'audio' && audioChecked) ||
    (service.id === 'catalog' && catalogChecked)
  )

  const items = selected.map((service) => {
    const { title, price } = service
    return { title: title.trim(), price }
  })

  const total = items.reduce((sum, item) => sum + item.price, 0)

  return { count: items.length, total, items }
}

function clickHandle() {
  if (!data) return
  program.innerHTML = data.event.meeting
  program.hidden = false
}

function submitHandle(event) {
  event.preventDefault()
  if (!data) return

  const report = buildReport(
    data.services,
    guide.checked,
    audio.checked,
    catalog.checked
  );

  if (report.count === 0) {
    choiceErr.hidden = false
    result.hidden = true
    reportJson.hidden = true
    return
  }
  choiceErr.hidden = true

  let html = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.`
  for (const item of report.items) {
    html += `<br>${item.title}`
  }
  result.innerHTML = html
  result.hidden = false

  const jsonStr = JSON.stringify(report)
  JSON.parse(jsonStr)
  reportJson.textContent = jsonStr
  reportJson.hidden = false
}

showProgram.addEventListener('click', clickHandle)
form.addEventListener('submit', submitHandle)
