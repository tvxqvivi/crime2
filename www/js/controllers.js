angular.module('app.controllers', [])

.controller('signupCtrl', function($scope,Signup, $ionicLoading, $state) {

  $scope.user = {};
  $scope.data = { gender: '' }

  $scope.signup = function()
  {
    var name = $scope.user.name;
    var email = $scope.user.email;
    var pw = $scope.user.pw;
    var conpw = $scope.user.confirmpw;
    var ic = $scope.user.ic;
    var gender = $scope.data.gender;
    var hpnum = $scope.user.hpnum;
    var address = $scope.user.address;

    var error = '';

    if(Object.keys($scope.user).length != 0)
    {
      if(name && email && pw && conpw && ic && hpnum && gender && address)
      {
        if(pw == conpw)
        {
          $params = $.param({
            "name": name,
            "email": email,
            "password": pw,
            "ic": ic,
            "gender": gender,
            "hpnum": hpnum,
            "address": address
          })

          Signup.saveUser($params).then(function(response)
          {
            if(response.data.success == true)
            {
              //clear sign up
              console.log(response.data.message);
              $scope.e = '';
              $scope.user = {};
              $ionicLoading.show({ template: 'Account successfully signed up. Please login to proceed.', duration: 3000});
              $state.go('login');
            }
            else
            {
              for(var key in response.data.message)
              {
                console.log(response.data.message[key][0]);
                //error.push(response.data.message[key][0]);
                error += '*' + response.data.message[key][0] + '<br>'
              }
              $scope.e = error;
              //$ionicLoading.show({ template: response.data.message, duration: 1500});
            }
          });
        }
        else
          //ionicloading password does not match
          $ionicLoading.show({ template: 'Confirm password does not match the password.', duration: 1500});
      }
      else
        //ionicloading please complete the form
        $ionicLoading.show({ template: 'Please complete the form before submitting.', duration: 1500});
    }
    else
      //ionicloading please fill in the form before proceed
      $ionicLoading.show({ template: 'Please key in your information before proceeding.', duration: 1500});
  }
})

.controller('forgotpwCtrl', function($scope,ForgotPW,$ionicLoading,$state) {

  $scope.user = {};

  $scope.forgotpw = function()
  {
    var email = $scope.user.email;
    var pw = $scope.user.pw;
    var conpw = $scope.user.confirmpw;
    var error = '';

    if(Object.keys($scope.user).length != 0)
    {
      if(email && pw && conpw)
      {
        if(pw == conpw)
        {
          $params = $.param({
            "email": email,
            "password": pw
          })

          ForgotPW.forgotPw($params).then(function(response)
          {
            if(response.data.success == true)
            {
              //clear sign up
              $scope.e = '';
              $scope.user = {};
              $ionicLoading.show({ template: 'Password successfully changed. Please login to proceed.', duration: 3000});
              $state.go('login');
            }
            else if(response.data.success == false)
            {
              error = response.data.message;
              $scope.e = error;
            }
          });
        }
        else
          //ionicloading password does not match
          $ionicLoading.show({ template: 'Confirm password does not match the password.', duration: 1500});
      }
      else
        //ionicloading please complete the form
        $ionicLoading.show({ template: 'Please complete the form before submitting.', duration: 1500});
    }
    else
      //ionicloading please fill in the form before proceed
      $ionicLoading.show({ template: 'Please key in your information before proceeding.', duration: 1500});
  }
})
  
.controller('loginCtrl', function($scope, $state, $ionicHistory, Login, $ionicLoading, $localstorage, $ionicPopup) {

  //make next view root
  $ionicHistory.nextViewOptions({
    historyRoot: true
  })

  $scope.user = {};
  $scope.show = false;
  $scope.msg = "";

  $scope.login = function()
  {
    var email = $scope.user.email;
    var password = $scope.user.password;

    if(Object.keys($scope.user).length != 0)
    {
      if(email && password)
      {
         $params = $.param({
            "email": email,
            "password": password
          })

        Login.login($params).then(function(response)
        {
            var res = response.data.success;

            if(res == true)
            {
              $id = response.data.data;
              $localstorage.set('user',$id);
              $scope.user = '';
              $state.go('home');
              $scope.user = {};

              cordova.plugins.diagnostic.isGpsLocationAvailable(function(available){
                if(available == false){

                  var confirmLocation = $ionicPopup.confirm({
                    title: 'Location Service',
                    template: 'Please enable your Location Service and set it to High Accuracy.',
                    okText: 'Enable'
                  });

                  confirmLocation.then(function(res){
                    if(res === true){
                      cordova.plugins.diagnostic.switchToLocationSettings();
                    }else if(res === false){
                      // Cancel button was clicked
                    }
                  })
                }
              }, function(error){
                console.error("The following error occurred: "+error);
              });
              $scope.show = false;
            }
            else if(res == false)
            {
              $scope.msg = response.data.message;
              $scope.show = true;
            }
        });
      }
      else{
        $ionicLoading.show({ template: 'Please enter your email and password to login.', duration: 1500});
      }
    }
    else{
      console.log(($scope.user).length);
      $ionicLoading.show({ template: 'Please enter your email and password to login.', duration: 1500});
    }
  }
})

