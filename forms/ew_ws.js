/**
 * @properties={typeid:24,uuid:"9E9017F8-4AFF-4C17-BF50-9588DB563E49"}
 */
function ws_create()
{
	var args = arguments[0];
	
	var username = args['username'];
	var solutionName = 'PresenzaSemplice';
	
	var client = plugins.clientmanager.getClientInformation();
	if(client.getUserName() == username
	   && client.getOpenSolutionName() == solutionName)
	   return { logged : true };
   
    return { logged : false };
}