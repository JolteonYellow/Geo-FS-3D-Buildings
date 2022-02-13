// ==UserScript==
// @name         Geo-FS Builidings
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  3D buildings for Geo-FS
// @author       Eco, AF267, Elon, GT, Echo_3
// @match http://*/geofs.php*
// @match https://*/geofs.php*
// @version 0.3
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

var maxDistance = 5;
var objs;

//Get the model list
fetch('https://raw.githubusercontent.com/TotallyRealElonMusk/Geo-FS-3D-Buildings/main/TamperMonkey/CustomBuildings.json')
    .then(res => res.json())
    .then(data => objs = data)

! function(e) {
    //Spawning Function
    function spawnModel(modelJson){
        var name = modelJson.name;
        var url = modelJson.url;
        var position = modelJson.position;
        var rotation = modelJson.rotation;
        var scale = modelJson.scale;

        //Check if all of the values are valid or if any need to be set to defaults
        if (url == null){
            console.log("Failed to Spawn, No url provided")
            return
        }
        if (position == null){
            console.log("Failed")
            return "Failed To Spawn, No position provided";
        }
        if (scale == null){
            scale = [1,1,1];
        }
        if (rotation == null){
            rotation = [0,0,0];
        }
        //Loading the model and adding it to the list of loaded models
        var model = geofs.api.loadModel(url);
        geofs.api.setModelPositionOrientationAndScale(model,position,rotation,scale);
        console.log("Spawned: "+name+" at: "+position);
        return model
    }
    //Deleting Function
    function deleteModel(model){
        geofs.api.destroyModel(model);
        console.log("Deleted Object")
    }
    //Function To check if something is in the rendering Range
    function isInRange(objectPosision, maxDistance){
                var playerLocation = geofs.aircraft.instance.llaLocation;//get the player lat and long
                //Calculating the stuff
                var differenceX = playerLocation[0]-objectPosision[0];
                var differenceY = playerLocation[1]-objectPosision[1];
                var distance = Math.abs((differenceX*differenceX)+(differenceY*differenceY));//Pythagarous to find the distance, no square root because the max distance is squared, absolute to avoid negatives
                if (distance >= (maxDistance*maxDistance)){
                    return false;
                }
                else{
                    return true;
                    }
            }

    var o = setInterval(function() {
        window.geofs && geofs.aircraft && geofs.aircraft.instance && geofs.aircraft.instance.object3d && (clearInterval(o), function() {
            const objectsInfo = []
            for (var i = 0; i < objs.length; i++){
                let objPosition = objs[i].position;
                let active = isInRange(objPosition, maxDistance);
                //
                let hasBeenSpawned = false;
                let model = null;
                //
                let objInfo = [objs[i],model,active,hasBeenSpawned];
                //Spawning the things:
                if (objInfo[2] == true){
                    model = spawnModel(objs[i]);
                    objInfo[1] = model;
                    objInfo[3] = true;
                }
                objectsInfo.push(objInfo);

            }
            //What happens every few seconds/Updating the currently spawned buildings
            const interval = setInterval(updateBuildings, 10000);
            function updateBuildings(){
                //Cycling through all of the things in object info
                for (var i = 0; i < objectsInfo.length; i++){
                    //checking if the model is in range
                    let objInfo = objectsInfo[i];
                    let objPosition = objInfo[0].position;
                    let active = isInRange(objPosition, maxDistance);
                    //Find the state of the model
                    if (active == true && objInfo[3] == false){
                        let model = spawnModel(objInfo[0]);
                        objInfo[1] = model;
                        objInfo[3] = true;
                        //console.log("Spawned: "+objInfo[0].name);//If it is in range but not spawned, it needs to be spawned
                    }
                    else if (active == false && objInfo[3] == true){
                        deleteModel(objInfo[1]);
                        objInfo[1] = null;
                        objInfo[3] = false;
                        console.log("Deleted: "+objInfo[0].name);//If it is spawned but not in the range, it is deleted
                    }
                    objectsInfo[i] = [objInfo[0],objInfo[1],objInfo[2],objInfo[3]]//setting all of the data to the things new things incase they were changed
                }
            }
            const collsionObjects = {
                carrier2 : {
                    //Spawn Location: "50.76575873754467, -1.1927880445846175, 30, 0,175"
                    location : [50.76575873754467, -1.1927880445846175, 0],
                    url : "https://www.geo-fs.com/backend/aircraft/repository/Flighter%20Jet_310810_2198/QE2model.glb",
                    collisionRadius : 400,
                    collisionTriangles : [
                        [
                            [33 ,-77 ,30 ],
                            [33 ,150 ,30 ],
                            [-33 ,150 ,30 ],
                        ],
                        [
                            [-33 ,150 ,30 ],
                            [-33 ,-77 ,30 ],
                            [33 ,-77 ,30 ],
                        ],
                        [
                            [16.0,-135.0,37.0],
                            [-0.0,-135.0,37.0],
                            [16.0,-134.0,36.0],
                        ],
                        [
                            [-0.0,-135.0,37.0],
                            [16.0,-130.0,35.0],
                            [16.0,-135.0,37.0],
                        ],
                        [
                            [-0.0,-130.0,35.0],
                            [16.0,-130.0,35.0],
                            [-0.0,-135.0,37.0],
                        ],
                        [
                            [16.0,-124.0,34.0],
                            [16.0,-130.0,35.0],
                            [-0.0,-130.0,35.0],
                        ],
                        [
                            [16.0,-124.0,34.0],
                            [-0.0,-124.0,34.0],
                            [-0.0,-130.0,35.0],
                        ],
                        [
                            [16.0,-124.0,34.0],
                            [16.0,-116.0,33.0],
                            [-0.0,-124.0,34.0],
                        ],
                        [
                            [16.0,-116.0,33.0],
                            [-0.0,-124.0,34.0],
                            [-0.0,-116.0,33.0],
                        ],
                        [
                            [-0.0,-116.0,33.0],
                            [16.0,-116.0,33.0],
                            [16.0,-107.0,32.0],
                        ],
                        [
                            [0.0,-107.0,32.0],
                            [-0.0,-116.0,33.0],
                            [16.0,-107.0,32.0],
                        ],
                        [
                            [0.0,-107.0,32.0],
                            [16.0,-107.0,32.0],
                            [16.0,-98.0,31.0],
                        ],
                        [
                            [0.0,-98.0,31.0],
                            [0.0,-107.0,32.0],
                            [16.0,-98.0,31.0],
                        ],
                        [
                            [0.0,-88.0,31.0],
                            [0.0,-98.0,31.0],
                            [16.0,-98.0,31.0],
                        ],
                        [
                            [0.0,-88.0,31.0],
                            [16.0,-88.0,31.0],
                            [16.0,-98.0,31.0],
                        ],
                        [
                            [0.0,-88.0,31.0],
                            [16.0,-88.0,31.0],
                            [16.0,-77.0,30.0],
                        ],
                        [
                            [0.0,-77.0,30.0],
                            [0.0,-88.0,31.0],
                            [16.0,-77.0,30.0],
                        ]
                    ],
                    options : {
                        castShadows: !0,
                        receiveShadows: !0
                    }
                }
            };
            for (var a in collsionObjects) {
                var currentObj = collsionObjects[a];
                objects.list.carrier2 = currentObj;
                objects.init();
            }
            //geofs.flyTo([50.76619260070758, -1.192606945462554,0,180])
        }())
    }, 100)
}();