.controller('homeCtrl', function($scope, $ionicPopup, $ionicHistory, $ionicLoading, $state){

  $scope.logout = function(){

    var confirmPopup = $ionicPopup.confirm({
      title: 'Log Out',
      template: 'Are you sure to log out?',
      okText: 'Yes'
    });

    confirmPopup.then(function(res){
      if(res){
        localStorage.clear();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicLoading.show({ template: 'Successfully logged out.', duration: 1500 });
        $state.go('title');
      }
    });
  }
})

.controller('profileCtrl', function($scope,$window,$state,$ionicModal,$localstorage,Profile,$ionicLoading,EditProfile,$cordovaActionSheet,$cordovaCamera,$cordovaFile,$cordovaFileTransfer,$cordovaDevice,$ionicPopup){

  var id = $localstorage.get('user');

  Profile.getProfile(id).then(function(results){
    $scope.result = results;
  })

  $ionicModal.fromTemplateUrl('templates/editProfile.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalA = modal;
  });

  $scope.editUser = {};
  $scope.image = null; //this one runs

  $scope.showAlert = function(title, msg){
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: msg
    });
  };

  // Present Actionsheet for switch beteen Camera / Library
  $scope.loadImage = function(){
    var options = {
      title: 'Select Image Source',
      buttonLabels: ['Load from Gallery', 'Use Camera'],
      addCancelButtonWithLabel: 'Cancel',
      androidEnableCancelButton : true,
    };

    $cordovaActionSheet.show(options).then(function(btnIndex){
      var type = null;
      if (btnIndex === 1) {
        type = Camera.PictureSourceType.PHOTOLIBRARY;
      } else if (btnIndex === 2) {
        type = Camera.PictureSourceType.CAMERA;
      }
      if (type !== null) {
        $scope.selectPicture(type);
      }
    });
  };

  // Take image with the camera or from library and store it inside the app folder
  $scope.selectPicture = function(sourceType){
    var options = {
      quality: 100,
      targetWidth: 300,
      targetHeight: 300,
      destinationType: Camera.DestinationType.FILE_URI,
      encodingType: Camera.EncodingType.JPEG,
      sourceType: sourceType,
      saveToPhotoAlbum: false, // Image will not be saved to users Library.
      correctOrientation: true
    };
   
    $cordovaCamera.getPicture(options).then(function(imagePath){
      // Grab the file name of the photo in the temporary directory
      var currentName = imagePath.replace(/^.*[\\\/]/, '');
      var newFileName =  id + ".jpg"; //Create a new name for the photo
   
      // If you are trying to load image from the gallery on Android we need special treatment!
      if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY){
        window.FilePath.resolveNativePath(imagePath, function(entry){
          window.resolveLocalFileSystemURL(entry, success, fail);
          function fail(e) {
            console.error('Error: ', e);
          }
   
          function success(fileEntry){
            var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
            // Only copy because of access rights
            $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
              $scope.image = newFileName;
            }, function(error){
              $scope.showAlert('Error', error.exception);
            });
          };
        });
      } else {
        var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        // Move the file to permanent storage
        $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
          $scope.image = newFileName;
        }, function(error){
          $scope.showAlert('Error', error.exception);
        });
      }
    },
    function(err){
      // Not always an error, maybe cancel was pressed...
    })
  };

  // Returns the local path inside the app for an image
  $scope.pathForImage = function(image){
    if (image === null){
      return '';
    } else{
      return cordova.file.dataDirectory + image;
    }
  };

  $scope.uploadImage = function(){

    var url = "http://192.168.43.138/crime2laravel/public/dist/js/upload.php"; // Destination URL
    var targetPath = $scope.pathForImage($scope.image); // File for Upload
    var filename = $scope.image; // File name only
    var asset_img = "http://192.168.43.138/crime2laravel/public/user_img/" + filename;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'filename': filename}
    };
   
    $params = $.param({ "img": asset_img })
    EditProfile.editProfile($params);

    $cordovaFileTransfer.upload(url, targetPath, options).then(function(result){
      $scope.showAlert('Success', 'Image uploaded.');
    });

    $scope.image = null;
    $window.location.reload();
    $state.go('profile', {}, {reload:true});
  }

  $scope.editProfile = function()
  {
    var name = $scope.editUser.name;
    var email = $scope.editUser.email;
    var ic = $scope.editUser.ic;
    var hpnum = $scope.editUser.hpnum;
    var address = $scope.editUser.address;
    var error = '';

    if(name || email || ic || hpnum || address)
    {
      $params = $.param({
        "name": name,
        "email": email,
        "ic": ic,
        "hpnum": hpnum,
        "address": address
      })

      EditProfile.editProfile($params).then(function(response){
        if(response.data.success == true)
          {
            $ionicLoading.show({ template: 'Profile successfully updated.', duration: 1500});
            $scope.modalA.hide();
            $state.reload();
            $scope.editUser = {};
          }
          else
          {
            for(var key in response.data.message)
            {
              console.log(response.data.message[key][0]);
              error += '*' + response.data.message[key][0] + '<br>'
            }
            $scope.e = error;
          }
      });
    }
    else{
      $ionicLoading.show({ template: 'No changes made.', duration: 1500});
      $scope.modalA.hide();
    }
  };
})

