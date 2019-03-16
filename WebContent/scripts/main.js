(function() {
	var user_id = '1111';
	var user_fullname = 'John Smith';
	var lng = -122.08;
	var lat = 37.38;
	
	init();
	
	function init() {
		
		// Register event listeners
		$('login-btn').addEventListener('click', login);
		$('nearby-btn').addEventListener('click', loadNearbyItems);
		$('fav-btn').addEventListener('click', loadFavoriteItems);
		$('recommend-btn').addEventListener('click', loadRecommendedItems);

		validateSession();

		// onSessionValid({
		// user_id : '1111',
		// name : 'John Smith'
		// });

		var welcomeMsg = $('welcome-msg');
		welcomeMsg.innerHTML = 'Welcome, ' + user_fullname;
		initGeoLocation();
	}

	/**
	 * Session
	 */
	function validateSession() {
		// The request parameters
		var url = './login';
		var req = JSON.stringify({});

		// display loading message
		showLoadingMessage('Validating session...');

		// make AJAX call
		ajax('GET', url, req,
		// session is still valid
		function(res) {
			var result = JSON.parse(res);

			if (result.status === 'OK') {
				onSessionValid(result);
			}
		});
	}

	function onSessionValid(result) {
		user_id = result.user_id;
		user_fullname = result.name;

		var loginForm = $('login-form');
		var itemNav = $('item-nav');
		var itemList = $('item-list');
		var avatar = $('avatar');
		var welcomeMsg = $('welcome-msg');
		var logoutBtn = $('logout-link');

		welcomeMsg.innerHTML = 'Welcome, ' + user_fullname;

		showElement(itemNav);
		showElement(itemList);
		showElement(avatar);
		showElement(welcomeMsg);
		showElement(logoutBtn, 'inline-block');
		hideElement(loginForm);

		initGeoLocation();
	}

	function onSessionInvalid() {
		var loginForm = $('login-form');
		var itemNav = $('item-nav');
		var itemList = $('item-list');
		var avatar = $('avatar');
		var welcomeMsg = $('welcome-msg');
		var logoutBtn = $('logout-link');

		hideElement(itemNav);
		hideElement(itemList);
		hideElement(avatar);
		hideElement(logoutBtn);
		hideElement(welcomeMsg);

		showElement(loginForm);
	}

	
//		console.log('ok');
//		
//		var nearbyBtn = document.getElementById('nearby-btn');
//		nearbyBtn.addEventListener('click', loadNearbyItems);
//
//		initGeoLocation();
//	}
	
	function initGeoLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(onPositionUpdated,
					onLoadPositionFailed, {
						maximumAge : 60000
					});
			showLoadingMessage('Retrieving your location...');
	//		console.log('ok');
		} else {
			onLoadPositionFailed();
		}
	}
		function showLoadingMessage(msg) {
			var itemList = document.getElementById('item-list');
			itemList.innerHTML = '<p class="notice"><i class="fa fa-spinner fa-spin"></i> '
					+ msg + '</p>';
		}

		
		function onPositionUpdated(position) {
			lat = position.coords.latitude;
			lng = position.coords.longitude;
//			console.log('lat -- ' + lat);
//			console.log('lng -- ' + lng);

			loadNearbyItems();
		}
		
		
		
		function loadNearbyItems() {
			console.log('loading nearby items');

			// active button 
			activeBtn('nearby-btn');
			
			// The request parameters
			var url = './search';
			var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng;
			var req = JSON.stringify({});
			
			console.log(req);
			
			// display loading message
			console.log('Loading nearby items...');
			
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url + '?' + params, true);
			xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
			xhr.send(req);
			
			xhr.onload = function() {
				console.log('response is ok ...');
				if(xhr.status === 200) {
					var items = JSON.parse(xhr.responseText);
					if (!items || items.length === 0) {
//						showWarningMessage('No nearby item.');
						console.log('No nearby item.');
					} else {
						listItems(items);
//						console.log(items);
					}
				} else if(xhr.status === 403) {
					console.log('invalid session');
				} else {
					console.log('error');
				}
			}
			
			xhr.onerror = function() {
				console.error("The request couldn't be completed.");
//				showErrorMessage("The request couldn't be completed.");
			};
			
		}
		
		function listItems (items){
			var itemList = document.getElementById('item-list');
			itemList.innerHTML = '';

			for (var i = 0; i < items.length; i++) {
				addItem(itemList, items[i]);
			}
		}
		
		function addItem(itemList, item) {
			var item_id = item.item_id;
			
			// create the <li> tag and specify the id and class attributes
			var li = document.createElement('li');
			li.setAttribute('id', 'item-' + item_id);
			li.setAttribute('class', 'item');
			
			// set the data attribute
			li.dataset.item_id = item_id;
			li.dataset.favorite = item.favorite;
			
			// item image
			var image = document.createElement('img');
			image.setAttribute('src', item.image_url);
			if (item.image_url) {
				image.setAttribute('src', item.image_url);
			} else {
				image.setAttribute('src', 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png');
			}
			li.appendChild(image);
			
			// section
			var section = document.createElement('div');
			
			// title
			var title = document.createElement('a');
			title.setAttribute('href', item.url);
			title.setAttribute('target', '_blank');
			title.setAttribute('class', 'item-name');
			title.innerHTML = item.name;
			section.appendChild(title);
			
			// category
			var category = document.createElement('p');
			category.setAttribute('class', 'item-category');
			category.innerHTML = 'Category: ' + item.categories.join(', ');
			section.appendChild(category);
			
			li.appendChild(section);
			
			// address
			var address = document.createElement('p');
			category.setAttribute('class', 'item-address');
			address.innerHTML = item.address.replace(/,/g, '<br/>').replace(/\"/g,
					'');
			li.appendChild(address);

			// favorite link
			var favLink = document.createElement('p');
			favLink.setAttribute('class', 'fav-link');

			var extra = document.createElement('i');
			extra.setAttribute('id', 'fav-icon-' + item_id);
			extra.setAttribute('class', item.favorite ? 'fa fa-heart' : 'fa fa-heart-o');
			
			favLink.appendChild(extra);

			li.appendChild(favLink);

			itemList.appendChild(li);
		}

		
		// -----------------------------------
		// Login
		// -----------------------------------

		function login() {
			var username = $('username').value;
			var password = $('password').value;
			password = md5(username + md5(password));

			// The request parameters
			var url = './login';
			var req = JSON.stringify({
				user_id : username,
				password : password,
			});

			ajax('POST', url, req,
			// successful callback
			function(res) {
				var result = JSON.parse(res);

				// successfully logged in
				if (result.status === 'OK') {
					onSessionValid(result);
				}
			},

			// error
			function() {
				showLoginError();
			});
		}

		function showLoginError() {
			$('login-error').innerHTML = 'Invalid username or password';
		}

		function clearLoginError() {
			$('login-error').innerHTML = '';
		}

		

		function activeBtn(btnId) {
			var btns = document.getElementsByClassName('main-nav-btn');
			
			// deactivate all navigation buttons
			for (var i = 0; i < btns.length; i++) {
				btns[i].className = btns[i].className.replace(/\bactive\b/, '');
			}
			
			// active the one that has id = btnId
			var btn = document.getElementById(btnId);
			btn.className += ' active';
		}
		
		
		

		function onLoadPositionFailed() {
			console.warn('navigator.geolocation is not available');
			getLocationFromIP();
		}

		function getLocationFromIP() {
			// Get location from http://ipinfo.io/json
			var url = 'http://ipinfo.io/json'
			var req = null;
			
			var xhr = new XMLHttpRequest();
			
			xhr.open('GET', url, true);
			xhr.send();
			
			xhr.onload = function() {
				if(xhr.status === 200) {
					var result = JSON.parse(xhr.responseText);
					if ('loc' in result) {
						var loc = result.loc.split(',');
						lat = loc[0];
						lng = loc[1];
					} else {
						console.warn('Getting location by IP failed.');
					}
					loadNearbyItems();
				} else if(xhr.status === 403) {
					console.log('invalid session');
				} else {
					console.log('error');
				}
			}
			
			xhr.onerror = function() {
				console.error("The request couldn't be completed.");
				showErrorMessage("The request couldn't be completed.");
			};
		}

		
		function onLoadPositionFailed() {
			console.log('location error');
		}

})()
