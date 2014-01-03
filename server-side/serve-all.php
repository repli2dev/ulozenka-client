<?php
header("Content-type: text/javascript");
include_once dirname(__FILE__) . '/inc/function.php';
include_once dirname(__FILE__) . '/inc/jsmin.php';

$url = "http://www.ulozenka.cz/partner/pobocky.php?key=<KEY>";
// Uncomment next line only for testing purposes, official rules ban using this source
$url = "http://www.ulozenka.cz/download/pobocky.xml";
$key = NULL;
if(isSet($_GET['key'])) {
	$key = htmlspecialchars($_GET['key']);
}

// Get data
$data = getDataFromCache();
$parsedData = parseData($data);
if($data === FALSE || !isValid($parsedData)) {
	$data = getDataFromSource($url,$key);
	$parsedData = parseData($data);
	if($data === FALSE || !isValid($parsedData)) {
		$errorData = array('code' => 500);
	} else {
		putDataIntoCache($data);
		$parsedData = parseData($data);
	}
}

if(isSet($errorData)) {
	echo "var UAData = " . json_encode($errorData) . "\n";
} else {
	echo "var UAData = " . json_encode($parsedData) . "\n";
}
/*echo JSMin::minify(*/echo file_get_contents(dirname(__FILE__). '/inc/functions.js')/*)*/;