.controller('contactCtrl', function($scope, $state, $ionicModal, $localstorage, EmerContact, AddContact, $ionicLoading){

  EmerContact.all().then(function(results){
    
    $scope.max = false;
    $scope.limit = false;
    $scope.contacts = results;
    var length = ($scope.contacts).length;

    if(length == 5){
      $scope.max = true;
      $scope.limit = true;
    }
    else
    {
      $ionicModal.fromTemplateUrl('templates/EmerContact/add_contact.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $scope.contact = {};

      $scope.addContact = function(){
        var name = $scope.contact.name;
        var hpnum = $scope.contact.hpnum;

        if(name && hpnum)
        {
          $params = $.param({
            "name": name,
            "hpnum": hpnum
          })

          AddContact.addcontact($params).then(function(response)
          {
            if(response.data.success == true)
            {
              $ionicLoading.show({ template: 'Emergency contact successfully created.', duration: 1500});
              $scope.modal.hide();
              $state.reload();
            }
            else
            {
              for(var key in response.data.message)
              {
                console.log(response.data.message[key][0]);
                error += '*' + response.data.message[key][0] + '<br>'
              }
              $scope.e = error;
            }
          })
        }
        else
          $ionicLoading.show({ template: 'Please fill in mandatory fields.', duration: 1500});
      }
    }
  });
})

.controller('perContactCtrl', function($scope, $state, oneContact, $ionicPopup, DelContact, $ionicLoading, $ionicModal, EditContact){

  $scope.contact = oneContact;
  var id = $scope.contact.id;
  $scope.editCon = {};

  // Present confirm dialog to delete contact
  $scope.deleteContact = function()
  {
    var confirmDel = $ionicPopup.confirm({
      title: 'Delete Contact',
      template: 'Are you sure to delete this emergency contact ?',
      okText: 'Confirm'
    });

    confirmDel.then(function(res){

      if(res === true){
        DelContact.delcontact(id).then(function(response){
          var success = response.data.success;

          if(success == true){
            $ionicLoading.show({ template: 'Emergency contact deleted successfully.', duration: 1500});
            $state.go('contact');
          } else if(success == false){
            $ionicLoading.show({ template: 'An error occurred.', duration: 1500});
          }
        })
      }else if(res === false){
        // Cancel button was clicked
      }
    });
  };

  $ionicModal.fromTemplateUrl('templates/EmerContact/edit_contact.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.editContact = function()
  {
    var name = $scope.editCon.name;
    var hpnum = $scope.editCon.hpnum;

    if(Object.keys($scope.editCon).length != 0)
    {
      if(name || hpnum)
      {
        $params = $.param({
          "name": name,
          "hpnum": hpnum
        })

        EditContact.editcontact(id,$params).then(function(response){
          if(response.data.success == true)
            {
              $ionicLoading.show({ template: 'Emergency contact profile successfully updated.', duration: 1500});
              $scope.modal.hide();
              $state.go('contact');
              // $state.reload('perContact', {id:id});
            }
            else
            {
              for(var key in response.data.message)
              {
                console.log(response.data.message[key][0]);
                error += '*' + response.data.message[key][0] + '<br>'
              }
              $scope.e = error;
            }
        });
      }
    }
    else
    {
      //ionicloading did not make changes
      $ionicLoading.show({ template: 'You did not make any changes.', duration: 1500});
    }
  };
})

.controller('preventionCtrl', function($scope,Prevention){
  Prevention.all().then(function(results){
    $scope.prevention = results;
  });
})

.controller('perPreventionCtrl', function($scope,$sce,onePrevention,$ionicSlideBoxDelegate){

  $scope.prevention = onePrevention;
  $scope.tips = onePrevention.tip_data;
  $scope.images = onePrevention.tip_images;
  $scope.video = onePrevention.tip_video[0];
  $scope.iframe = {src:$scope.video};
  $scope.trustSrc = function(src){
    return $sce.trustAsResourceUrl(src);
  }

  setTimeout(function(){
    $ionicSlideBoxDelegate.slide(0);
    $ionicSlideBoxDelegate.update();
    $scope.$apply();
  })
})

.controller('newsCtrl', function($scope,News){
  News.all().then(function(results){
    $scope.news = results;
  });
})

.controller('perNewsCtrl', function($scope,oneNews){
  $scope.news = oneNews;
})

.controller('sosCtrl', function($scope,$ionicPopup,$ionicLoading,$cordovaSms,$cordovaGeolocation,$cordovaVibration,$localstorage,EmerContact,Profile){

  cordova.plugins.diagnostic.isGpsLocationAvailable(function(available){
    if(available == false)
    {
      var confirmLocation = $ionicPopup.confirm({
        title: 'Location Service',
        template: 'Please enable your Location Service and set it to High Accuracy.',
        okText: 'Enable'
      });

      confirmLocation.then(function(res){
        if(res === true){
          cordova.plugins.diagnostic.switchToLocationSettings();
        }else if(res === false){
          // Cancel button was clicked
        }
      })
    }
  }, function(error){
    console.error("The following error occurred: "+error);
  });
  
  // Present confirm dialog to sms SOS
  $scope.confirmSMS = function()
  {
    // Vibrate 300ms
    $cordovaVibration.vibrate(300);

    cordova.plugins.diagnostic.isGpsLocationAvailable(function(available){
      
      if(available == true)
      {
        var confirmSms = $ionicPopup.confirm({
          title: 'Send SOS Text Message',
          template: 'Are you sure to send SOS to your emergency contacts ?',
          okText: 'Confirm'
        });

        confirmSms.then(function(res){
          if(res === true){

            // Setup the loader
            $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
            });

            var id = $localstorage.get('user');
            Profile.getProfile(id).then(function(results){
              $scope.result = results;
              var emerText = $scope.result.emerText;

            var posOptions = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation
              .getCurrentPosition(posOptions)
              .then(function(position){
                var lat  = position.coords.latitude
                var long = position.coords.longitude
                console.log(lat,long);

                var openMap = ' My location is '+'http://maps.google.com/maps?f=q&q=('+lat+','+long+')';
                var message = emerText + openMap;

                EmerContact.all().then(function(results){
                  $scope.contacts = results;
                  var length = ($scope.contacts).length;
                  var arr = [];
                  for(var i=0;i<length;i++){
                    //Get all contacts numbers in array
                    arr.push($scope.contacts[i].hpnum);
                  }
                  // var numbers = "'"+arr.join()+"'";

                  var options = {
                    replaceLineBreaks: false, // true to replace \n by a new line, false by default
                    android: {
                      intent: '' // send SMS with the native android SMS messaging
                        //intent: '' // send SMS without open any other app
                        //intent: 'INTENT' // send SMS inside a default SMS app
                    }
                  };
                  
                  $ionicLoading.hide();
                  for(var i=0;i<arr.length;i++){
                    $cordovaSms
                      .send(arr[i], message, options)
                      .then(function(){
                        // Success! SMS was sent
                        $ionicLoading.show({ template: 'You have successfully sent SOS.', duration: 1500});
                      }, function(error){
                        // An error occurred
                        $ionicLoading.show({ template: 'Your SOS does not send out successfully.', duration: 1500});
                        console.log("The following error occurred: "+error);
                      });
                  }
                })
              }, function(error) {
                // error
                $ionicLoading.hide();
                var showAlert = $ionicPopup.alert({
                  title: 'Error',
                  template: 'Error occurred while accessing your location. Please try again.'
                });

                showAlert.then(function(res){
                  console.log("The following error occurred: "+error);
                });
              });
            }, function(error){
              $ionicLoading.hide();
              console.log("The following error occurred: "+error);
            })

          }else if (res === false){
            //Cancel button was clicked
          }
        }); //end confirmSms
      } //end if(available == true)
      else if(available == false)
      {
        var confirmLocation = $ionicPopup.confirm({
          title: 'Location Service',
          template: 'Please enable your Location Service and set it to High Accuracy.',
          okText: 'Enable'
        });

        confirmLocation.then(function(res){
          if(res === true)
          {
            cordova.plugins.diagnostic.switchToLocationSettings();

            var confirmSms = $ionicPopup.confirm({
              title: 'Send SOS Text Message',
              template: 'Are you sure to send SOS to your emergency contacts ?',
              okText: 'Confirm'
            });

            confirmSms.then(function(res){
              if(res === true){

                // Setup the loader
                $ionicLoading.show({
                  content: 'Loading',
                  animation: 'fade-in',
                  showBackdrop: true,
                  maxWidth: 200,
                  showDelay: 0
                });

                var id = $localstorage.get('user');
                Profile.getProfile(id).then(function(results){
                  $scope.result = results;
                  var emerText = $scope.result.emerText;

                var posOptions = {timeout: 10000, enableHighAccuracy: true};
                $cordovaGeolocation
                  .getCurrentPosition(posOptions)
                  .then(function(position){
                    var lat  = position.coords.latitude
                    var long = position.coords.longitude
                    console.log(lat,long);

                    var openMap = ' My location is '+'http://maps.google.com/maps?f=q&q=('+lat+','+long+')';
                    var message = emerText + openMap;

                    EmerContact.all().then(function(results){
                      $scope.contacts = results;
                      var length = ($scope.contacts).length;
                      var arr = [];
                      for(var i=0;i<length;i++){
                        //Get all contacts numbers in array
                        arr.push($scope.contacts[i].hpnum);
                      }

                      var options = {
                        replaceLineBreaks: false, // true to replace \n by a new line, false by default
                        android: {
                          intent: '' // send SMS with the native android SMS messaging
                            //intent: '' // send SMS without open any other app
                            //intent: 'INTENT' // send SMS inside a default SMS app
                        }
                      };
                      
                      $ionicLoading.hide();
                      for(var i=0;i<arr.length;i++){
                        $cordovaSms
                          .send(arr[i], message, options)
                          .then(function(){
                            // Success! SMS was sent
                            $ionicLoading.show({ template: 'You have successfully sent SOS.', duration: 1500});
                          }, function(error){
                            // An error occurred
                            $ionicLoading.show({ template: 'Your SOS does not send out successfully.', duration: 1500});
                            console.log("The following error occurred: "+error);
                          });
                      }
                    })
                  }, function(error){
                    // error
                    $ionicLoading.hide();
                    var showAlert = $ionicPopup.alert({
                      title: 'Error',
                      template: 'Error occurred while accessing your location. Please try again.'
                    });

                    showAlert.then(function(res){
                      console.log("The following error occurred: "+error);
                    });
                  });
                }, function(error){
                  $ionicLoading.hide();
                  console.log("The following error occurred: "+error);
                })

              }else if (res === false){
                // Cancel button was clicked
              }
            });//end confirmSms
          }else if(res === false){
            $ionicLoading.show({ template: 'You should enable Location Service to proceed.', duration: 1500});
          }
        })// end confirmLocation
      }//end if(available == false)
    }, function(error){
      console.error("The following error occurred: "+error);
    })
  }
})

