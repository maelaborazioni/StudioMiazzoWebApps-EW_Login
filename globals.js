/**
 * @param arg
 * @param queryParams
 *
 * @properties={typeid:24,uuid:"D84E359C-9168-4D92-9B32-F22CB825E563"}
 */
function ew_sec_login_onSolutionOpen(arg,queryParams)
{
	ma_sec_login_onSolutionOpen(arg,queryParams);
}

/**
 * @properties={typeid:24,uuid:"1EE6EDBA-D1D6-4CF1-BF6E-78D23ABE53FB"}
 */
function deepLoginPwd(various,arguments)
{
	//http://localhost:8080/servoy-webclient/ss/s/PresenzaSemplice/m/deepLogin/a/args/user/Mabel/pwd/Mae165mp/owner/MA
	//http://localhost:8080/servoy-webclient/ss/s/PresenzaSemplice/m/deepLogin/a/args/user/Giovanni/pwd/165/owner/MA/organization/IT
		
	var _args = arguments;
	application.output(_args);
	
	var _authObj = new Object()
	_authObj.username = arguments.user
	_authObj.password = arguments.pwd
	_authObj.user_id = null;
	_authObj.owner = arguments.owner
	_authObj.owner_id = null;
	_authObj.firstLoginAttempt = new Date()
	_authObj.lastLoginAttempt = new Date()
	_authObj.framework_db = 'svy_framework'
	_authObj.organization = arguments.organization ? arguments.organization : null;
	_authObj.organization_id = null;
	_authObj.user_org_id = 1119;
	
	/** @type {{owner_id:String,user_id:String,error:String, success:Boolean}} */
	var _return = security.authenticate('svy_sec_authenticate', 'svy_sec_checkUserPassword',[_authObj])
	if(_return.success)
	{
		// set user id
		_authObj.user_id = globals.svy_sec_lgn_user_id = _return.user_id
		application.setUserProperty(application.getSolutionName() +'.username',arguments.user)
		// set owner id
		_authObj.owner_id = globals.svy_sec_lgn_owner_id = _return.owner_id
		application.setUserProperty(application.getSolutionName() +'.ownername',arguments.owner)
		
		// get organizations, if there are multiple organizations for this user he has to choose his organization
		/** @type {JSDataSet} */
		var _dat_org =  security.authenticate('svy_sec_authenticate', 'svy_sec_getOrganizations', [_authObj.user_id, _authObj.owner_id, _authObj.framework_db]);
		if(!_authObj.organization_id && _dat_org.getMaxRowIndex() == 1)
			_authObj.organization_id = _dat_org.getValue(1,2);
		else
		{
			for(var o = 1; o <= _dat_org.getMaxRowIndex(); o++)
			{
				if(_dat_org.getValue(o,1) == _authObj.organization)
				{
				   _authObj.organization_id = _dat_org.getValue(o,2);	
				   break;
				}
			}
			
			if(!_authObj.organization_id)
			{
				// can't find the related single organization as specified by user
				return false;
			}
		}
		// login
		var _user_org_id = security.authenticate('svy_sec_authenticate', 'svy_sec_login', [_authObj.username, _authObj.user_id, _authObj.organization_id, _authObj.framework_db]);
		
		if(_user_org_id == 0) 
			globals.svy_sec_lgn_user_org_id = 0
		else if (_user_org_id > 0) 
			globals.svy_sec_lgn_user_org_id = _user_org_id;
		
		// save organization id
		application.setUserProperty(application.getSolutionName() +'.organization',_authObj.organization_id);
		globals.svy_sec_lgn_organization_id = _authObj.organization_id;
		
		//for keeping track of logged in users per owner
		application.addClientInfo(_authObj.owner_id + " " + _authObj.owner);
		
		return true;
	}	
		
	return false;
}

/**
 * Method for automatic login when request is coming from trusted web app 
 * 
 * @param various
 * @param arguments
 *
 * @properties={typeid:24,uuid:"43654CF8-F67F-4771-AFEB-47BBDB0FB6D7"}
 * @AllowToRunInFind
 */
