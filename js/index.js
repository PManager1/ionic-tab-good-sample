angular.module('ionicApp', ['ionic', 'ionicApp.controllers', 'ionicApp.services'])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.tab', {
        url: '/tab',
        abstract: true,
        views: {
            'menu-content': {
                templateUrl: 'templates/tabs.html'
            },
            'menu-left': {
                templateUrl: 'templates/menu-auth.html',
                controller: 'MenuCtrl'
            }
        }
    })

    .state('app.journal', {
        url: '/journal/:journal',
        views: {
            'menu-content': {
                templateUrl: 'templates/tab-feed.html',
                controller: 'JournalCtrl'
            },
            'menu-left': {
                templateUrl: 'templates/menu-anon.html'
            }
        }
    })

    .state('app.journal-post', {
        url: '/journal/:journal/:postId',
        views: {
            'menu-content': {
                templateUrl: 'templates/view-post.html',
                controller: 'PostCtrl'
            }
        }
    })

    .state('app.tab.journal', {
        url: '/journal/:journal',
        views: {
            'tab-journal': {
                templateUrl: 'templates/tab-feed.html',
                controller: 'JournalCtrl'
            }
        }
    })

    .state('app.tab.journal-post', {
        url: '/journal/:journal/:postId',
        views: {
            'tab-journal': {
                templateUrl: 'templates/view-post.html',
                controller: 'PostCtrl'
            }
        }
    })

    .state('app.tab.friends', {
        url: '/friends/posts',
        views: {
            'tab-friends': {
                templateUrl: 'templates/tab-feed.html',
                controller: 'FriendsCtrl'
            }
        }
    })

    .state('app.tab.friends-post', {
        url: '/friends/posts/:postId',
        views: {
            'tab-friends': {
                templateUrl: 'templates/view-post.html',
                controller: 'PostCtrl'
            }
        }
    })

    .state('app.tab.favourites', {
        url: '/favourites',
        views: {
            'tab-favourites': {
                templateUrl: 'templates/tab-favourites.html',
                controller: 'FavouritesCtrl'
            }
        }
    })

    .state('app.tab.messages', {
        url: '/messages',
        views: {
            'tab-messages': {
                templateUrl: 'messages/tab-messages.html',
                controller: 'MessagesCtrl'
            }
        }
    })

    .state('app.tab.messages.all', {
        url: '/all',
        views: {
            'tab-messages-all': {
                templateUrl: 'messages/tab-message-list.html',
                controller: 'MessageListCtrl'
            }
        },
        resolve: {
            mode: function() {
                return 'all';
            }
        }
    })

    .state('app.tab.messages.all-view', {
        url: '/all/:id',
        views: {
            'tab-messages-all': {
                templateUrl: 'messages/view-message.html',
                controller: 'MessageViewCtrl'
            }
        },
        resolve: {
            mode: function() {
                return 'all';
            }
        }
    })

    .state('app.tab.messages.sent', {
        url: '/sent',
        views: {
            'tab-messages-sent': {
                templateUrl: 'messages/tab-message-list.html',
                controller: 'MessageListCtrl'
            }
        },
        resolve: {
            mode: function() {
                return 'sent';
            }
        }
    })

    .state('app.tab.messages.sent-view', {
        url: '/sent/:id',
        views: {
            'tab-messages-sent': {
                templateUrl: 'messages/view-message.html',
                controller: 'MessageViewCtrl'
            }
        },
        resolve: {
            mode: function() {
                return 'sent';
            }
        }
    })

    .state('app.tab.messages.flagged', {
        url: '/flagged',
        views: {
            'tab-messages-flagged': {
                templateUrl: 'messages/tab-message-list.html',
                controller: 'MessageListCtrl'
            }
        },
        resolve: {
            mode: function() {
                return 'flagged';
            }
        }
    })

    .state('app.tab.messages.flagged-view', {
        url: '/flagged/:id',
        views: {
            'tab-messages-flagged': {
                templateUrl: 'messages/view-message.html',
                controller: 'MessageViewCtrl'
            }
        },
        resolve: {
            mode: function() {
                return 'flagged';
            }
        }
    });

    $urlRouterProvider.otherwise(function($injector, $location) {
        var path = '/app/journal/';
        var cs = $injector.get('ConfSrvc');
        var as = $injector.get('AuthSrvc');
        if (as.logged_in) {
            path = '/app/tab/journal/';
        }
        $location.path(path + cs.current);
    });

});

angular.module('ionicApp.controllers', [])