// .controller('sosCtrl', function($scope,$ionicPopup,$ionicLoading,$cordovaSms,$cordovaGeolocation,$cordovaVibration,$localstorage,EmerContact,Profile){

//   cordova.plugins.diagnostic.isGpsLocationAvailable(function(available){
//     if(available == false)
//     {
//       var confirmLocation = $ionicPopup.confirm({
//         title: 'Location Service',
//         template: 'Please enable your Location Service and set it to High Accuracy.',
//         okText: 'Enable'
//       });

//       confirmLocation.then(function(res){
//         if(res === true){
//           cordova.plugins.diagnostic.switchToLocationSettings();
//         }else if(res === false){
//           // Cancel button was clicked
//         }
//       })
//     }
//   }, function(error){
//     console.error("The following error occurred: "+error);
//   });
  
//   // Present confirm dialog to sms SOS
//   $scope.confirmSMS = function(){
    
//     // Vibrate 300ms
//     $cordovaVibration.vibrate(300);

//     var confirmSms = $ionicPopup.confirm({
//       title: 'Send SOS Text Message',
//       template: 'Are you sure to send SOS to your emergency contacts ?',
//       okText: 'Confirm'
//     });

//     confirmSms.then(function(res){
//       if(res === true){

//         // Setup the loader
//         $ionicLoading.show({
//           content: 'Loading',
//           animation: 'fade-in',
//           showBackdrop: true,
//           maxWidth: 200,
//           showDelay: 0
//         });

