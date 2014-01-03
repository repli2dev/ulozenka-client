<?php

function getDataFromCache() {
	$filename = dirname(__FILE__).'/cachedData.php';
	if(file_exists($filename) && filemtime($filename) > time() - 24*3600) {
		return file_get_contents($filename);
	}
	return FALSE;
}

function putDataIntoCache($data) {
	$filename = dirname(__FILE__).'/cachedData.php';
	file_put_contents($filename, $data);
}

function getDataFromSource($url, $key) {
	$ch = curl_init(); 
	curl_setopt($ch, CURLOPT_URL, prepareUrl($url,$key));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$content = curl_exec($ch); 
	curl_close($ch); 
	return $content;
}

function prepareUrl($url, $key) {
	return str_replace('<KEY>', $key, $url);
}

function parseData($data) {
	return simplexml_load_string($data);
}

function isValid($data) {
	return $data != NULL && !empty($data->pobocky);
}