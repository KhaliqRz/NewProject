//Авторизация и сессия пользователей
const userName = document.getElementById("name");
const enter = document.getElementById("enter");
const form = document.myForm;
//При нажатии на войти сохраняет данные в куки
enter.addEventListener("click", (e) => {
    if(userName.value == ""){
        userName.className= "error";
        userName.setAttribute("placeholder", "Enter some name")
        e.preventDefault()
    }
    let username = userName.value;
    const myDate = new Date();
    const hour = myDate.getHours();
    const minute = myDate.getMinutes();
    const second = myDate.getSeconds();
    document.cookie = `username=${username};max-age=300; path="/";`;
    document.cookie = `lastVisit=${hour}:${minute}:${second}`
    e.preventDefault();
})
//Извлечение значения из куки
function excerpt(){
    const cookies = document.cookie.split(";");
    const parts = [];
    cookies.forEach((cookie) => {
        parts.push(cookie.split("="))
    })
    const cookieParts = [];
    parts.forEach((part) => {
        cookieParts.push(part[1])
    })
    return cookieParts
}
//Изменение формы при обновлении страницы\
const exit = document.getElementById("exit");
const text = document.getElementById("text");
const label = document.getElementById("label");
exit.className = "none";
text.className = "none"
window.addEventListener("load", () => {
    if(excerpt().length == 2){
        enter.className = "none"
        label.className = "none";
        exit.className = "block";
        text.textContent = `${excerpt()[0]}: ${excerpt()[1]}`;
        text.className = "block"
    }
})
//Кнопка выхода
exit.addEventListener("click", () => {
    document.cookie = "username=;max-age=0;";
    document.cookie = "lastVisit=;max-age=0;";
    exit.className = "none";
    text.className = "none";
    enter.className = "block";
    label.className = "block";
})
//Авторизация и сессия пользователей
//Настройки интерфейса
const container = document.querySelector(".container");
const select = document.getElementById("select");
const theme = localStorage.getItem("theme");
const time = document.getElementById("switch");
const now = new Date();
const newTime = now.toLocaleTimeString("en-US");
const reset = document.getElementById("reset");
const exportBut = document.getElementById("export")
//Настройка темы
function setting(){
    let settings = []; 
    const selected = select.options[select.selectedIndex];
    settings.push(selected.value);
    if(time.checked){
        settings.push(newTime)
    }
    localStorage.setItem("workspace_settings", JSON.stringify(settings))
}
select.addEventListener("change", () => {
    setting();
})
//НАстройка формата времени
time.addEventListener("click", () => {
    setting()
})

const listSetting = JSON.parse(localStorage.getItem("workspace_settings"));
function getSetting(){
    if(listSetting != null){
        if(listSetting[0] != ""){
            container.classList.add(listSetting[0]) 
        }
        if(listSetting[1]){
            document.cookie = `lastVisit=${listSetting[1]};max-age=300;`
        }
    }
    
}
getSetting()
reset.addEventListener("click", () => {
    localStorage.removeItem("workspace_settings")
    const myDate = new Date();
    const hour = myDate.getHours();
    const minute = myDate.getMinutes();
    const second = myDate.getSeconds();
    document.cookie = `lastVisit=${hour}:${minute}:${second}`
})
//Черновик заметок
const area = document.getElementById("area")
area.addEventListener("input", () => {
    sessionStorage.setItem("draft_note", area.value)
})
const sessionSetting = sessionStorage.getItem("draft_note");
window.addEventListener("load", () => {
    area.textContent = sessionSetting;
})

const saved = JSON.parse(localStorage.getItem("draft_note") || "[]")
exportBut.addEventListener("click", () => {
    const sessionWord = sessionStorage.getItem("draft_note");
    saved.push(sessionWord)
    localStorage.setItem("draft_note", JSON.stringify(saved))
    sessionStorage.removeItem("draft_note");
    area.value = ""
})
//Черновик заметок
//Настройки интерфейса\



//Архив заметок
//Отображение LocalStorage
const ul = document.getElementById("list");
function listView(){
    for(let char of saved){
        const li = document.createElement("li");
        li.className = "localList"
        const p = document.createElement("p");
        p.textContent = char;
        const remove = document.createElement("button");
        remove.className = "remove"
        remove.textContent = "Remove"
        li.append(p);
        li.append(remove);
        ul.appendChild(li);
    }
}
listView()
//Удаление элемента
function removeElement(){
    const remove = document.querySelectorAll(".remove");
    const li = document.querySelectorAll(".localList");
    for(let i = 0; i < li.length; i++){
        remove[i].addEventListener("click", () => {
            const text = li[i].firstChild.textContent.trim();
            const index = saved.indexOf(text);
            if(index !== -1){
                saved.splice(index, 1);
                localStorage.setItem("draft_note", JSON.stringify(saved));
            }
            ul.removeChild(li[i])
        })
    }
}
removeElement()
//Экспорт
const exportJson = document.getElementById("export-json");
const importArea = document.getElementById("importArea");
const importJson = document.getElementById("import")
exportJson.addEventListener("click", () => {
    importArea.value = JSON.stringify(saved)
})
importArea.addEventListener("input", () => {
    localStorage.setItem("draft_note", JSON.stringify(importArea.value));
})
importJson.addEventListener("click", () => {
        const newSave = JSON.parse(localStorage.getItem("draft_note") || "[]");
        localStorage.setItem("draft_note", newSave);
        importArea.value = ""
})
//Архив заметок