//         var id = $localstorage.get('user');
//         Profile.getProfile(id).then(function(results){
//           $scope.result = results;
//           var emerText = $scope.result.emerText;

//         var posOptions = {timeout: 10000, enableHighAccuracy: true};
//         $cordovaGeolocation
//           .getCurrentPosition(posOptions)
//           .then(function(position){
//             var lat  = position.coords.latitude
//             var long = position.coords.longitude
//             console.log(lat,long);

//             var openMap = ' My location is '+'http://maps.google.com/maps?f=q&q=('+lat+','+long+')';
//             var message = emerText + openMap;

//             EmerContact.all().then(function(results){
//               $scope.contacts = results;
//               var length = ($scope.contacts).length;
//               var arr = [];
//               for(var i=0;i<length;i++){
//                 //Get all contacts numbers in array
//                 arr.push($scope.contacts[i].hpnum);
//               }

//               var options = {
//                 replaceLineBreaks: false, // true to replace \n by a new line, false by default
//                 android: {
//                   intent: '' // send SMS with the native android SMS messaging
//                     //intent: '' // send SMS without open any other app
//                     //intent: 'INTENT' // send SMS inside a default SMS app
//                 }
//               };
              
//               $ionicLoading.hide();
//               for(var i=0;i<arr.length;i++){
//                 $cordovaSms
//                   .send(arr[i], message, options)
//                   .then(function(){
//                     // Success! SMS was sent
//                     $ionicLoading.show({ template: 'You have successfully sent SOS.', duration: 1500});
//                   }, function(error){
//                     // An error occurred
//                     $ionicLoading.show({ template: 'Your SOS does not send out successfully.', duration: 1500});
//                     console.log("The following error occurred: "+error);
//                   });
//               }
//             })
//           }, function(error){
//             // error
//             $ionicLoading.hide();
//             var showAlert = $ionicPopup.alert({
//               title: 'Error',
//               template: 'Error occurred while accessing your location. Please try again.'
//             });

//             showAlert.then(function(res){
//               console.log("The following error occurred: "+error);
//             });
//           });
//         }, function(error){
//           $ionicLoading.hide();
//           console.log("The following error occurred: "+error);
//         })

//       }else if (res === false){
//         // Cancel button was clicked
//       }
//     });//end confirmSms
//   }, function(error){
//     console.error("The following error occurred: "+error);
//   }
// })

.controller('latestMapCtrl', function ($scope,$state,$filter,$ionicLoading,Mapping) {

  Mapping.all().then(function(results){
    var reports = [];
    var icon = '';

    var now = new Date();
    now.setMonth(now.getMonth() - 3);
    for(var k = 0; k < results.length; k++){
      var date = new Date(results[k].date);
      if(date > now){
        reports.push(results[k]);
      }
    }

    $scope.initialise = function(){

      var map = new google.maps.Map(document.getElementById("map"), {
        center : new google.maps.LatLng(2.5000,108.0000),
        zoom : 5,
        mapTypeId : google.maps.MapTypeId.ROADMAP
      });

      $scope.map = map;

      var geocoder = new google.maps.Geocoder();

      $scope.codeAddress = function(){
        var address = document.getElementById('address').value;
        geocoder.geocode({'address':address}, function(results,status){
          if(status == google.maps.GeocoderStatus.OK){
            $scope.map.setZoom(15);
            $scope.map.setCenter(results[0].geometry.location);
          }
          else
            alert('Geocode failed due to:' + status);
        });
      };

      // Additional Markers //
      $scope.markers = [];
      var infoWindow = new google.maps.InfoWindow({ maxWidth : 180 });

      var createMarker = function(info){

        if(info.category == 'Authority'){
          icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00FF00';
          info.date = $filter('date')(info.date, "dd-MM-yyyy");
        }else if(info.category == 'Valid'){
          icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|0000FF';
          info.date = new Date(info.date).toISOString();
          info.date = $filter('date')(info.date, 'dd-MM-yyyy hh:mm a');
        }else if(info.category == 'Invalid'){
          icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00';
          info.date = new Date(info.date).toISOString();
          info.date = $filter('date')(info.date, 'dd-MM-yyyy hh:mm a');
        }

        var marker = new google.maps.Marker({
          position : new google.maps.LatLng(info.lat, info.long),
          map : $scope.map,
          animation : google.maps.Animation.DROP,
          title : info.route,
          icon : icon
        });

        marker.content = '<div class="infowindowB">'+info.city+', '+info.state+', '+info.postcode+'<br>Date: '+info.date+'<br>Type: '+info.type+'</div>';

        google.maps.event.addListener(marker, 'click', function(){
          infoWindow.setContent('<div class="infowindowH">'+marker.title+'</div>'+marker.content);
          infoWindow.open($scope.map, marker);
        });
        $scope.markers.push(marker);
      }
      console.log(reports.length);
      for(var i = 0; i < reports.length; i++){
        createMarker(reports[i]); 
      }

      var legend = document.getElementById('legend');
      $scope.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
    }
    google.maps.event.addDomListener(document.getElementById("map"), 'load', $scope.initialise());
  })
})

