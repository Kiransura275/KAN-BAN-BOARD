let localStorageArray = [];

const container = document.querySelector(".container");
const addBoard = document.getElementById("addBoard");
const popUpMenu = document.querySelector(".pop-up-menu");
const cancelX = document.querySelectorAll(".can-x");
 


//Element creator
const createEle = (ele , ...cls) => {
    const element = document.createElement(ele);
    if(!cls.length) return element;
    cls.forEach((clsName)=>{
        element.classList.add(clsName);
    })
    return element;
    

}

// creating and appending tasks

const createAndAppendTask = ( bTitle ,board , text, count )=>{


    const task = createEle("div","task");
    task.setAttribute("draggable",true);

    const topPortion = createEle("div" , "top-of-task");

    const icon1 = createEle("i","fa-solid", "fa-circle-notch");
    const span = createEle("span");
    span.textContent="Draft";
    const icon2 = createEle("i","fa-solid", "fa-minus");
    icon2.setAttribute("id", "minus");

    topPortion.append(icon1,span,icon2);

    icon2.addEventListener("click",()=>{

        let index = localStorageArray.findIndex(item=>item.title === bTitle);
        let taskIndex = localStorageArray[index].tasks.indexOf(text);
        localStorageArray[index].tasks.splice(taskIndex,1);

        task.remove();
        count.textContent = parseInt(count.textContent)-1;
        localStorage.setItem("local",JSON.stringify(localStorageArray));


    })


    const taskReason = createEle("p","task-purpose");
    taskReason.textContent = text ;

    task.append(topPortion , taskReason);

    board.appendChild(task);


    // dragging event
    task.addEventListener("dragstart",()=>{
        task.classList.add("flying-child");
    });

    // drag end

    task.addEventListener("dragend",()=>{
        task.classList.remove("flying-child");
    });
    


    


    count.textContent = parseInt(count.textContent)+1;

    let indexOfItem = localStorageArray.findIndex((item)=>item.title == bTitle);
    localStorageArray[indexOfItem].tasks.push(text);
    localStorage.setItem("local",JSON.stringify(localStorageArray));

  






}





//Create aNew Board 

const createNewBoard = ( title , desc)=>{
    

    const board = createEle("div","item");


    // top bar
    const topBar = createEle("div","top-bar");
    const topData = createEle("div","top-data");

    const arrowRight = createEle("i", "fa-solid" ,"fa-arrow-up-right-from-square" ,"icons");
    const taskHeading = createEle("h6","task-heading");

    taskHeading.textContent = title ;
    const taskCount = createEle("i","task-count");
    taskCount.textContent = 0;
    const delIcon = createEle("i", "fa-solid" ,"fa-trash" ,"icons");
    delIcon.setAttribute("id","deleteIcon");

    // delete board 
    delIcon.addEventListener("click",(e)=>{

        let index = localStorageArray.findIndex((item)=>item.title === board.title );
        localStorageArray.splice(index,1);
        board.remove();
        localStorage.setItem("local",JSON.stringify(localStorageArray));
    })


   

    topData.append(arrowRight ,taskHeading ,taskCount , delIcon);
    topBar.appendChild(topData);


    const description  = createEle("p","description");
    description.textContent = desc ;
    topBar.appendChild(description) ;


    // board content 

    const boardContent = createEle("div" , "board-content");


    //footer

    const footerBar = createEle("div","footer-bar");

    const footerStatus =createEle("span","footer-status");

    const plusSign = createEle("i","plus");
    plusSign.textContent ="+ \t"

    const spanText =createEle("span");
    spanText.textContent = "Add item";

    const inputItems = createEle("div","inputItems");

    const inputTask = createEle("input");
    inputTask.setAttribute("id","inputItemTask");
    inputTask.setAttribute("placeholder","Enter Task");

    const addTaskBtn = createEle("button","add-btn");
    addTaskBtn.textContent = "add";


    inputItems.append(inputTask,addTaskBtn);


    // appending tasks

    addTaskBtn.addEventListener("click",()=>{
        if(!inputTask.value) {
            alert("Enter a valid Task ");
            return;
        }
        createAndAppendTask( title,boardContent , inputTask.value.trim() , taskCount);
        inputTask.value="";
        footerStatus.style.display = "inline-block";
        inputItems.style.display = "none";


    })






    // showing insert menu
    footerStatus.addEventListener("click",function(){
        // showInsertOption(footerStatus ,inputItems)
        footerStatus.style.display = "none";
        inputItems.style.display = "flex";
     
    })


    footerStatus.appendChild(plusSign);
    footerStatus.appendChild(spanText);
    footerBar.append(footerStatus , inputItems );


    board.append(topBar , boardContent , footerBar);

    //appending to container
    container.insertBefore( board , addBoard);



    // boardContent -  DragEvent
    boardContent.addEventListener("dragover",(e)=>{

        

        const child = document.querySelector(".flying-child");
        const allOtherSiblings = [...boardContent.children];


        const nextSibling = allOtherSiblings.find(sibling=> (e.clientY-40) <= sibling.offsetTop+ sibling.offsetHeight / 2   );
      
        
        
        boardContent.insertBefore(child , nextSibling);
       
    })
    

    if(!localStorageArray.some(item =>item.title === title) ){
        localStorageArray.push(
            {
                "title":title,
                "desc":desc,
                "tasks":[]

            }
        );
        localStorage.setItem("local",JSON.stringify(localStorageArray));



    }

    return boardContent ;





 



}






// open Popup

addBoard.addEventListener('click',()=>{


    popUpMenu.style.display = "flex";



})


// close pop up
    

    cancelX.forEach((item)=>{
        console.log(item);
        
        item.addEventListener("click",()=>{
            popUpMenu.style.display = "none";
        })
    }) ;


//add board to container

const addReqBoard = document.getElementById("addReqBoard");

    addReqBoard.addEventListener("click",()=>{

        const boardTitle = document.getElementById("boardTitle");
        const boardDesc = document.getElementById("boardDesc");
        
            
        if(!boardTitle.value ||!boardDesc.value)
        {
            alert("Fill All Details");
            return;
        }
        createNewBoard(boardTitle.value.trim(), boardDesc.value.trim());
            
     
        

        boardTitle.value ="";
        boardDesc.value = "";
        popUpMenu.style.display="none";


    });











// localStorage

window.addEventListener("load" ,()=>{
  
    
    const localStorageArrayCheck = JSON.parse(localStorage.getItem("local"))||[];
    localStorageArrayCheck.forEach(item=>{
        let boardContent =createNewBoard(item.title,item.desc);
        item.tasks.forEach((task,index) =>{
            createAndAppendTask(item.title , boardContent , task , index+1);


        })

    })


} );






