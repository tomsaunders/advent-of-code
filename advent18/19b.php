#!/usr/bin/env php
<?php
$num = 10551319;
// $num = 919;
$sum = 0;
$s = sqrt($num);

for ($i = 1; $i < $s; $i++){
	$div = $num / $i;
	if ($div == round($div)){
		$sum += $i;
		$sum += $div;
	}
}
echo $sum . "\n";