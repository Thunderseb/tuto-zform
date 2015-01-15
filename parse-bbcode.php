<?php

function parseBBCodeToHTML($text) {
	// Expressions BBCode
	$tags = array(
		'~\[b\](.*?)\[/b\]~s',
		'~\[i\](.*?)\[/i\]~s',
		'~\[u\](.*?)\[/u\]~s',
		'~\[s\](.*?)\[/s\]~s',
		
		'~\[url\]((?:ftp|https?)://.*?)\[/url\]~s',
		'~\[img\](https?://.*?\.(?:jpg|jpeg|gif|png|bmp))\[/img\]~s',
		'~\[quote\](.*?)\[/quote\]~s',
		'~\[quote=(.*?)\](.*?)\[/quote\]~s',
		
		'~\[color=(.*?)\](.*?)\[/color\]~s'
	);
	
	// Remplacement HTML
	$html = array(
		'<b>$1</b>',
		'<i>$1</i>',
		'<span class="text-u">$1</span>',
		'<del>$1</del>',
		
		'<a href="$1">$1</a>',
		'<img src="$1" alt="Image utilisateur" />',
		'<blockquote>$1</blockquote>',
		'<blockquote><cite>$1</cite>$2</blockquote>',
		
		'<span class="text-$1">$2</span>'
	);
	
	$text = htmlspecialchars($text, ENT_QUOTES);
	$text = preg_replace($tags, $html, $text);
	
	// Parsage des smilies
	$smiliesName = array(':magicien:', ':colere:', ':diable:', ':ange:', ':ninja:', '&gt;_&lt;', ':pirate:', ':zorro:', ':honte:', ':soleil:', ':\'\\(', ':waw:', ':\\)', ':D', ';\\)', ':p', ':lol:', ':euh:', ':\\(', ':o', ':colere2:', 'o_O', '\\^\\^', ':\\-°');
	$smiliesFile = array('magicien.png', 'angry.gif', 'diable.png', 'ange.png', 'ninja.png', 'pinch.png', 'pirate.png', 'zorro.png', 'rouge.png', 'soleil.png', 'pleure.png', 'waw.png', 'smile.png', 'heureux.png', 'clin.png', 'langue.png', 'rire.gif', 'unsure.gif', 'triste.png', 'huh.png', 'mechant.png', 'blink.gif', 'hihi.png', 'siffle.png');
	$smiliesPath = "http://www.siteduzero.com/Templates/images/smilies/";
	
	for ($i = 0, $c = count($smiliesName); $i < $c; $i++) {
		$text = preg_replace('`' . $smiliesName[$i] . '`isU', '<img src="' . $smiliesPath . $smiliesFile[$i] . '" alt="smiley" />', $text);
	}
	
	// Retours à la ligne
	$text = preg_replace('`\n`isU', '<br />', $text); 
	
	return $text;
}

if (isset($_POST["string"])) {
	$text = $_POST["string"];
	
	if (get_magic_quotes_gpc()) {
		$text = stripslashes($text);
	}

	echo parseBBCodeToHTML($text); // Ecriture du contenu parsé. 
}

?>