angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  
  .state('title', {
    url: '/title',
    templateUrl: 'templates/title.html'
  })
  
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('forgotpw', {
    url: '/forgotpw',
    templateUrl: 'templates/forgotpw.html',
    controller: 'forgotpwCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('home', {
    url: "/home",
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('profile', {
    url: "/profile",
    cache: false,
    templateUrl: 'templates/profile.html',
    controller: 'profileCtrl'
  })

  .state('editprofileimage', {
    url: "/editprofileimage",
    cache: false,
    templateUrl: 'templates/editProfileImage.html',
    controller: 'profileCtrl'
  })

  .state('contact', {
    url: "/contact",
    cache: false,
    templateUrl: 'templates/EmerContact/contact.html',
    controller: 'contactCtrl'
  })

  .state('perContact', {
    url: "perContact/:id",
    cache: false,
    templateUrl: 'templates/EmerContact/per_contact.html',
    controller: 'perContactCtrl',
    resolve: {
      oneContact: function($stateParams,EmerContact){
        return EmerContact.getOne($stateParams.id)
      }
    }
  })

  .state('prevention', {
    url: "/prevention",
    cache: false,
    templateUrl: 'templates/prevention.html',
    controller: 'preventionCtrl'
  })

  .state('perPrevention', {
    url: "perPrevention/:id",
    cache: false,
    templateUrl: 'templates/per_prevention.html',
    controller: 'perPreventionCtrl',
    resolve: {
      onePrevention: function($stateParams,Prevention){
        return Prevention.getOne($stateParams.id)
      }
    }
  })

  .state('sos', {
    url: "/sos",
    templateUrl: 'templates/sos.html',
    controller: 'sosCtrl'
  })

  .state('news', {
    url: "/news",
    templateUrl: 'templates/news.html',
    controller: 'newsCtrl'
  })

  .state('perNews', {
    url: "perNews/:id",
    cache: false,
    templateUrl: 'templates/per_news.html',
    controller: 'perNewsCtrl',
    resolve: {
      oneNews: function($stateParams,News){
        return News.getOne($stateParams.id)
      }
    }
  })

  .state('mapping', {
    url: "/mapping",
    cache: false,
    templateUrl: 'templates/mapping.html'
  })

  .state('mapping.latestMap', {
    url: "/latestMap",
    cache: false,
    views: {
      'latestMap': {
        templateUrl: "templates/latestMap.html",
        controller: 'latestMapCtrl'
      }
    }
  })

  .state('mapping.allMap', {
    url: "/allMap",
    cache: false,
    views: {
      'allMap': {
        templateUrl: "templates/allMap.html",
        controller: 'allMapCtrl'
      }
    }
  })

  .state('witness', {
    url: "/witness",
    templateUrl: 'templates/witness.html',
    controller: 'witnessCtrl'
  })

  .state('reminder', {
    url: "/reminder",
    cache: false,
    templateUrl: 'templates/Reminder/reminder.html',
    controller: 'reminderCtrl'
  })

  .state('perReminder', {
    url: "perReminder/:id",
    cache: false,
    templateUrl: 'templates/Reminder/perReminder.html',
    controller: 'perReminderCtrl',
    resolve: {
      oneReminder: function($stateParams,Reminder){
        return Reminder.getOne($stateParams.id)
      }
    }
  })
  
  // $urlRouterProvider.otherwise('/login');

  if(localStorage.getItem('user') == null || localStorage.getItem('user') == undefined)
    $urlRouterProvider.otherwise('/title');
  else
    $urlRouterProvider.otherwise('/home');
});