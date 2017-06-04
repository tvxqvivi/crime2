angular.module('app.services', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

// login user
.factory('Login', function($http, $ionicPopup){
  var users = [];

  return {
    login: function($params) {
      return $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://192.168.43.138/crime2laravel/public/api/v1/login',
        method: "POST",
        data: $params,
      })
      .success(function(response){
          users = response.data;
      })
      .error(function(response){
        $ionicPopup.alert({
            title: 'Error',
            template: 'Problem occured. Please try again later.'
          });
      });
    }
  };
})

//sign up user
.factory('Signup', function($http, $ionicPopup){
  var users = [];

  return {
    saveUser: function($params) {
      return $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://192.168.43.138/crime2laravel/public/api/v1/signup',
        // url: 'http://192.168.0.190/crime2laravel/public/api/v1/signup',
        method: "POST",
        data: $params,
      })
      .success(function(response){
        users = response.data.data;
      })
      .error(function(response){
        $ionicPopup.alert({
            title: 'Error',
            template: 'Problem occured. Please try again later.'
          });
      });
    }
  };
})

.factory('ForgotPW', function($http,$ionicPopup){

  return {
    forgotPw: function($params) {
      return $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://192.168.43.138/crime2laravel/public/api/v1/forgotpw',
        method: "POST",
        data: $params,
      })
      .success(function(response){
        users = response.data.data;
      })
      .error(function(response){
        $ionicPopup.alert({
            title: 'Error',
            template: 'Problem occured. Please try again later.'
          });
      });
    }
  };
})

//user profile
.factory('Profile', function($http, $q, $ionicPopup){
  var user = [];

  return {
    getProfile: function(id) {
      var dfd = $q.defer();
      $http({
        url:'http://192.168.43.138/crime2laravel/public/api/v1/viewprofile/' + id,
        // url:'http://192.168.0.190/crime2laravel/public/api/v1/viewprofile/' + id,
        method: "GET",
      })
      .then(function(response){
        user = response.data.data;
        dfd.resolve(user);
      })
      .catch(function(){
        alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'Internal server error. Please try again later.'
        });
          alertPopup.then(function(res) {
          console.log(res);
        });
      });
      return dfd.promise; 
    }
  };
})

//edit user profile
.factory('EditProfile', function($http, $ionicPopup, $localstorage){
  var users = [];
  var uID = $localstorage.get('user');

  return {
    editProfile: function($params) {
      return $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://192.168.43.138/crime2laravel/public/api/v1/editprofile/'+uID,
        // url: 'http://192.168.0.190/crime2laravel/public/api/v1/editprofile/'+uID,
        method: "POST",
        data: $params,
      })
      .success(function(response){
        users = response.data.data;
      })
      .error(function(response){
        $ionicPopup.alert({
            title: 'Error',
            template: 'Problem occured. Please try again later.'
          });
      });
    }
  };
})

//get emergency contacts
.factory('EmerContact', function($http, $q, $localstorage){
  var id = $localstorage.get('user');
  var contact = [];

  return {
    all: function(){
      var dfd = $q.defer();
      $http({
        url:'http://192.168.43.138/crime2laravel/public/api/v1/viewallcontacts/' + id,
        // url:'http://192.168.0.190/crime2laravel/public/api/v1/viewallcontacts/' + id,
        method: "GET",
      })
      .then(function(response){
        contact = response.data.data;
        dfd.resolve(contact);
      })
      return dfd.promise;
    },
    getOne: function(id){
      for(var i = 0; i < contact.length; i++){
        if(contact[i].id == id){
          return contact[i];
        }
      }
      return null;
    }
  }
})

//delete single emergency contact
.factory('DelContact', function($http, $ionicPopup){
  var result = [];

  return {
    delcontact: function(id){
      return $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://192.168.43.138/crime2laravel/public/api/v1/delcontact/' + id,
        method: "POST"
      })
      .success(function(response){
        result = response.data;
      })
      .error(function(response){
        $ionicPopup.alert({
          title: 'Error',
          template: 'Problem occured. Please try again later.'
        });
      })
    }
  }
})

//add new emergency contact
.factory('AddContact', function($http, $ionicPopup, $localstorage){
  var uID = $localstorage.get('user');
  var contact = [];

  return {
    addcontact: function($params){
      return $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://192.168.43.138/crime2laravel/public/api/v1/addcontact/' + uID,
        method: "POST",
        data: $params
      })
      .success(function(response){
        contact = response.data.data;
      })
      .error(function(response){
        $ionicPopup.alert({
          title: 'Error',
          template: 'Problem occured. Please try again later.'
        });
      })
    }
  }
})

