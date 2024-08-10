#!/usr/bin/env php
<?php
$in   = file_get_contents('input8.txt');
$test = <<<TST
2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2
TST;

//$in = $test;
$lines = explode(" ", $in);
$twos  = $lines;

function countMetaData(&$rest) {
	$cCount = array_shift($rest);
	$mCount = array_shift($rest);
//	echo "Node has $cCount $mCount \n";
//	echo "rest " . implode(' ', $rest) . PHP_EOL;

	$m = 0;
	for ($c = 0; $c < $cCount; $c++) {
		$m += countMetaData($rest);
	}
	for ($i = 0; $i < $mCount; $i++) {
		$v = array_shift($rest);
//		echo "Adding meta $v\n";
		$m += $v;
	}
//	echo "Returing $m\n";
	return $m;
}

$one = countMetaData($lines);

echo "Part 1 $one\n\n";
global $x; $x = 65;
function countValue(&$rest) {
	global $x;
	echo "Node " . chr($x) . PHP_EOL;

	$cCount = array_shift($rest);
	$mCount = array_shift($rest);

	$m = 0;
	if ($cCount == 0) {
		echo "No kides, summing $mCount metadata\n";
		for ($i = 0; $i < $mCount; $i++) {
			$v = array_shift($rest);
			$m += $v;
		}
	} else {
		$kids = [0];
		echo "Has $cCount kids counting values\n";
		for ($c = 0; $c < $cCount; $c++) {
			$x++;
			$kids[$c + 1] = countValue($rest);
			echo "Kid $c has value {$kids[$c+1]}\n";
		}
		echo "Summing meta now\n";
		for ($i = 0; $i < $mCount; $i++) {
			$v = array_shift($rest);
			if (isset($kids[$v])){
				echo "kid $v exists and is added\n";
				$m += $kids[$v];
			} else {
				echo "No kid $v\n";
			}
		}
	}
	echo "returning $m\n";
	return $m;
}

$two = countValue($twos);
echo "Part 2 $two\n";
echo "\n";