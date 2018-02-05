/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"1E2EA2F9-B039-4B40-8729-1A65E310074C"}
 */
var html = '';

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"375C1468-C901-4F4C-AAA0-C91BB6574F13"}
 */
function onAction$lbl_logo(event) 
{
	application.showURL('http://www.studiomiazzo.it');
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"624EE4E5-EC1A-424B-B305-A2123521CE82"}
 */
function onLoad(event) 
{
	_super.onLoad(event);
	
	elements.allnames.filter (function(name){ return globals.startsWith('fld_', name); })
					 .forEach(function(name){ 
						 plugins.WebClientUtils.setExtraCssClass(elements[name], 'nofocus'); 
						 });
	
	setHtml();
	showMessage("Inserisci i dati per l'accesso");
}

/**
 * @properties={typeid:24,uuid:"5D2E707C-4E8D-41D3-9E49-605227E3AF5E"}
 */
function setHtml()
{
	var error_id = '#' + plugins.WebClientUtils.getElementMarkupId(elements.error); 
	html = utils.stringReplace('<script type="text/javascript">\
									function hideMessage()\
									{\
										$("@id").slideUp(500);\
									}\
									\
									function showMessage(msg)\
									{\
										setTimeout(function()\
										{\
											$("@id span").text(msg);\
										},\
										1000);\
										\
										$("@id").hide().delay(500).slideDown(500);\
									}\
								</script>',
								'@id', 
								error_id);
}

/**
 * @param message
 *
 * @properties={typeid:24,uuid:"D832AE3A-AA65-4592-8EBA-0B6BEFC1DB7F"}
 */
function showMessage(message)
{
	elements.error.text = message;
	plugins.WebClientUtils.executeClientSideJS(scopes.string.Format('showMessage("@0");', message));
}

/**
 * @properties={typeid:24,uuid:"BC3E7E3B-4C91-491B-BF47-6753F737587C"}
 */
function hideMessage()
{
	plugins.WebClientUtils.executeClientSideJS('hideMessage();');
}
