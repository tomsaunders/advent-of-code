#!/usr/bin/env php
<?php
ini_set('memory_limit','4G');
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
$initial = '.....' . str_replace('initial state: ', '', $initial) . '.....';
$off = 5;
array_shift($lines);
$replacers = [];
foreach ($lines as $line){
	list($replace, $with) = explode(' => ', $line);
	$replacers[$replace] = $with;
}

$gen = 0;
$maxGen = 5000000000;
// $maxGen = 20;
$state = $initial;
$s = $t = microtime(TRUE);
while ($gen < $maxGen){
	$next = str_pad('', strlen($state), '.');
	$g = str_pad($gen, 2, ' ', STR_PAD_LEFT) . ": ";

	$m = strlen($state) - 2;
	for ($i = 2; $i < $m; $i++){
		$current = substr($state, $i - 2, 5);
		foreach ($replacers as $find => $result){
			if ($current === $find){
				$next[$i] = $result;
				break;
			}
		}
	}
	if ($next[0] === '#' || $next[1] === '#' || $next[2] === '#'){
		$next = "." . $next . ".";
		$off++;
	}
	$state = $next;
	$gen++;
	if ($gen % 1000 == 0) {
		$e = microtime(TRUE);
		$t = round($e-$s, 2);
		echo "$t $m $gen\n";
	}
}
$sum = 0;
$l = strlen($state);
for ($i = 0; $i < $l; $i++){
	if ($state[$i] === '#'){
		$p = $i - $off;
		$sum += $i - $off;
	}
}
echo "$gen Sum $sum Off $off\n";