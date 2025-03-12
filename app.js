let localStorageArray = [];

const container = document.querySelector(".container");
const addBoard = document.getElementById("addBoard");
const popUpMenu = document.querySelector(".pop-up-menu");
const cancelX = document.querySelectorAll(".can-x");
 

//check container Empty

const checkForEmpty = ()=>{
    if([...container.children].length >4){
        container.classList.add("no-items");
    }
    else{
        container.classList.remove("no-items");

    }
}




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

const createAndAppendTask = ( bTitle ,board , text, count ,color)=>{


    const task = createEle("div","task");
    task.setAttribute("draggable",true);

    const topPortion = createEle("div" , "top-of-task");

    const icon1 = createEle("i","fa-solid", "fa-circle-notch");
    icon1.style.color = color;
    const span = createEle("span");
    span.textContent= bTitle;
    const icon2 = createEle("i","fa-solid", "fa-minus");
    icon2.setAttribute("id", "minus");

    topPortion.append(icon1,span,icon2);


    icon2.addEventListener("click",(e)=>{

        //updating counter
        const parentBoard = e.target.parentElement.parentElement.parentElement.parentElement
        const counter = parentBoard.children[0].children[0].children[2];
        counter.textContent = Number(counter.textContent) - 1 ;
        console.log(parentBoard)

        

        let index = localStorageArray.findIndex(item=>item.title === parentBoard.children[0].children[0].children[1].textContent);
        let taskIndex = localStorageArray[index].tasks.indexOf(text);
        if(taskIndex=== -1){
            alert("not found ");
            return;
        }
        localStorageArray[index].tasks.splice(taskIndex,1);

        task.remove();

        // count.textContent = parseInt(count.textContent)-1; @BUG
       

        localStorage.setItem("local",JSON.stringify(localStorageArray));


    });


    const taskReason = createEle("p","task-purpose");
    taskReason.textContent = text ;

    task.append(topPortion , taskReason);

   
    board.appendChild(task);
  

    


    // dragging event
    task.addEventListener("dragstart",(e)=>{
        const parent = e.target.parentNode.parentNode;
        
        parent.children[0].children[0].children[2].textContent = parseInt(parent.children[0].children[0].children[2].textContent)-1;


        let indexOfObj =localStorageArray.findIndex((obj)=> obj.title.toLowerCase() === parent.children[0].children[0].children[1].textContent.toLowerCase());
        let textIndex = localStorageArray[indexOfObj].tasks.indexOf(text);
        localStorageArray[indexOfObj].tasks.splice(textIndex,1);
        localStorage.setItem("local",JSON.stringify(localStorageArray));
        
        task.classList.add("flying-child");
    });

    // drag end

    task.addEventListener("dragend",(e)=>{

        const parent = e.target.parentNode.parentNode;        
        parent.children[0].children[0].children[2].textContent = parseInt(parent.children[0].children[0].children[2].textContent)+1;
        let indexOfObj =localStorageArray.findIndex((obj)=> obj.title.toLowerCase() === parent.children[0].children[0].children[1].textContent.toLowerCase());
        const childArray = [...parent.children[1].children];
       
        //updating local storage
        
        localStorageArray[indexOfObj].tasks = childArray.map(child => child.children[1].textContent.toLowerCase());
        localStorage.setItem("local",JSON.stringify(localStorageArray));

        task.classList.remove("flying-child");
       
    });
    


    


    count.textContent = parseInt(count.textContent)+1;

    let indexOfItem = localStorageArray.findIndex((item)=>item.title == bTitle);
    localStorageArray[indexOfItem].tasks.push(text);
    localStorage.setItem("local",JSON.stringify(localStorageArray));

  






}





//Create aNew Board 

const createNewBoard = ( title , desc , color)=>{
    

    const board = createEle("div","item");


    // top bar
    const topBar = createEle("div","top-bar");
    const topData = createEle("div","top-data");

    const arrowRight = createEle("i", "fa-solid" ,"fa-arrow-up-right-from-square" ,"icons");
    arrowRight.style.color = color;
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

        //check for Empty 
        checkForEmpty();

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
        createAndAppendTask( title,boardContent , inputTask.value.trim() , taskCount , color);
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
    footerStatus.classList.add("add-btn")
    footerBar.append(footerStatus , inputItems );


    board.append(topBar , boardContent , footerBar);

    //appending to container
   
    container.insertBefore( board , addBoard);
    
     //check for Empty 
     checkForEmpty();
       
  
   



    // boardContent -  DragEvent
    boardContent.addEventListener("dragover",(e)=>{

        

        const child = document.querySelector(".flying-child");
        const allOtherSiblings = [...boardContent.children];
        child.children[0].children[1].textContent = title;
        child.children[0].children[0].style.color = color ;
        



        const nextSibling = allOtherSiblings.find(sibling=> (e.clientY-40) <= sibling.offsetTop+ sibling.offsetHeight / 2   );
        
        boardContent.insertBefore(child , nextSibling);

        // boardContent.parentNode.children[0].children[0].children[2].textContent= parseInt(boardContent.parentNode.children[0].children[0].children[2].textContent)+1;

        

        
       
    })
    

    if(!localStorageArray.some(item =>item.title === title) ){
        localStorageArray.push(
            {
                "title":title,
                "color":color,
                "desc":desc,
                "tasks":[]

            }
        );
        localStorage.setItem("local",JSON.stringify(localStorageArray));



    }

    return [boardContent, taskCount] ;





 



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
        const colorPalets = document.querySelector("#colorSelect");
        const colorPalletChild = [...colorPalets.children];
        const checkedColor = colorPalletChild.find(item=>item.checked);
    



        createNewBoard(boardTitle.value.trim(), boardDesc.value.trim() ,checkedColor.value);
            
     
        

        boardTitle.value ="";
        boardDesc.value = "";
        popUpMenu.style.display="none";


    });






//check for empty
checkForEmpty();




// localStorage

document.addEventListener("DOMContentLoaded" ,()=>{


    container.style.display="none";
  
    
    const localStorageArrayCheck = JSON.parse(localStorage.getItem("local"))||[];
    localStorageArrayCheck.forEach(item=>{
        let boardContent =createNewBoard(item.title,item.desc,item.color);
        item.tasks.forEach(task =>{
            createAndAppendTask(item.title , boardContent[0] , task , boardContent[1],item.color);
        })

    })
    checkForEmpty();
    container.style.display="flex";


} );









