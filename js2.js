const text = document.querySelector('.text');
const submit = document.querySelector('.submit');
const todo = document.querySelector('.todo_item');
const progress = document.querySelector('.progress_bar');
const total = document.querySelector('.total');
const today = document.querySelector('.today');

/** shake animation */
const shakeAnimation = (target) => {
    target.animate([
    {transform: 'translateX(0)'},
    {transform: 'translateX(5px)'},
    {transform: 'translateX(-5px)'},
    {transform: 'translateX(0)'},
    ], {
    duration: 200
    })
}

let YMD = new Date();
let year = YMD.getFullYear();
let month = YMD.getMonth()+1;
let date = YMD.getDate();
let day = ["일", "월", "화", "수", "목", "금", "토"];

today.innerHTML = year + " / " + month + " / " + date + " (" + day[YMD.getDay()] + ")";

let saveProgress = [0, 0];
/** set progress-bar value, max */
function progressBar(value, max) {
    progress.setAttribute("value", value.toString());
    progress.setAttribute("max", max.toString());
    total.innerHTML = value + " / " + max;
    total.style.color = "black";
    saveProgress = [value, max];
    if (value === max && value === 0) {
        return;
    } else if (value === max) {
        shakeAnimation(progress);
        total.style.color = "blue";
    }
}

/** number of todo-list complete */
let level = 0;
let saveTodo = [];
let saveComplete = [];
function createDiv(a) {
    let Edit = document.createElement('div');
    let Delete = document.createElement('div');
    
    Edit.classList.add('edit');
    Delete.classList.add('delete');
    Edit.innerHTML = "<i class='fa-regular fa-pen-to-square'></i>";
    Delete.innerHTML = "<i class='fa-regular fa-trash-can'></i>";
    
    a.appendChild(Edit)
    a.appendChild(Delete)
}
/** create new todo line */
function addList(e) {
    let li = document.createElement('li');
    e.preventDefault();

    
    if (text.value !== '') {
        li.classList.add('todo');
        li.innerHTML = "<div>" + text.value + "</div>";
        createDiv(li);
        todo.append(li);
        saveTodo[saveTodo.length] = text.value;
        console.log(saveTodo);
        text.value = null;
        li.classList.add('slideIn');
        progressBar(level, todo.children.length);
    }
}
/** add edit/delete/complete */
function todos(e) {
    let target = e.target;
    let todoText = null;
    
    progressBar(level, todo.children.length);

    if (target.parentElement === null) {
        return;
    } else if (target.parentElement.classList.contains('edit') || target.classList.contains('edit')) {
        while (!target.classList.contains('todo')) {
            target = target.parentNode;
        }
        todoText = target.children[0].innerText;
        target.innerHTML = "<input type='text' value='" + todoText + "'/><input type='button' value='확인'>";
        target.children[1].addEventListener('click', () => {
            todoText = target.children[0].value;
            target.innerHTML = "<div>" + todoText + "</div>";
            createDiv(target);
            for (let i = 0; i < todo.children.length; i++) {
                if (todo.children[i] === target) {
                    saveTodo[i] = todoText;
                    console.log(saveTodo);
                }
            }
        })
    } else if (target.parentElement.classList.contains('delete') || target.classList.contains('delete')) {
        while (!target.classList.contains('todo')) {
            target = target.parentNode;
        }
        target.classList.remove('slideIn');
        target.classList.add('slideOut');
        for (let i = 0; i < todo.children.length; i++) {
            if (todo.children[i] === target) {
                saveTodo.splice(i, 1);
                console.log(saveTodo);
            }
        }
        setTimeout( () => {
            target.remove();
        }, 120);

        progressBar(level, todo.children.length);
    } else { 
        while (!target.classList.contains('todo')) {
            target = target.parentNode;
        }
        if (target.children[2] == undefined) {
            return;
        } else if (target.classList.contains('completed')) {
            target.classList.remove('completed');
            level--;
            progressBar(level, todo.children.length);
            for (let i = 0; i < todo.children.length; i++) {
                if (target === todo.children[i]) {
                    saveComplete[i] = false;
                    break;
                }
            }
        } else {
            target.classList.add('completed');
            level++;
            progressBar(level, todo.children.length);
            for (let i = 0; i< todo.children.length; i++) {
                if (target === todo.children[i]) {
                    saveComplete[i] = true;
                    break;
                }
            }
        }
    }

}
todo.addEventListener('click', (e)=>todos(e));
submit.addEventListener('click', (e)=> addList(e));



const memo = document.querySelector('.memo');
let saveMemo = '';

function onInput() {
    this.style.height = '88px';
    this.style.height = (this.scrollHeight) + "px";
}
memo.children[0].addEventListener('input', onInput, false);


