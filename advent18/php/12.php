#!/usr/bin/env php
<?php
ini_set('memory_limit', '4G');
gc_disable();
$in   = file_get_contents('input12.txt');
$test = <<<TST
initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #
TST;
// $in = $test;
$lines = explode("\n", $in);

$initial = array_shift($lines);
// $initial = str_pad('', 100, '.') . str_replace('initial state: ', '', $initial) . str_pad('', 100, '.');
// $off = 100;
list($initial, $off) = upstate(str_replace('initial state: ', '', $initial), 0);

function upstate($state, $off)
{
	$state = '...' . $state . '...';
	$off += 3;
	return [$state, $off];
}

array_shift($lines);
$replacers = [];
foreach ($lines as $line) {
	list($replace, $with) = explode(' => ', $line);
	$replacers[$replace] = $with;
}

$gen = 0;
$maxGen = 50000000000;
$state = $initial;
$sum = 0;
$space = 0;
$z = 0;
$zat = 0;
$s = $t = microtime(TRUE);
$kd = 0;
while ($gen < 2000) {
	$next = str_pad('', strlen($state), '.');
	$g = str_pad($gen, 2, ' ', STR_PAD_LEFT) . ": ";

	$m = strlen($state) - 2;
	for ($i = 2; $i < $m; $i++) {
		$current = substr($state, $i - 2, 5);
		foreach ($replacers as $find => $result) {
			if ($current === $find) {
				$next[$i] = $result;
				break;
			}
		}
	}
	if ($next[0] === '#' || $next[1] === '#' || $next[2] === '#') {
		$next = "." . $next . ".";
		$off++;
	}
	// $state = $next;
	list($state, $off) = upstate($next, $off);
	$gen++;
	$nsum = getSum($state, $off);
	$d = $nsum - $sum;
	$sum = $nsum;
	if ($gen > 200) {
		$kd = $d;
		$toGo = $maxGen - $gen;
		$lastSum = $toGo * $d + $nsum;
		echo "At $gen, Diff is $d, this sum is $nsum, Last sum is $lastSum\n";
		$gen = $maxGen + 1;
	}
	if ($gen === 20) {
		echo "At $gen sum is $nsum\n";
		echo ($state);
	}
	// 	if (!$z){
	// 		$z = $sum;
	// 		$zat = $gen;
	// 	} else if ($z === $sum && !$space){
	// 		$space = $gen - $zat;
	// 		echo "Pattern repeats after $space\n";
	// 		$toGo = $maxGen - $gen;
	// 		$cycles = floor($toGo / $space) - 10;
	// 		echo "There is $toGo to go and thats $cycles\n";
	// 		$fastForward = $cycles * $space;
	// 		$next = $gen + $fastForward;
	// 		echo "Next is $next\n";
	// 		$gen = $next;
	// 	}
	// }
	// if ($gen % 1000000 == 0) {
	// 	echo "Sum after $gen is " . getSum($state, $off) . " diff $d\n";
	// }
}
// echo "Sum after $gen is " . getSum($state, $off) . PHP_EOL;
// echo "Sum $sum\n";
//779 too low

function getSum($state, $off)
{
	$sum = 0;
	$l = strlen($state);
	for ($i = 0; $i < $l; $i++) {
		if ($state[$i] === '#') {
			$p = $i - $off;
			$sum += $i - $off;
		}
	}
	return $sum;
}