.controller('allMapCtrl', function ($scope,$state,$filter,$ionicLoading,Mapping) {

  Mapping.all().then(function(results){
    var reports = results;
    var icon = '';

    $scope.initialise = function(){

      var map = new google.maps.Map(document.getElementById("map"), {
        center : new google.maps.LatLng(2.5000,108.0000),
        zoom : 5,
        mapTypeId : google.maps.MapTypeId.ROADMAP
      });

      $scope.map = map;

      var geocoder = new google.maps.Geocoder();

      $scope.codeAddress = function(){
        var address = document.getElementById('address').value;
        geocoder.geocode({'address':address}, function(results,status){
          if(status == google.maps.GeocoderStatus.OK){
            $scope.map.setZoom(15);
            $scope.map.setCenter(results[0].geometry.location);
          }
          else
            alert('Geocode failed due to:' + status);
        });
      };

      // Additional Markers //
      $scope.markers = [];
      var infoWindow = new google.maps.InfoWindow({ maxWidth : 180 });

      var createMarker = function(info){

        if(info.category == 'Authority'){
          icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00FF00';
          info.date = $filter('date')(info.date, "dd-MM-yyyy");
        }else if(info.category == 'Valid'){
          icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|0000FF';
          info.date = new Date(info.date).toISOString();
          info.date = $filter('date')(info.date, 'dd-MM-yyyy hh:mm a');
        }else if(info.category == 'Invalid'){
          icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00';
          info.date = new Date(info.date).toISOString();
          info.date = $filter('date')(info.date, 'dd-MM-yyyy hh:mm a');
        }

        var marker = new google.maps.Marker({
          position : new google.maps.LatLng(info.lat, info.long),
          map : $scope.map,
          animation : google.maps.Animation.DROP,
          title : info.route,
          icon : icon
        });

        marker.content = '<div class="infowindowB">'+info.city+', '+info.state+', '+info.postcode+'<br>Date: '+info.date+'<br>Type: '+info.type+'</div>';

        google.maps.event.addListener(marker, 'click', function(){
          infoWindow.setContent('<div class="infowindowH">'+marker.title+'</div>'+marker.content);
          infoWindow.open($scope.map, marker);
        });
        $scope.markers.push(marker);
      }
      console.log(reports.length);
      for(var i = 0; i < reports.length; i++){
        createMarker(reports[i]); 
      }

      var legend = document.getElementById('legend');
      $scope.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
    }
    google.maps.event.addDomListener(document.getElementById("map"), 'load', $scope.initialise());
  })
})

