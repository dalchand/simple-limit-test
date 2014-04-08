Data = new Meteor.Collection("data");

if (Meteor.isClient) {

  var deps = null;
  var object = {index: {$gte: 6, $lt: 60}, limit: 10};
  var objectDep = new Deps.Dependency;

  setupTest = function() {
    deps = Deps.autorun(function(){
      var o = getObject();
      if(o) {
        console.log("subscribing...");
        Meteor.subscribe("data", o, function(){
          console.log("subscription ready");
        });
      }
    });
  }

  stopTest = function() {
    if(deps) {
      deps.stop();
    }
  }

  setLimit = function(limit) {
    object.limit = limit;
    objectDep.changed();
  }

  var getObject = function() {
    objectDep.depend();
    return object;
  }

  executeTest = function() {
    setupTest();
    setLimit(20);
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if(!Data.findOne()) {
      for(var i = 0 ; i < 100; i++) {
        Data.insert({index: i, title: "This is document " + i});
      }
    }
  });

  Meteor.publish("data", function(object){
    return Data.find({index: object.index}, {limit: object.limit});
  }) 

}
