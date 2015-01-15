
if (typeof Texta === "undefined") {
	
	var Texta = {
		// Propriétés
		smiliesName: [':magicien:', ':colere:', ':diable:', ':ange:', ':ninja:', '&gt;_&lt;', ':pirate:', ':zorro:', ':honte:', ':soleil:', ':\'\\(', ':waw:', ':\\)', ':D', ';\\)', ':p', ':lol:', ':euh:', ':\\(', ':o', ':colere2:', 'o_O', '\\^\\^', ':\\-°'],
		smiliesFile: ['magicien.png', 'angry.gif', 'diable.png', 'ange.png', 'ninja.png', 'pinch.png', 'pirate.png', 'zorro.png', 'rouge.png', 'soleil.png', 'pleure.png', 'waw.png', 'smile.png', 'heureux.png', 'clin.png', 'langue.png', 'rire.gif', 'unsure.gif', 'triste.png', 'huh.png', 'mechant.png', 'blink.gif', 'hihi.png', 'siffle.png'],
		smiliesPath: "http://fr.openclassrooms.com/Templates/images/smilies/",
		
		viewPath: "parse-bbcode.php",
		
		setVisualisationPath: function(path) {
			this.viewPath = path;
		},
		
		// Méthodes
		insert: function(elem, idTextarea) {
			var field  = document.getElementById(idTextarea); 
			var scroll = field.scrollTop;
				field.focus();
			
			var strBefore	= elem.getAttribute("data-before")	|| "";
			var strAfter	= elem.getAttribute("data-after")	|| "";
			var strType		= elem.getAttribute("data-type")	|| null;
				
			/* === Partie 1 : on récupère la sélection === */
			if (window.ActiveXObject) { // C'est IE
				var textRange = document.selection.createRange();            
				var currentSelection = textRange.text;
			} else { 
				var startSelection   = field.value.substring(0, field.selectionStart);
				var currentSelection = field.value.substring(field.selectionStart, field.selectionEnd);
				var endSelection     = field.value.substring(field.selectionEnd);
			}
			
			/* === Partie 2 : on analyse le tagType === */
			if (strType) {
				switch (strType) {
					case "lien":
					// Si c'est un lien
					break;
					case "citation":
					// Si c'est une citation
					break;
				}
			}
				
			/* === Partie 3 : on insère le tout === */
			if (window.ActiveXObject) {	
				textRange.text = strBefore + currentSelection + strAfter;
				textRange.moveStart("character", -strAfter.length - currentSelection.length);
				textRange.moveEnd("character", -strAfter.length);
				textRange.select();     
			} else { // Ce n'est pas IE
				field.value = startSelection + strBefore + currentSelection + strAfter + endSelection;
				field.focus();
				field.setSelectionRange(startSelection.length + strBefore.length, startSelection.length + strBefore.length + currentSelection.length);
			} 
			
			field.scrollTop = scroll; // et on redéfinit le scroll.			
		},
		
		insertFromSelect: function(elem, idTextarea) {
			var opt = elem.options[elem.selectedIndex];
			
			elem.selectedIndex = 0;
			
			return this.insert(opt, idTextarea);
		},
		
		previewTimer: null,
		preview: function(elem, idPreview, idCheckbox) {
			var that = this, text;
			window.clearTimeout(this.previewTimer);
			
			if (document.getElementById(idCheckbox).checked) {
				this.previewTimer = window.setTimeout(function() {
					if (text = elem.value) {
						text+= " "; // Ajout d'un espace à la fin, au cas ou un smiley terminerait le texte
						text = text.replace(/&/g, "&amp;");	// Remplacement des & en leur entité HTML
						text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // Pareil pour les chevrons
						text = text.replace(/\n/g, "<br />").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"); // Sauts de ligne et tabulations
						
						text = text.replace(/\[b\]([\s\S]*?)\[\/b\]/g, '<strong>$1</strong>');				// Gras
						text = text.replace(/\[i\]([\s\S]*?)\[\/i\]/g, '<em>$1</em>');						// Italique
						text = text.replace(/\[u\]([\s\S]*?)\[\/u\]/g, '<span class="text-u">$1</span>');	// Souligne
						text = text.replace(/\[s\]([\s\S]*?)\[\/s\]/g, '<del>$1</del>');					// Barré
						
						text = text.replace(/\[url=([\s\S]*?)\]([\s\S]*?)\[\/url\]/g, '<a href="$1">$2</a>');
						text = text.replace(/\[img\]([\s\S]*?)\[\/img\]/g, '<img src="$1" alt="Image utilisateur" />');
						text = text.replace(/\[quote\]([\s\S]*?)\[\/quote\]/g, '<blockquote>$1</blockquote>');
						text = text.replace(/\[quote=([\s\S]*?)\]([\s\S]*?)\[\/quote\]/g, '<blockquote><cite>$1</cide>$2</blockquote>');
						
						text = text.replace(/\[color=([\s\S]*?)\]([\s\S]*?)\[\/color\]/g, '<span class="text-$1">$2</span>');
						
						for (var i=0, c=that.smiliesName.length; i<c; i++) {
							text = text.replace(
								new RegExp(" " + that.smiliesName[i] + " ", "g"), 
								'&nbsp;<img src="' + that.smiliesPath + that.smiliesFile[i] + '" alt="' + that.smiliesFile[i] + '" />&nbsp;'
							);
						}
						
						document.getElementById(idPreview).style.display = "block";	
						document.getElementById(idPreview).innerHTML = text;							
					}
					
				}, 500);
			}
		},
		
		createXMLHttpRequest: function() {
			if (window.XMLHttpRequest)
				return new XMLHttpRequest();
		 
			if (window.ActiveXObject) {
				var names = [
					"Msxml2.XMLHTTP.6.0",
					"Msxml2.XMLHTTP.3.0",
					"Msxml2.XMLHTTP",
					"Microsoft.XMLHTTP"
				];
				
				for(var i in names) {
					try { return new ActiveXObject(names[i]); }
					catch(e){}
				}
			}
			
			alert("Votre navigateur ne prend pas en charge l'objet XMLHTTPRequest.");
			return null;
		},
		
		viewXhr: null,
		view: function(elem, idTextarea, idView) {
			var view = document.getElementById(idView);
			var text = document.getElementById(idTextarea).value;
			var that = this;
			
			if (!text) { // Pas besoin de visualiser s'il n'y a pas de texte
				view.style.display = "none";
				view.innerHTML = "";
				return;
			}
			
			// Si une requête Xhr est déjà en cours, on l'annule avec abort()
			if (this.viewXhr && this.viewXhr.readyState != 0) {
				this.viewXhr.abort();
				this.viewXhr = null;
			}
			
			// On vérifie si l'on a réussi à créer un objet XMLHttpRequest
			if (this.viewXhr = this.createXMLHttpRequest()) {
				this.viewXhr.onreadystatechange = function() {
					if (that.viewXhr.readyState === 4 && that.viewXhr.status === 200) {
						view.style.display = "block";
						view.innerHTML = that.viewXhr.responseText;
					} else if (that.viewXhr.readyState === 3){
						view.style.display = "block";
						view.innerHTML = '<div class="text-center">Chargement en cours...</div>';
					} else if (that.viewXhr.status === 0) {
						view.innerHTML = '<div class="text-center">Visualisation impossible en mode local</div>';
					}
				}
		
				// Envoi en POST car le texte peut être très long
				this.viewXhr.open("POST", this.viewPath, true);
				this.viewXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // Car requête POST
				this.viewXhr.send("string=" + encodeURIComponent(text)); // Ne pas oublier d'encoder
			}
		}		
			
	};
	
}