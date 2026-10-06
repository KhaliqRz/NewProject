const defaultProducts = [
  {name: "Ноутбук Pro 15", price: 120000, category: "Электроника", inStock: true },
  {name: "Смартфон Alpha", price: 65000, category: "Электроника", inStock: true },
  {name: "Кофемашина Espresso", price: 35000, category: "Бытовая техника", inStock: false },
  {name: "Робот-пылесос CleanBot", price: 22000, category: "Бытовая техника", inStock: true },
  {name: "Эргономичное кресло", price: 18000, category: "Мебель", inStock: true },
  {name: "Письменный стол Eco", price: 12500, category: "Мебель", inStock: false }
];



//Сохранение списка в localStorage
function loadProducts() {
  try {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : defaultProducts;
  } catch {
    return defaultProducts; // если в хранилище мусор, берём значения по умолчанию
  }
}
let products = loadProducts();
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}


//Наличие ошибки xml и json
function isXml(file){
  const xmlFile = new DOMParser().parseFromString(file, "application/xml");
  return !xmlFile.querySelector("parsererror");
}
function isJson(file){
  try{
    JSON.parse(file);
    return true;
  }
  catch{
    return false
  }
}


//Преоброзование JSON в XML
function fileToXml(xmlFile){
  const p = xmlFile.documentElement;
  const get = (tag) => p.querySelector(tag)?.textContent
  return{
    name: get("name"),
    price: Number(get("price")),
    category: get("category"),
    inStock: get("inStock") === "true"
  }
}



//Считывание теста через кнопку
const importBut = document.getElementById("import");
let dataText = document.getElementById("data-input");
let text;
importBut.addEventListener("click", () => {
  text = dataText.value;
  //Распознование формата текста
    let obj;
    if(isJson(text)){
      obj = JSON.parse(text);
      products.push(obj)
      dataText.value = "";
      dataText.setAttribute("placeholder", "Поле импортировано");
    }
    else if(isXml(text)){
      obj = fileToXml(new DOMParser().parseFromString(text, "application/xml"))
      products.push(obj);
      dataText.value = "";
      dataText.setAttribute("placeholder", "Поле импортировано")
    }
    else{
      dataText.value = ""
      dataText.setAttribute("placeholder", "Твой текст должен быть формата JSON или XML")
    }
    saveProducts();
})
dataText.addEventListener("click", () => {
  dataText.setAttribute("placeholder", "Поле...")
})
//Считывание теста через кнопку


//Экспортирование в JSON файл
const jsonButton = document.getElementById("import-json");
jsonButton.addEventListener("click", () => {
  for(let product of products){
    dataText.value += JSON.stringify(product)+"\n"
  }
})

//Экспортирование в XML файл
function toXmlFile(product){
  let xmlText = `<products>
                    <name>${product.name}</name>  
                    <price>${product.price}</price>
                    <category>${product.category}</category>
                    <inStock>${product.inStock}</inStock>    
                  </products>`
  const xml = new DOMParser().parseFromString(xmlText, "application/xml")
  return xml
}
const xmlButton = document.getElementById("import-xml");
xmlButton.addEventListener("click", () => {
  for(let product of products){
    const xmlSeriliaze = new XMLSerializer();
    let item = toXmlFile(product);
    const xmlText = xmlSeriliaze.serializeToString(item);
    dataText.value += xmlText+"\n";
  }
})


//Добовяем новые данные припомощи формы
const myForm = document.myForm;
const name = myForm.text
const cost = myForm.number
const select = myForm.category;
const check = myForm.check
const submit = myForm.submit
function dataForm(){
  let data = {};
  let selected = select.options[select.selectedIndex];
  if(name.value.length < 3){
    name.value = ""
    name.className = "error";
    name.setAttribute("placeholder", "Has to be more 3 letter");
  }
  else{
    data["name"] = name.value;
    name.className = "setting"
    name.removeAttribute("placeholder")
  }
  if(cost == 0 || cost.value == ""){
    cost.value = ""
    cost.className = "error";
    cost.setAttribute("placeholder", "Has to be more 0")
  } else{
    data["price"] = Number(cost.value);
    cost.className = "setting";
    cost.removeAttribute("placeholder")
  }
  data["category"] = selected.text;
  data["inStock"] = check.checked;
  return data
}
submit.addEventListener("click", (e) => {
  let data = dataForm()
  if(Object.entries(data).length < 4){
    dataText.value = "Write me all options";
  }
  else{
    products.push(data);
    saveProducts()
  }
  e.preventDefault()
  myForm.reset()
})


//Блок поиска и фильтрации
const search = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
categoryFilter.addEventListener("change", () => {
  let catProducts = [];
  let selectedCat = categoryFilter.options[categoryFilter.selectedIndex]; 
  for(let product of products){
    if(product.category == selectedCat.text) catProducts.push(product)
  }
  let localCat = [];
  catProducts.forEach(cat => {
    localCat.push(cat)
  })
  localStorage.setItem("Category", JSON.stringify(localCat))
})
search.addEventListener("input", () => {
  const getCategory = localStorage.getItem("Category");
  const parse = JSON.parse(getCategory)
  for(let char of parse){
    if(char.name.includes(search.value)){
      dataText.value += JSON.stringify(char);
    }
    if(search.value == "") dataText.value = ""
  }
})


//Создание таблицы
const table = document.getElementById("table");
function createTable(){
  for(let product of products){
    let tr = document.createElement("tr");
    table.appendChild(tr)
    const tableLists = [product.name, product.price, product.category, product.inStock, `<button id="remove">Remove</button>`];
    for(let list of tableLists){
      let td = document.createElement("td");
      tr.appendChild(td)
      td.innerHTML = list
    }
  }
  const removeBut = document.getElementById("remove");
  removeBut.addEventListener("click", () => {
    console.log("hello")
  })
}
createTable()