.controller('witnessCtrl', function ($state,$scope,$filter,$ionicPopup,Witness,$localstorage,$ionicLoading,$window,$cordovaCamera,$cordovaFile,$cordovaFileTransfer){

  var id = $localstorage.get('user');
  $scope.witness = {};
  $scope.witness.postcode = null;
  var datetime = '';
  $scope.image = null;

  $scope.dateTime = function(){
    datetime = $filter('date')($scope.witness.date, "yyyy-MM-dd HH:mm");
    $scope.witness.date = new Date(datetime);
  };

  cordova.plugins.diagnostic.isGpsLocationAvailable(function(available){
    if(available == false)
    {
      var confirmLocation = $ionicPopup.confirm({
        title: 'Location Service',
        template: 'Please enable your Location Service and set it to High Accuracy.',
        okText: 'Enable'
      });

      confirmLocation.then(function(res){
        if(res === true){
          cordova.plugins.diagnostic.switchToLocationSettings();
        }else if(res === false){
          // Cancel button was clicked
        }
      })
    }
  }, function(error){
    console.error("The following error occurred: "+error);
  });

  // Take image with the camera or from library and store it inside the app folder
  $scope.selectPicture = function(){
    var options = {
      quality: 80,
      targetWidth: 300,
      targetHeight: 300,
      destinationType: Camera.DestinationType.FILE_URI,
      encodingType: Camera.EncodingType.JPEG,
      sourceType: Camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false, // Image will not be saved to users Library.
      correctOrientation: true
    };
   
    $cordovaCamera.getPicture(options).then(function(imagePath){
      // Grab the file name of the photo in the temporary directory
      var currentName = imagePath.replace(/^.*[\\\/]/, '');
      var d = new Date(),
      n = d.getTime(),
      newFileName =  id + "_" + n + ".jpg"; //Create a new name for the photo
      $scope.witness.img = "http://192.168.43.138/crime2laravel/public/image/witness/" + newFileName;

      var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      // Move the file to permanent storage
      $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
        $scope.image = newFileName;
      }, function(error){
        $ionicLoading.show({ template: 'Error: ' + error.exception, duration: 1500});
      });
    },
    function(err){
      // Not always an error, maybe cancel was pressed...
    })
  };

  // Returns the local path inside the app for an image
  $scope.pathForImage = function(image){
    if (image === null)
      return '';
    else
      return cordova.file.dataDirectory + image;
  };

  $scope.getLocation = function(){

    cordova.plugins.diagnostic.isGpsLocationAvailable(function(available){
      if(available == false)
      {
        var confirmLocation = $ionicPopup.confirm({
          title: 'Location Service',
          template: 'Please enable your Location Service and set it to High Accuracy.',
          okText: 'Enable'
        });

        confirmLocation.then(function(res){
          if(res === true){
            cordova.plugins.diagnostic.switchToLocationSettings();

            cordova.plugins.diagnostic.isGpsLocationAvailable(function(available){
              if(available == true){

                // Setup the loader
                $ionicLoading.show({
                  content: 'Loading',
                  animation: 'fade-in',
                  showBackdrop: true,
                  maxWidth: 200,
                  showDelay: 0
                });

                $window.navigator.geolocation.getCurrentPosition(function(position){
                  $scope.$apply(function(){
                    $scope.witness.lat = position.coords.latitude;
                    $scope.witness.lng = position.coords.longitude;
                    var latlng = new google.maps.LatLng($scope.witness.lat, $scope.witness.lng);
                    geocoder = new google.maps.Geocoder();
                    geocoder.geocode({'latLng': latlng}, function(results, status){
                      if(status == google.maps.GeocoderStatus.OK){
                        if(results[0]){
                          for(var i = 0; i < results[0].address_components.length; i++){
                            var component = results[0].address_components[i];
                            switch(component.types[0]){
                              case 'route':
                                var route = component.long_name;
                                break;
                              case 'locality':
                                var city = component.long_name;
                                break;
                              case 'administrative_area_level_1':
                                var state = component.long_name;
                                break;
                              case 'postal_code':
                                var postcode = component.long_name;
                                break;
                            }
                          }
                          $scope.witness.route = route;
                          $scope.witness.city = city;
                          $scope.witness.state = state;
                          $scope.witness.postcode = postcode;
                          $ionicLoading.hide();
                        }
                        else { $ionicLoading.show({ template: 'No reverse geocode results.', duration: 1500}); }
                      }
                      else { $ionicLoading.show({ template: 'Geocoder failed: ' + status, duration: 1500}); }
                    })
                  })
                },function(){ $ionicLoading.show({ template: 'Geolocation unavailable.', duration: 1500}); });
              }
            })
          }else if(res === false)
            $ionicLoading.show({ template: 'Turn on Location Service for geocode service.', duration: 1500});
        })
      }else if(available == true){

        // Setup the loader
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        $window.navigator.geolocation.getCurrentPosition(function(position){
          $scope.$apply(function(){
            $scope.witness.lat = position.coords.latitude;
            $scope.witness.lng = position.coords.longitude;
            var latlng = new google.maps.LatLng($scope.witness.lat, $scope.witness.lng);
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': latlng}, function(results, status){
              if(status == google.maps.GeocoderStatus.OK){
                if(results[0]){
                  for(var i = 0; i < results[0].address_components.length; i++){
                    var component = results[0].address_components[i];
                    switch(component.types[0]){
                      case 'route':
                        var route = component.long_name;
                        break;
                      case 'locality':
                        var city = component.long_name;
                        break;
                      case 'administrative_area_level_1':
                        var state = component.long_name;
                        break;
                      case 'postal_code':
                        var postcode = component.long_name;
                        break;
                    }
                  }
                  $scope.witness.route = route;
                  $scope.witness.city = city;
                  $scope.witness.state = state;
                  $scope.witness.postcode = postcode;
                  $ionicLoading.hide();
                }
                else { $ionicLoading.show({ template: 'No reverse geocode results.', duration: 1500}); }
              }
              else { $ionicLoading.show({ template: 'Geocoder failed: ' + status, duration: 1500}); }
            })
          })
        },function(){ $ionicLoading.show({ template: 'Geolocation unavailable.', duration: 1500}); });
      }
    }, function(error){
      console.error("The following error occurred: "+error);
    });
  };

  $scope.addWitness = function()
  {
    if($scope.image != null)
    {
      var url = "http://192.168.43.138/crime2laravel/public/dist/js/witness.php"; // Destination URL
      var targetPath = $scope.pathForImage($scope.image); // File for Upload
      var filename = $scope.image; // File name only

      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'filename': filename}
      };

      $cordovaFileTransfer.upload(url, targetPath, options).then(function(result){
        $ionicLoading.show({ template: 'Image successfully uploaded.', duration: 1500});
      });
    }

    var wdate = datetime;
    var wlat = $scope.witness.lat;
    var wlng = $scope.witness.lng;
    var wcity = $scope.witness.city;
    var wstate = $scope.witness.state;
    var wpostcode = $scope.witness.postcode;
    var wdesc = $scope.witness.desc;
    var wtype = $scope.witness.type;
    var wimg = $scope.witness.img;
    var error = '';

    if(Object.keys($scope.witness).length != 0)
    {
      if(wdate && wcity && wstate && wtype)
      {
        $params = $.param({
          "dateTime": wdate,
          "state": wstate,
          "city": wcity,
          "postcode": wpostcode,
          "latitude": wlat,
          "longitude": wlng,
          "desc": wdesc,
          "type": wtype,
          "img": wimg
        })

        Witness.addwitness($params).then(function(response){
          if(response.data.success == true)
            {
              $ionicLoading.show({ template: 'Incident successfully added.', duration: 1500});
              $state.reload();
              $scope.witness = {};
            }
            else
            {
              for(var key in response.data.message)
              {
                console.log(response.data.message[key][0]);
                error += '*' + response.data.message[key][0] + '<br>'
              }
              $scope.e = error;
            }
        });
      } else
        $ionicLoading.show({ template: 'Please fill in the mandatory fields.', duration: 1500});
    }else
      $ionicLoading.show({ template: 'Please complete the form before submitting.', duration: 1500});
  };
})

