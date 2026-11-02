//Составление списка
const task = document.getElementById("task");
const taskList = document.getElementById("task-list");
const add = document.getElementById("add");
//добавление записи в хранилище
const saved = JSON.parse(localStorage.getItem("taskList") || "[]");
function localDisk(){
    if(task.value !== ""){
        saved.push(task.value);
        localStorage.setItem("taskList", JSON.stringify(saved))
        task.value = "";
    }
}
//Создание списка
add.addEventListener("click", (e) => {
    localDisk();
})
function showTask(){
    for(let save of saved){
        const li = document.createElement("li");
        const div = document.createElement("div");
        const p = document.createElement("p");
        const removeBut = document.createElement("button");
        const addButton = document.createElement("button");
        p.textContent = save;
        div.className = "localList"
        addButton.className = "addButton"
        removeBut.className = "removeButton"
        addButton.textContent = "Execute";
        removeBut.textContent = "Remove"; 
        div.appendChild(p);
        div.appendChild(addButton);
        div.appendChild(removeBut);
        li.append(div);
        taskList.appendChild(li)
    }
}
showTask()
const remove = document.querySelectorAll(".removeButton");
const li = document.querySelectorAll(".localList");
const addBut = document.querySelectorAll(".addButton");
const finalList = document.getElementById("final");
const doing = document.getElementById("doing");
//удаление элементов
function removeElement(){
    for(let i = 0; i < li.length; i++){
        remove[i].addEventListener("click", () => {
            const text = li[i].firstChild.textContent.trim();
            const index = saved.indexOf(text);
            if(index !== -1){
                saved.splice(index, 1);
                localStorage.setItem("taskList", JSON.stringify(saved));
            }
            taskList.removeChild(li[i])
        })
    }
}
removeElement()
const finalParse = JSON.parse(localStorage.getItem("finalList") || "[]")
//Показывает результат
//Выполнение задания
function doingResult() {
  for (let i = 0; i < li.length; i++) {
    const item = li[i];
    const button = addBut[i];

    button.addEventListener("click", (e) => {
      e.preventDefault();
      button.disabled = true; // защита от повторных кликов

      const text = item.firstChild.textContent.trim();

      const doingItem = document.createElement("li");
      doingItem.innerHTML = '<span class="loader"></span> Doing...';
      doing.append(doingItem);

      setTimeout(() => {
        const index = saved.indexOf(text); // ищем актуальный индекс
        if (index !== -1) {
          saved.splice(index, 1);
          finalParse.push(text);
        }

        localStorage.setItem("taskList", JSON.stringify(saved));
        localStorage.setItem("finalList", JSON.stringify(finalParse));

        item.remove();
        doingItem.remove();
        location.reload()
      }, 5000);
    });
  }
}
doingResult();
function showResult(){
    const resultList = JSON.parse(localStorage.getItem("finalList") || "[]");
    for(let list of resultList){
        const result = document.createElement("li");
        result.textContent = `${list} [Success]`;
        finalList.appendChild(result)
    }
}
showResult()