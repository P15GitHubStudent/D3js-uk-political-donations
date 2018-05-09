        //allazei ton megisto arithmo selidon pou tha exei to istoriko mas !!!!
        function updateMaxNumOfPages(pageNum){
            alert('lets do this !!');       
         }

        //diagrafei ola ta antikeimena me klassi deletable ta einai oi eikones pou eisagame dunamika :)
        function clearImages(){
          //  curHistPos=0;
            var element = document.querySelectorAll('.deletable');
            Array.prototype.forEach.call(element,function( node ){
                node.parentNode.removeChild( node );
            });
        }

        function cleanHist(){
            console.log('cleaning History');
            imagesCounter=0;
            curHistPos=0; //ksekiname ksana apo tin arxi
            clearImages(); // diegrapse oles tis eikones pou blepei o xristis
            // as min ksexasoume episis to array!
            var length = arrayOfImgNames.length;
            for(var c=0;c<length;c++){
                arrayOfImgNames.pop();
                arrayOfImgInfo.pop(); 
            }
            if(length > 0){
                console.log('cleaning Succedded!');
                writeHistory(0);      
            }
            else{
                console.log('Nothing to delete !!');
            }
                    
        }


        function writeHistory(value){
            //var headerHistory = document.getElementById("imageTest").children[0];
            //headerHistory.innerHTML = "History Position :"+ value;
            // const histIndexPos = 5;
            var headerHistory = document.getElementById("histId");
            headerHistory.innerHTML = "History Index :" + value;
            headerHistory.style.color = "orange";
            setTimeout(function(){
                headerHistory.style.color = "black";
            }, 500);
        }

        function goNextHistory(){
            
            var diff = arrayOfImgNames.length - (MAX_IMAGES_HISTORY_PAGE * (curHistPos+1));

            if(diff > 0){
                curHistPos++;
                clearImages();
                if(diff > MAX_IMAGES_HISTORY_PAGE){
                    diff=MAX_IMAGES_HISTORY_PAGE;
                }

                var counter=0;

                for(var c=0;c<diff;c++){
                    var index=curHistPos * MAX_IMAGES_HISTORY_PAGE+c;
                    //console.log('tooltip text');
                    //console.log(arrayOfImgInfo[0]); 
                     createImg(arrayOfImgNames[index],counter,arrayOfImgInfo[index]); // 0-8 gia arxi
                     counter++;
                     imagesCounter=diff;
                }

                writeHistory(curHistPos);
            }
            else{
                console.log('You dont have enough elements to procced to the next page!');
            }
        }

        function find(){
            
        }

        //KAI EDO !
        function goBackHistory(){

            //ama arithmo istoriko thetiko tote simainei oti mporo na pao piso 
            if(curHistPos > 0){
                clearImages();
                curHistPos--;

                var start = MAX_IMAGES_HISTORY_PAGE * curHistPos;
                var end   = start + MAX_IMAGES_HISTORY_PAGE;
                var counter=0;

                for (var c=start;c<end;c++){
                    //var index=curHistPos * MAX_IMAGES_HISTORY_PAGE+c;
                    createImg(arrayOfImgNames[c],counter,arrayOfImgInfo[c]);
                    counter++;
              }

                writeHistory(curHistPos);
                imagesCounter=MAX_IMAGES_HISTORY_PAGE; 

            }
            else{
                console.log('you cant go back you are at index 0 !!');
            }
        }