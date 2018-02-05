/**
 * @properties={typeid:24,uuid:"5BFB03C1-D706-49F3-B8A9-B1B779CC56B6"}
 */
function authenticate()
{
	var _args = arguments;
	application.output(_args);
	
	var frm = forms.ma_sec_login;
	frm.vUsername = 'ASSISTENZA';
	frm.vPassword = '165';
	frm.vOwner = 'BIO C BON';
	
	return frm.loginWithCAS();
}