function deepLogin(various,arguments)
{
	return false;
	
//	// controllo validità argomenti passati
//	if(!arguments || !arguments.username || !arguments.owner || !arguments.organization)
//		return false;
//	
//	var _authObj = new Object()
//	_authObj.username = arguments.username
//	_authObj.user_id = null;
//	_authObj.owner = arguments.owner
//	_authObj.owner_id = null;
//	_authObj.framework_db = 'svy_framework'
//	_authObj.organization = arguments.organization;
//	_authObj.organization_id = null;
//	_authObj.user_org_id = null;
//	
//	// get and set owner id
//	_authObj.owner_id = globals.svy_sec_lgn_owner_id = globals.svy_sec_getOwnerFromName(_authObj.owner,_authObj.framework_db);
//		
//	// get and set user id
//	_authObj.user_id = globals.svy_sec_lgn_user_id = globals.svy_sec_getUserFromName(_authObj.username,_authObj.owner_id,_authObj.framework_db);
//	
//	// get and set organization id
//	_authObj.organization_id = globals.svy_sec_lgn_organization_id = globals.svy_sec_getOrganizationFromOwnerOrganization(_authObj.owner_id,_authObj.organization,_authObj.framework_db);
//
//	// no cookies
//	globals.svy_sec_cookies = false;
////	application.setUserProperty(application.getSolutionName() +'.username',_authObj.username)
////	application.setUserProperty(application.getSolutionName() +'.ownername',_authObj.owner)
////	application.setUserProperty(application.getSolutionName() +'.organization',_authObj.organization)
//	
//	// login
//	var _user_org_id = -1;
//	/** @type {JSFoundSet<db:/svy_framework/sec_user_org>} */
//	var _fsUserOrg = databaseManager.getFoundSet(_authObj.framework_db, 'sec_user_org');
//	_fsUserOrg.find();
//	_fsUserOrg.user_id = _authObj.user_id;
//	_fsUserOrg.organization_id = _authObj.organization_id;
//	if (_fsUserOrg.search())
//		_user_org_id = _fsUserOrg.user_org_id;
//		
////	var _user_org_id = security.authenticate('svy_sec_authenticate', 'svy_sec_login', [_authObj.username, _authObj.user_id, _authObj.organization_id, _authObj.framework_db]);
//	
//	if(_user_org_id == 0) 
//		_authObj.user_org_id = globals.svy_sec_lgn_user_org_id = 0
//	else if (_user_org_id > 0) 
//		_authObj.user_org_id = globals.svy_sec_lgn_user_org_id = _user_org_id;
//	else
//	{
//		application.output('Can\'t find user organization\'s id',LOGGINGLEVEL.DEBUG)
//		return false;
//	}
//	
//	//for keeping track of logged in users per owner
//	application.addClientInfo(_authObj.owner_id + " " + _authObj.owner);
//	
//	return security.login(_authObj.username, _authObj.user_org_id, ['users']);
}

/**
 * Method for automatic login through a provided token (if trusted)
 * 
 * @param various
 * @param arguments
 *
 * @properties={typeid:24,uuid:"977FF387-52CC-468F-80F3-F92A6A76EA7E"}
 * @AllowToRunInFind
 */
function deepLoginToken(various,arguments)
{
	return false;
	
	//http://localhost:8080/servoy-webclient/ss/s/StudioMiazzoWebApps/m/deepLoginToken/a/args/token/token_hash/owner/owner_hash
	
//	if(!arguments)
//		return false;
//	
//	/** @type {String} */
//	var token = arguments['token']; 
//	/** @type {String} */
//	var owner = arguments['owner'];
//	
//	// recupera le informazioni di accesso dell'utente (user_id,owner_id,organization,owner,user_org_id) a partire dal token 
//	// l'utente corrisponde all'utente 'base' creato appositamente per il proprietario per il suo utilizzo dalla webapp 
//	var _authObj = new Object();
//	
//	var autValue = security.authenticate('svy_sec_authenticate', 'svy_sec_checkAccessToken', [token]);
//	
//	if(!autValue)
//		return autValue;
//	
//	_authObj.framework_db = 'svy_framework';
//	
//	// get and set owner id
//	_authObj.owner_id = globals.svy_sec_lgn_owner_id = globals.svy_sec_getOwnerFromName(owner,_authObj.framework_db);
//	
//	// get the default user bounded to the specified owner
//	// login
//	var _user_org_id = -1;
//	/** @type {JSFoundSet<db:/svy_framework/sec_owner_default_user>} */
//	var _fsUserDef = databaseManager.getFoundSet(_authObj.framework_db, 'sec_owner_default_user');
//	_fsUserDef.find();
//	_fsUserDef.owner_id = _authObj.owner_id;
//	if (_fsUserDef.search())
//		_user_org_id = _fsUserDef.sec_user_org_id;
//	
//	if(_user_org_id == 0) 
//		_authObj.user_org_id = globals.svy_sec_lgn_user_org_id = 0
//	else if (_user_org_id > 0) 
//		_authObj.user_org_id = globals.svy_sec_lgn_user_org_id = _user_org_id;
//	else
//	{
//		application.output('Can\'t find user organization\'s id',LOGGINGLEVEL.DEBUG)
//		return false;
//	}
//	
//	// get and set user id
//	_authObj.user_id = globals.svy_sec_lgn_user_id = globals.svy_sec_getUserFromUserOrgId(_authObj.user_org_id,_authObj.framework_db);
//	
//	// get and set corresponding username for login
//	_authObj.username = globals.svy_sec_getUserName(_authObj.user_id,_authObj.owner_id,_authObj.framework_db);
//	
//	// get and set organization id
//	_authObj.organization_id = globals.svy_sec_lgn_organization_id = globals.svy_sec_getOrganizationFromUserOrgId(_user_org_id,_authObj.framework_db);
//	
//	// no cookies
//	globals.svy_sec_cookies = false;
//		
//	//for keeping track of logged in users per owner
//	application.addClientInfo(_authObj.owner_id + " " + owner);
//	return security.login(_authObj.username, _authObj.user_org_id, ['users']);
} 

