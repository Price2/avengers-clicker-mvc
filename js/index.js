// The avenger model containing all the data with init func for a default avenger selection

var avengerModel ={
currentAvenger: null,
isAdminFlag: false,
data:[{
    name: "Iron Man",
    src:"images/ironman.png",
    clicks: 0
},
{
    name: "Hulk",
    src:"images/hulk.png",
    clicks: 0
},
{
    name: "Captain America",
    src:"images/cpt_america.jpg",
    clicks: 0
},
],

// called from the controller's init to initialize the model.
init: function(){
    if(this.currentAvenger== null){
        this.currentAvenger = this.data[0]
    }
}


}


// the avengerController containing all the events handling logic and getters/setters from models and the re-rendering calls of views

var avengerController ={ // controller's init calls all the views and models init functions as controller's init will be the first called
    init: function(){
        avengerModel.init();
        avengerListView.init();
        currentSelectedAvengerView.init();
        adminModeView.init();
    },

    // get currently selected avenger
    getCurrentAvengerModel: function(){
        return avengerModel.currentAvenger;
    },

    // get all the avengers array of objects
    getAllAvengers: function(){
        return avengerModel.data
    },

    // set the current selected avenger 
    setCurrentSelectedAvenger: function(avenger){
        avengerModel.currentAvenger = avenger
        currentSelectedAvengerView.render()
    },

    // Increase avenger click count 
    avengerCountIncrease: function(){
        avengerModel.currentAvenger.clicks++
        currentSelectedAvengerView.render()
        
    },

    // Admin toggler function to toggle between hiding and showing the admin mode
    toggleAdmin: function(){
        if( avengerModel.isAdminFlag == false){
            avengerModel.isAdminFlag = true
            adminModeView.showAdmin()
        } 
        else{
            avengerModel.isAdminFlag = false
            adminModeView.hideAdmin()
        }
    },

    // Event handler function for saving the input data and set the values received from the view to the current Selected Avenger
    saveAvenger: function(avengerObj){
        avengerModel.currentAvenger.name = avengerObj.name;
        avengerModel.currentAvenger.src = avengerObj.img;
        avengerModel.currentAvenger.clicks = avengerObj.clicks;
        currentSelectedAvengerView.render()
    },
    
    isAdminToggled: function(){
        if (avengerModel.isAdminFlag == true){
            adminModeView.render()
        }
    }
}


// Avengers Images list view
var avengerListView={

    // initialize the view with indexing the elem and render the elements
    init: function(){
        this.ul_elem =  $("#list-wrapper");
        this.render()
        
    },

    // access data from the controller and render element with the data
    render: function(){
        var avengers = avengerController.getAllAvengers();
        this.ul_elem.html("");

        for (let i = 0; i < avengers.length; i++) {
            let li_elem = $("<li></li>").css("cursor", "pointer")
            let img = $(`<img class="img-fluid" src=${avengers[i].src} alt="">`)
            $(img).click(function () { 
                avengerController.setCurrentSelectedAvenger(avengers[i])
                
            });
            
            li_elem.append(img)
            this.ul_elem.append(li_elem)
        }
        }
    }

// Current selected avenger image view
var currentSelectedAvengerView={
    
    // initialize and index the currently selected avenger and its info then render the object to the view
 init: function(){
    this.avengerElem = $("#currentSelectedAvenger");
    this.avengerImg = $("#avenger-img");
    this.avengerName = $("#avenger-name");
    this.avengerClicks = $("#avenger-clicks");

    $(this.avengerImg).click(avengerController.avengerCountIncrease);
    this.render()

 },
 // retrieve currently selected avenger object and fill the view with the object's data
 render: function(){
    var currentSelectedAvenger = avengerController.getCurrentAvengerModel()
    this.avengerImg.attr("src", currentSelectedAvenger.src).css("cursor", "pointer");
    this.avengerName.text(currentSelectedAvenger.name);
    this.avengerClicks.text(currentSelectedAvenger.clicks);
    avengerController.isAdminToggled();
 },
}

// admin mode view 
var adminModeView = {

    // initialize with indexing the admin btn and input wrappers with event handler for toggle
    init: function(){
        this.adminbtn = $("#admin-btn");
        this.inputWrapper = $("#inputWrapper");
        $(this.adminbtn).click(avengerController.toggleAdmin);
    },

    // render the inputs and labels view of the admin and add the event handlers
    render: function(){
        var adminSelectedAvenger = avengerController.getCurrentAvengerModel()

        this.inputWrapper.html("");
        this.nameLabel = $('<label for="avengerName">Name:</label>');
        this.nameInput = $('<input type="text" class="form-control" id="avengerName" required>').val(adminSelectedAvenger.name);
        this.imgLabel = $('<label for="avengerImg">Image URL:</label>');
        this.imgInput = $('<input type="text" class="form-control" id="avengerImg" required>').val(adminSelectedAvenger.src);
        this.clickCountLabel = $('<label for="avengerclickCount">Clicks:</label>');
        this.clickCountInput = $('<input type="number" class="form-control" id="avengerclickCount" required>').val(adminSelectedAvenger.clicks);
        this.saveBtn = $('<button type="submit" class="btn btn-success m-3">Save</button>');
        this.cancelBtn = $('<button class="btn btn-danger">Cancel</button>');
    

        

        $("form").submit(function (e) {
            e.preventDefault(); 
            avengerController.saveAvenger({name: adminModeView.nameInput.val(), img: adminModeView.imgInput.val(), clicks: adminModeView.clickCountInput.val()})
            
        });
        this.inputWrapper.append(this.nameLabel, this.nameInput, this.imgLabel, this.imgInput, this.clickCountLabel, this.clickCountInput, this.saveBtn, this.cancelBtn)

        $(this.cancelBtn).click(avengerController.toggleAdmin);
    },

    // empties the inputWrapper html/destroy the created view elements
    hideAdmin: function(){
        this.inputWrapper.html("");
    },

    // calls the render of this object to re-render the elements
    showAdmin: function(){
        this.render()
    }

    
}

// on app start call the controller's init to start
$(document).ready(function () {
       avengerController.init() 
});