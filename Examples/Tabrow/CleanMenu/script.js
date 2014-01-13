/* ___                     ____      ___            __    ___                   __   _
  / _ \ ___  __ _  ___    / __/___  / _ ) ___  ___ / /_  / _ \ ____ ___ _ ____ / /_ (_)____ ___  ___
 / // // -_)/  ' \/ _ \   > _/_ _/ / _  |/ -_)(_-</ __/ / ___// __// _ `// __// __// // __// -_)(_-<
/____/ \__//_/_/_/\___/  |_____/  /____/ \__//___/\__/ /_/   /_/   \_,_/ \__/ \__//_/ \__/ \__//___/

Qlik takes no responsbility for any code.
Use at your own risk. Do not submerge in water. DO NOT taunt Happy Fun Ball.
Alexander Karlsson akl@qlikview.com
*/

//CONST
//The EXTENSION_NAME has to correspond to the name of your extension
var EXTENSION_NAME = 'CleanMenu';
var PATH = Qva.Remote + '?public=only&type=document&name=Extensions/' + EXTENSION_NAME + '/';

//Main function
function init() {

	//Load our CSS file to style our Tabrow. See style.css for more information
	Qva.LoadCSS(PATH + "style.css");

	//Register our extension
	Qva.AddDocumentExtension(EXTENSION_NAME, function () {
		//Add our own Paint method to the Tabrow
		this.Document.SetTabrowPaint(function() {
			//empty the element when update occurs.
			//This prevents the tabrow from being rendered on multiple updates.
			$(this.Element).empty()
			//Create our tabrow.
			this.createTabrow();
		});
	});
};


//Load scripts in the array
var scripts = [PATH + 'qvutils.js'];

//If any external scripts should be loaded, load them.
//Otherwise proceed to init() which is the main function
function loadScripts() {
    if(scripts.length != 0) {
    	//This is a method added in QV11. Not available in QV10.
    	//Load any scripts and call function init() when they are loaded.
    	Qv.LoadExtensionScripts(scripts, init);
    } else {
    	//If no scripts to load go ahead and call init()
    	init();
    };
};

//Call loadScripts() which sets off the entire chain
loadScripts();