.controller('AppCtrl', function($scope, UserSrvc, AuthSrvc, ConfSrvc) {
    $scope.placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    $scope.bookmarks = [];
    UserSrvc.GetUsers(5).then(function(items) {
        $scope.bookmarks = items;
    });
    $scope.friends = [];
    UserSrvc.GetUsers(7).then(function(items) {
        $scope.friends = items;
    });
    $scope.groups = [];
    UserSrvc.GetUsers(3).then(function(items) {
        $scope.groups = items;
    });
    $scope.auth = AuthSrvc;
    $scope.conf = ConfSrvc;
})

.controller('MenuCtrl', function($scope) {
    $scope.main = {
        show_list: 'bookmarks'
    };
})

.controller('JournalCtrl', function($scope, $stateParams, UserSrvc) {
    $scope.journal = $stateParams.journal;
    $scope.title = 'Journal - ' + $scope.journal;
    $scope.mode = 'journal';
    $scope.posts = [];
    UserSrvc.GetUsers(20).then(function(items) {
        $scope.posts = items;
    });
    $scope.doRefresh = function() {
        UserSrvc.GetUsers(1).then(function(items) {
            $scope.posts = items.concat($scope.posts);
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.loadMore = function() {
        UserSrvc.GetUsers(10).then(function(items) {
            $scope.posts = $scope.posts.concat(items);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
})

.controller('FriendsCtrl', function($scope, UserSrvc) {
    $scope.journal = 'posts';
    $scope.title = 'Friends';
    $scope.mode = 'friends';
    $scope.posts = [];
    UserSrvc.GetUsers(20).then(function(items) {
        $scope.posts = items;
    });
})

.controller('PostCtrl', function($scope, $stateParams, UserSrvc) {
    $scope.post = {};
    UserSrvc.GetUsers(1).then(function(items) {
        $scope.post = items[0];
    });
    //$scope.post = JournalSrvc.get($stateParams.postId);
})

.controller('FavouritesCtrl', function($scope) {

})

.controller('MessagesCtrl', function($scope) {

})

.controller('MessageListCtrl', function(mode, $rootScope, $rootScope, $scope, EmailService) {

    $scope.emails = [];

    $scope.data = {
        showDelete: false,
        mode: mode,
        title: ''
    };

    $scope.setListData = function() {
        switch (mode) {
            case 'all':
                $scope.data.title = 'All';
                $scope.emails = EmailService.getInboxEmails();
                break;
            case 'flagged':
                $scope.data.title = 'Flagged';
                $scope.emails = EmailService.getInboxEmails();
                break;
            case 'sent':
                $scope.data.title = 'Sent';
                $scope.emails = EmailService.getOutboxEmails();
                break;
            default:
                $scope.data.title = 'E-Mails';
        }
    };

    $scope.setListData();

    $scope.onEmailFlag = function(email, e) {
        email.flagged = !email.flagged;
        e.preventDefault();
        $rootScope.emailCounts.flaggedCount = EmailService.getFlaggedEmailCount();
    };

    $scope.onEmailDelete = function(email) {
        $scope.emails.splice($scope.emails.indexOf(email), 1);
    };
})

.controller('MessageViewCtrl', function(mode, $stateParams, $scope, $timeout, EmailService) {
    if (mode == 'sent') {
        $scope.email = EmailService.getOutboxEmail($stateParams.id);
    } else {
        $scope.email = EmailService.getInboxEmail($stateParams.id);
    }
    $timeout(function() {
        $scope.email.was_read = true;
    }, 500);
});

angular.module('ionicApp.services', [])

.factory('UserSrvc', function($http) {
    var BASE_URL = 'http://api.randomuser.me/';
    var items = [];

    return {
        GetUsers: function(count) {
            return $http.get(BASE_URL + '?results=' + count).then(function(response) {
                items = response.data.results;
                return items;
            });
        }
    };
})

.service('ConfSrvc', function() {
    this.current = 'muahaha';
})

.service('AuthSrvc', function() {
    this.logged_in = true;
})

.directive('navClear', [
    '$ionicViewService',
    '$state',
    '$location',
    '$window',
    '$rootScope',
    function($ionicHistory, $location, $state, $window, $rootScope) {
        $rootScope.$on('$stateChangeError', function() {
            $ionicHistory.nextViewOptions(null);
        });
        return {
            priority: 100,
            restrict: 'AC',
            compile: function($element) {
                return {
                    pre: prelink
                };

                function prelink($scope, $element, $attrs) {
                    var unregisterListener;

                    function listenForStateChange() {
                        unregisterListener = $scope.$on('$stateChangeStart', function() {
                            $ionicHistory.nextViewOptions({
                                disableAnimate: true,
                                disableBack: true
                            });
                            unregisterListener();
                        });
                        $window.setTimeout(unregisterListener, 300);
                    }

                    $element.on('click', listenForStateChange);
                }
            }
        };
    }
])

.directive('actualSrc', function() {
    return {
        link: function postLink(scope, element, attrs) {
            attrs.$observe('actualSrc', function(newVal, oldVal) {
                if (newVal !== undefined) {
                    var img = new Image();
                    img.src = attrs.actualSrc;
                    angular.element(img).bind('load', function() {
                        element.attr("src", attrs.actualSrc);
                    });
                }
            });
        }
    };
})

.factory('EmailService', function($filter) {
    var inbox = [];
    var outbox = [];

    var data = {
        flagged: 0
    };

    function readInboxEmails() {
        if (inbox.length) {
            return;
        }
        inbox = [{
            id: 0,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 1,
            subject: 'Test subj #2',
            date: '0',
            from: 'John',
            body: 'Test e-mail body #2',
            was_read: false
        }, {
            id: 2,
            subject: 'Test subj #3',
            date: '0',
            from: 'dd John Doe',
            body: 'Test e-mail body #3',
            was_read: false
        }, {
            id: 3,
            subject: 'Test subj #4',
            date: '0',
            from: 'Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 4,
            subject: 'Test subj #1',
            date: '0',
            from: 'John',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 5,
            subject: 'dfhdsfhsdfhsdf',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 6,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 7,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false,
            flagged: true
        }, {
            id: 8,
            subject: 'dhfsdf dfhdasfhsdf',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false,
            flagged: true
        }, {
            id: 9,
            subject: 'Test subj #11',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false,
            flagged: true
        }, {
            id: 10,
            subject: 'Test subj #21',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 11,
            subject: 'Test subj #31',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 12,
            subject: 'Test subj #41',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 13,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 14,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 15,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 16,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 17,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 18,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 19,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 20,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 21,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 22,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 23,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 24,
            subject: 'Test subj #1',
            date: '1',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 25,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 26,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 27,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 28,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 29,
            subject: 'dfhsdfhsdf dfshsd',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 30,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 31,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 32,
            subject: 'Test subj #1',
            date: '0',
            from: 'ooo Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 33,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 34,
            subject: 'Test subj #1',
            date: '1',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 35,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 36,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 37,
            subject: 'Test subj #1',
            date: '1',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 38,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 39,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 40,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 41,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 42,
            subject: 'Test subj #1',
            date: '0',
            from: 'ooo Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 43,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 44,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 45,
            subject: 'Test subj #1',
            date: '0',
            from: 'aaa Doe',
            body: 'Test e-mail body #1',
            was_read: false
        }, {
            id: 46,
            subject: 'dfghsdfh fdhgs dfh',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: true
        }, {
            id: 47,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: true
        }, {
            id: 48,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: true
        }, {
            id: 49,
            subject: 'Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: true
        }, {
            id: 50,
            subject: 'Test subj last',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: true
        }];
    };

    function readOutboxEmails() {
        if (outbox.length) {
            return;
        }
        outbox = [{
            id: 0,
            subject: 'Out - Test subj #1',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: true
        }, {
            id: 1,
            subject: 'Out - Test subj #2',
            date: '0',
            from: 'John',
            body: 'Test e-mail body #2',
            was_read: true
        }, {
            id: 2,
            subject: 'Out - Test subj #3',
            date: '0',
            from: 'dd John Doe',
            body: 'Test e-mail body #3',
            was_read: true
        }, {
            id: 3,
            subject: 'Out - Test subj #4',
            date: '0',
            from: 'Doe',
            body: 'Test e-mail body #1',
            was_read: true
        }, {
            id: 4,
            subject: 'Out - Test subj #1',
            date: '0',
            from: 'John',
            body: 'Test e-mail body #1',
            was_read: true
        }, {
            id: 50,
            subject: 'Out - Test subj last',
            date: '0',
            from: 'John Doe',
            body: 'Test e-mail body #1',
            was_read: true
        }];
    };

    function setFlaggedEmailCount() {
        readInboxEmails();
        data.flagged = $filter('filter')(inbox, {
            flagged: true
        }).length;
        console.log(data.flagged);
    };

    return {
        getInboxEmailCount: function() {
            readInboxEmails();
            return inbox.length;
        },
        getFlaggedEmailCount: function() {
            setFlaggedEmailCount();
            return data.flagged;
        },
        getOutboxEmailCount: function() {
            readOutboxEmails();
            return outbox.length;
        },
        getInboxEmails: function() {
            readInboxEmails();
            return inbox;
        },
        getOutboxEmails: function() {
            readOutboxEmails();
            return outbox;
        },
        getInboxEmail: function(id) {
            for (i = 0; i < inbox.length; i++) {
                if (inbox[i].id == id) {
                    return inbox[i];
                }
            }
            return null;
        },
        getOutboxEmail: function(id) {
            for (i = 0; i < outbox.length; i++) {
                if (outbox[i].id == id) {
                    return outbox[i];
                }
            }
            return null;
        }
    }
});