/**
 * @AllowToRunInFind
 * 
 * Perform deep login with the token provided from webapp
 * @param various
 * @param arguments
 *
 * @properties={typeid:24,uuid:"A976F5E8-FBD2-4360-A2BA-7D5615B2D1BD"}
 */
function deepLoginFromApp(various,arguments)
{
    //http://localhost:8080/servoy-webclient/ss?s=StudioMiazzoWebApps&m=deepLoginFromApp&a=args&token=token_hash
	
	if(!arguments)
		return false;
	
	// crypted token as passed from our source application
	/** @type {String} */
	var token = arguments['token']; 
	
	var options = scopes.crypto.createOptions().setAlgorithmName(scopes.crypto.ALGORITHM_NAMES.AES);
	options.setKey(scopes.crypto.createOptions().setAlgorithmName(scopes.crypto.ALGORITHM_NAMES.AES).getKeyAsString());
	var decryptedToken = scopes.crypto.decryptAsString(token,options);
	
	var arrToken = decryptedToken.split(':');
	
	var username = arrToken[0];
	var owner = arrToken[1];
	var organization = arrToken[2];
	var generationTime = arrToken[4];
	
	// control if token has expired (1 minutes default validity)
	var now = new Date();
	if(parseInt(generationTime,10) - now.getTime() >= 6000)
		return false;
	
	var _authObj = new Object();
	_authObj.username = username;
	_authObj.user_id = null;
	_authObj.owner = owner;
	_authObj.owner_id = null;
	_authObj.framework_db = 'svy_framework';
	_authObj.organization = organization;
	_authObj.organization_id = null;
	_authObj.user_org_id = null;
	
	// preparing search of (user,organization) couple's login
	var _user_org_id = -1;
		
	// get and set owner id
	_authObj.owner_id = globals.svy_sec_lgn_owner_id = globals.svy_sec_getOwnerFromName(_authObj.owner,_authObj.framework_db);
		
	// if username has been provided as param
	if(_authObj.username)
	{
		// get and set user id
		_authObj.user_id = globals.svy_sec_lgn_user_id = globals.svy_sec_getUserFromName(_authObj.username,_authObj.owner_id,_authObj.framework_db);
		// get and set organization id
		_authObj.organization_id = globals.svy_sec_lgn_organization_id = globals.svy_sec_getOrganizationFromOwnerOrganization(_authObj.owner_id,_authObj.organization,_authObj.framework_db);
	
		/** @type {JSFoundSet<db:/svy_framework/sec_user_org>} */
		var _fsUserOrg = databaseManager.getFoundSet(_authObj.framework_db, 'sec_user_org');
		_fsUserOrg.find();
		
		_fsUserOrg.user_id = _authObj.user_id;
		_fsUserOrg.organization_id = _authObj.organization_id;
	
		if (_fsUserOrg.search())
			_user_org_id = _fsUserOrg.user_org_id;
	}
	else
	{
		/** @type {JSFoundSet<db:/svy_framework/sec_owner_default_user>} */
		var _fsUserDef = databaseManager.getFoundSet(_authObj.framework_db, 'sec_owner_default_user');
		_fsUserDef.find();
		_fsUserDef.owner_id = _authObj.owner_id;
		if (_fsUserDef.search())
			_user_org_id = _fsUserDef.sec_user_org_id;
		
		// get and set user id
		_authObj.user_id = globals.svy_sec_lgn_user_id = globals.svy_sec_getUserFromUserOrgId(_authObj.user_org_id,_authObj.framework_db);
		
		// get and set corresponding username for login
		_authObj.username = globals.svy_sec_getUserName(_authObj.user_id,_authObj.owner_id,_authObj.framework_db);
		
		// get and set organization id
		_authObj.organization_id = globals.svy_sec_lgn_organization_id = globals.svy_sec_getOrganizationFromUserOrgId(_user_org_id,_authObj.framework_db);
	}
	
	// no cookies
	globals.svy_sec_cookies = false;
			
	if(_user_org_id == 0) 
		_authObj.user_org_id = globals.svy_sec_lgn_user_org_id = 0
	else if (_user_org_id > 0) 
		_authObj.user_org_id = globals.svy_sec_lgn_user_org_id = _user_org_id;
	else
	{
		application.output('Can\'t find user organization\'s id for user ' + username + ' of owner ' + owner,LOGGINGLEVEL.ERROR)
		return false;
	}
	
	//for keeping track of logged in users per owner
	application.addClientInfo(_authObj.owner_id + " " + _authObj.owner);
	
	return security.login(_authObj.username, _authObj.user_org_id, ['users']);
}