//add new emergency contact
.factory('EditContact', function($http, $ionicPopup){
  var contact = [];

  return {
    editcontact: function($id,$params){
      return $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://192.168.43.138/crime2laravel/public/api/v1/editcontact/' + $id,
        method: "POST",
        data: $params
      })
      .success(function(response){
        contact = response.data.data;
      })
      .error(function(response){
        $ionicPopup.alert({
          title: 'Error',
          template: 'Problem occured. Please try again later.'
        });
      })
    }
  }
})

//report witnessed incident
.factory('Witness', function($http, $ionicPopup, $localstorage){
  var uID = $localstorage.get('user');
  var witnessed = [];

  return {
    addwitness: function($params){
      return $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://192.168.43.138/crime2laravel/public/api/v1/addwitness/' + uID,
        method: "POST",
        data: $params
      })
      .success(function(response){
        witnessed = response.data.data;
      })
      .error(function(response){
        $ionicPopup.alert({
          title: 'Error',
          template: 'Problem occured. Please try again later.'
        });
      })
    }
  }
})

//get crime mapping
.factory('Mapping', function($http,$q){
  return {
    all: function(){
      var dfd = $q.defer();
      $http({
        url:'http://192.168.43.138/crime2laravel/public/api/v1/viewallreports',
        method: "GET",
      })
      .then(function(response){
        var report = response.data.data;
        console.log(report);
        dfd.resolve(report);
      })
      return dfd.promise;
    }
  }
})

//get prevention tips
.factory('Prevention', function($http, $q){
  var prevention = [];

  return {
    all: function(){
      var dfd = $q.defer();
      $http({
        url:'http://192.168.43.138/crime2laravel/public/api/v1/viewalltips',
        method: "GET",
      })
      .then(function(response){
        prevention = response.data.data;
        dfd.resolve(prevention);
      })
      return dfd.promise;
    },
    getOne: function(id){
      var dfd = $q.defer();
      $http({
        url:'http://192.168.43.138/crime2laravel/public/api/v1/viewtip/' + id,
        method: "GET",
      })
      .then(function(response){
        prevention = response.data.data;
        dfd.resolve(prevention);
      })
      return dfd.promise;
    }
  }
})

//get news
.factory('News', function($http, $q){
  var news = [];

  return {
    all: function(){
      var dfd = $q.defer();
      $http({
        // url:'https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=92f9198bdac34117aae52ef04150d60a',
        url:'https://content.guardianapis.com/search?q=crime AND news&api-key=1a3f4e56-dc83-4177-8b4c-67bfc4cb0ad3&show-fields=thumbnail,publication',
        method: "GET",
      })
      .then(function(response){
        news = response.data.response.results;
        console.log(news);
        dfd.resolve(news);
      })
      return dfd.promise;
    },
    getOne: function(id){
      var dfd = $q.defer();
      $http({
        url:'https://content.guardianapis.com/' + id + '?api-key=1a3f4e56-dc83-4177-8b4c-67bfc4cb0ad3&show-fields=bodyText,thumbnail,publication',
        method: "GET",
      })
      .then(function(response){
        news = response.data.response.content;
        dfd.resolve(news);
      })
      return dfd.promise;
    }
  }
})

//add reminder
.factory('Reminder', function($http,$q,$ionicPopup,$localstorage){
  var uID = $localstorage.get('user');
  var getreminder = [];
  var delreminder = [];

  return {
    all: function(){
      var dfd = $q.defer();
      $http({
        url:'http://192.168.43.138/crime2laravel/public/api/v1/viewallreminder/' + uID,
        method: "GET",
      })
      .then(function(response){
        getreminder = response.data.data;
        dfd.resolve(getreminder);
      })
      return dfd.promise;
    },
    addreminder: function($params){
      return $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://192.168.43.138/crime2laravel/public/api/v1/addreminder/' + uID,
        method: "POST",
        data: $params
      })
      .success(function(response){
        console.log(response.message);
      })
      .error(function(response){
        $ionicPopup.alert({
          title: 'Error',
          template: 'Problem occured. Please try again later.'
        });
      })
    },
    editreminder: function(id,$params){
      return $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://192.168.43.138/crime2laravel/public/api/v1/editreminder/' + id,
        method: "POST",
        data: $params
      })
      .success(function(response){
        console.log(response.message);
      })
      .error(function(response){
        $ionicPopup.alert({
          title: 'Error',
          template: 'Problem occured. Please try again later.'
        });
      })
    },
    delreminder: function(id){
      return $http({
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://192.168.43.138/crime2laravel/public/api/v1/delreminder/' + id,
        method: "POST"
      })
      .success(function(response){
        delreminder = response.data;
      })
      .error(function(response){
        $ionicPopup.alert({
          title: 'Error',
          template: 'Problem occured. Please try again later.'
        });
      })
    },
    getOne: function(id){
      for(var i = 0; i < getreminder.length; i++){
        if(getreminder[i].id == id){
          return getreminder[i];
        }
      }
      return null;
    }
  }
})