.controller('perReminderCtrl', function($scope,$state,$filter,oneReminder,$ionicPopup,$ionicLoading,Reminder,$cordovaSms){

  $scope.reminder = oneReminder;
  var id = $scope.reminder.id;
  var datetime = '';

  $scope.dateTime = function(){
    datetime = $filter('date')($scope.editreminder.date, "yyyy-MM-dd HH:mm");
    $scope.editreminder.date = new Date(datetime);
  };

  // Present confirm dialog to delete reminder
  $scope.deleteReminder = function()
  {
    var confirmDel = $ionicPopup.confirm({
      title: 'Delete Reminder',
      template: 'Are you sure to delete this reminder?',
      okText: 'Confirm'
    });

    confirmDel.then(function(res){
      if(res === true){
        cordova.plugins.notification.local.cancel(id,function(){
          // Scheduled notification is cancelled
        });
        Reminder.delreminder(id).then(function(response){
          var success = response.data.success;
          if(success == true){
            $ionicLoading.show({ template: 'Reminder deleted successfully.', duration: 1500});
            $state.go('reminder');
          } else if(success == false){
            $ionicLoading.show({ template: 'An error occurred.', duration: 1500});
          }
        })
      }else if(res === false){
        // Cancel button was clicked
      }
    });
  };
})

.controller('reminderCtrl', function($state,$scope,$filter,$ionicPopup,$localstorage,$ionicLoading,$ionicModal,EmerContact,$cordovaSms,Reminder,$cordovaLocalNotification){
  
  Reminder.all().then(function(results){
    $scope.reminders = results;

    $ionicModal.fromTemplateUrl('templates/Reminder/addReminder.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    var id = $scope.reminders.userID;
    $scope.addreminder = {};
    $scope.hpnum = {};
    var datetime = '';

    $scope.dateTime = function(){
      datetime = $filter('date')($scope.addreminder.date, "yyyy-MM-dd HH:mm");
      $scope.addreminder.date = new Date(datetime);
    };

    EmerContact.all().then(function(results){
      $scope.contacts = results;
    });

    $scope.addReminder = function(){
      
      var array = [];
      for(i in $scope.hpnum){
        if($scope.hpnum[i]==true)
          array.push(i);
      }

      for(var i=0;i<array.length;i++){

        var message1 = 'This is a reminder. Message: ' + $scope.addreminder.desc + '. Scheduled time: ' + datetime;
        var options = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
            intent: ''
          }
        };

        $cordovaSms
          .send(array[i],message1,options)
          .then(function(){
            // SMS succeed
          }, function(error){
            // SMS failed
            console.log("Error : "+error); 
          });

        var rdate = datetime;
        var rdesc = $scope.addreminder.desc;
        var rrecv = array[i];
        var rnow = +true;
        var error = '';

        if(rdate && rdesc && rrecv){
          $params = $.param({
            "userID": id,
            "reminderDT": datetime,
            "receiver": rrecv,
            "message": rdesc,
            "now": rnow
          })

          Reminder.addreminder($params).then(function(response){
            if(response.data.success == true){
              var rid = response.data.data.id;
              var rdt = new Date(response.data.data.reminderDT);
              var message = response.data.data.message;

              $cordovaLocalNotification.schedule({
                id: rid,
                at: rdt,
                title: 'CAS',
                text: "CAS Reminder. Message : " + message + ".",
              }).then(function(result){
                // notification is scheduled
              });

              cordova.plugins.notification.local.on("trigger",function(notification){
                if(notification.id == rid){
                  Reminder.delreminder(rid).then(function(response){
                    $state.reload();//Reminder will be deleted from database
                  })
                }
              });

              $ionicLoading.show({ template: 'Reminder successfully created.', duration: 1500});
              $scope.modal.hide();
              $state.reload();
            }
            else{
              for(var key in response.data.message)
              {
                console.log(response.data.message[key][0]);
                error += '*' + response.data.message[key][0] + '<br>'
              }
              $scope.e = error;
            }
          })
        }
        else
          $ionicLoading.show({ template: 'Please fill in mandatory fields.', duration: 1500});
      }
    };
  })
})