const calender = document.querySelector('.calender-button');
const calenderBody = document.querySelector('.calender-body');
let first = new Date(YMD.getFullYear(), YMD.getMonth(), 1);
let dayList = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let monthList = ['January', "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let noLeapYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let pageFirst = first;
let pageYear;
if (first.getFullYear() % 4 === 0) {
    pageYear = leapYear;
} else {
    pageYear = noLeapYear;
}

let tdGroup = [];
function generateCalender() {
    let monthCnt = 100;
    let cnt = 1;
    for (var i = 0; i < 6; i++) {
        let $tr = document.createElement('tr');
        $tr.setAttribute('id', monthCnt);
        for (var j = 0; j < 7; j++) {
            if ((i === 0 && j < first.getDay()) || cnt > pageYear[first.getMonth()]) {
                let $td = document.createElement('td');
                $tr.appendChild($td);
            } else {
                let $td = document.createElement('td');
                $td.textContent = cnt;
                $td.setAttribute('id', cnt);
                $tr.appendChild($td);
                cnt++;
            }
        }
        monthCnt++;
        calenderBody.appendChild($tr);
    }
    markCalender(YMD.getDate());
}
generateCalender();
function markCalender(id) {
    for (let i = 1; i <= pageYear[first.getMonth()]; i++) {
        tdGroup[i] = document.getElementById(i);
        if (i === id) {
            tdGroup[i].classList.add('active');
        } else if (tdGroup[i].classList.contains('active')) {
            tdGroup[i].classList.remove('active');
        }
    }
}

function removeCalender() {
    let catchTr = 100;
    for (let i = 100; i < 106; i++) {
        let $tr = document.getElementById(catchTr);
        $tr.remove();
        catchTr++;
    }
}

let currentDate = document.getElementById(YMD.getDate());
currentDate.classList.add('active');

const headerButton = document.querySelector('header');
headerButton.addEventListener('click', (e) => {
    let target = e.target.parentElement;
    let id = YMD.getDate();
    if (target.classList.contains('prev')) {
        if (YMD.getMonth() === 0 && YMD.getDate() === 1) {
            alert('2021년은 없다!')
            return;
        } else {
            todayStorage();

            if (YMD.getDate() === 1) {
                YMD = new Date(YMD.getFullYear(), YMD.getMonth()-1, pageYear[YMD.getMonth()]);
                first = new Date(YMD.getFullYear(), YMD.getMonth(), 1);
                saveMonth = new newStorage(monthList[YMD.getMonth()]);
                removeCalender();
                generateCalender();
            } else {
                YMD = new Date(YMD.getFullYear(), YMD.getMonth(), YMD.getDate()-1);
            }
            today.innerHTML = YMD.getFullYear() + " / " + (YMD.getMonth()+1) + " / " + YMD.getDate() + " (" + day[YMD.getDay()] + ")";
            id = YMD.getDate();

            reloadList(id);
        }
       
    } else if (target.classList.contains('next')) {
        if (YMD.getMonth() === 11 && YMD.getDate() === pageYear[YMD.getMonth()]) {
            alert('2023년은 오지 않는다!')
            return;
        } else {
            todayStorage();

            if (YMD.getDate() === pageYear[YMD.getMonth()]) {
                YMD = new Date(YMD.getFullYear(), YMD.getMonth()+1, 1);
                first = new Date(YMD.getFullYear(), YMD.getMonth(), 1);
                saveMonth = new newStorage(monthList[YMD.getMonth()]);
                removeCalender();
                generateCalender();
            } else {
                YMD = new Date(YMD.getFullYear(), YMD.getMonth(), YMD.getDate()+1);
            }
            today.innerHTML = YMD.getFullYear() + " / " + (YMD.getMonth()+1) + " / " + YMD.getDate() + " (" + day[YMD.getDay()] + ")";
            id = YMD.getDate();
            reloadList(id);
        }
       
    } else if (target.classList.contains('prev-month')) {
        if (YMD.getMonth() === 0) {
            alert('2021년은 없다!')
            return;
        } else {
            todayStorage();

            if (pageYear[YMD.getMonth()-1] < id) {
                id = pageYear[YMD.getMonth()-1];
            }
            YMD = new Date(YMD.getFullYear(), YMD.getMonth()-1, id);
            first = new Date(YMD.getFullYear(), YMD.getMonth(), 1);
            saveMonth = new newStorage(monthList[YMD.getMonth()]);
            removeCalender();
            generateCalender();

            reloadList(id);
            today.innerHTML = YMD.getFullYear() + " / " + (YMD.getMonth()+1) + " / " + YMD.getDate() + " (" + day[YMD.getDay()] + ")";
        }
    } else if (target.classList.contains('next-month')) {
        if (YMD.getMonth() === 11) {
            alert('2023년은 오지 않는다!')
            return;
        } else {
            todayStorage();

            if (pageYear[YMD.getMonth()+1] < id) {
                id = pageYear[YMD.getMonth()+1];
                console.log(id)
            }
            YMD = new Date(YMD.getFullYear(), YMD.getMonth()+1, id);
            first = new Date(YMD.getFullYear(), YMD.getMonth(), 1);
            saveMonth = new newStorage(monthList[YMD.getMonth()]);
            removeCalender();
            generateCalender();
            
            reloadList(id);
            today.innerHTML = YMD.getFullYear() + " / " + (YMD.getMonth()+1) + " / " + YMD.getDate() + " (" + day[YMD.getDay()] + ")";
        }
    }
})

/** load saved memo, todo lists */
function reloadList(id) {
    console.log(id, saveMonth.getItem(id));
    if ((saveMonth.getItem(id) === undefined) || (saveMonth.getItem(id) === [])) {
        console.log(id, 'no data saved');
        saveMemo = '';
        saveTodo = [];
        saveProgress = [0, 0];
        saveComplete = [];

        progressBar(0, 0);
    } else {
        saveMemo = saveMonth.getItem(id)[0];
        saveTodo = saveMonth.getItem(id)[1];
        saveProgress = saveMonth.getItem(id)[2];
        saveComplete = saveMonth.getItem(id)[3];
        
        for (let i = 0; i < saveComplete.length; i++) {
            if (saveComplete[i]) {
                level++;
            }
        }
        console.log(saveMemo)

        progressBar(level, saveProgress[1]);
        
        console.log('day' + id ,saveMonth.getItem(id))
        memo.children[0].value = saveMemo;
        for (let i = 0; i < saveMonth.getItem(id)[1].length; i++) {
            let li = document.createElement('li');
            li.classList.add('todo');
            li.innerHTML = "<div>" + saveTodo[i] + "</div>";
            createDiv(li);
            if (saveComplete[i]) {
                li.classList.add('completed');
            }
            todo.appendChild(li);
        }
    }

    // change mark in calender date
    markCalender(id);
}

calender.addEventListener('click', (e)=>{
    let id = Number(e.target.getAttribute('id'));
    //console.log(e.target.children[0].classList.contains('calender'));
    if (e.target.hasAttribute('id')) {
        if (e.target.classList.contains('active')) {
            todayStorage();
            YMD = new Date(YMD.getFullYear(), YMD.getMonth(), id); 
            today.innerHTML = YMD.getFullYear() + " / " + (YMD.getMonth()+1) + " / " + id + " (" + day[YMD.getDay()] + ")"; 
            reloadList(id);
    
            let CALENDER = document.querySelector('.calender');
            clickCnt = 0;
            CALENDER.style.display = "none";
        }
        markCalender(id);
    }
    if (e.target.children[0] === undefined) {
        return;
    } else if (e.target.children[0].classList.contains('calender')) {
        let $calender = e.target.children[0];

        if ($calender.style.display === "none") {
            $calender.style.display = "block";
            markCalender(YMD.getDate());
        } else if ($calender.style.display === "block") {
            $calender.style.display = "none";
        }
    }
    
})

let newStorage = function(app) {
    /** 애플리케이션 이름 */
    this.app = app;
    /** 이용할 스토리지의 종류 (여기는 로컬스토리지) */
    this.storage = localStorage;
    /** 스토리지로부터 읽어들인 객체
     * 해당하는 객체가 없을 경우 빈 객체를 생성
     */
    this.data = JSON.parse(this.storage[this.app] || '{}');
}
newStorage.prototype = {
    /** 지정된 키로 값을 취득 */
    getItem : function(key) {
        return this.data[key];
    },
    /** 지정된 키/값으로 객체를 고쳐씀 */
    setItem : function(key, value) {
        this.data[key] = value;
    },
    /** newStorage 객체의 내용을 스토리지에 보관 */
    save : function() {
        this.storage[this.app] = JSON.stringify(this.data);
    }
}
let saveMonth = new newStorage(monthList[first.getMonth()]);
//console.log(saveMonth.storage.getItem('October'))
/** save data to local storage */
function todayStorage() {
    saveMemo = memo.children[0].value;
    
    let saveToday = [saveMemo, saveTodo, saveProgress, saveComplete];
    level = 0;
    saveMonth.setItem(YMD.getDate(), saveToday);
    saveMonth.save();

    // delete todo list
    todo.innerHTML = '';

}

// if user not clicks date in calender, close calender
window.addEventListener('click', (e) => {

    let target = e.target;
    if (memo.children[0].value !== '') {
        savememo = memo.children[0].value;
    }
    if (target.parentElement.classList.contains('prev-month') || target.parentElement.classList.contains('next-month')) {
        return;
    }
    while (!target.classList.contains('calender-button')) {
        target = target.parentNode;

        if (target === null) {
            return;
        } else if (target.nodeName == 'BODY') {
            target = null;
            calender.children[0].style.display = "none";
            return;
        }
    }

})
saveMonth.storage.clear()
