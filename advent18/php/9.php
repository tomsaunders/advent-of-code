#!/usr/bin/env php
<?php
$in   = file_get_contents('input9.txt');
$test = <<<TST

TST;

$in   = '419 players; last marble is worth 72164 points';
$in   = [[419, 72164]];
$tsts = [
	[9, 25],
	[10, 1618],
	[13, 7999],
	[17, 1104],
	[21, 6111],
	[30, 5807],
];
$tsts[] = $in[0];
//$tsts[] = [419, 7216400];

foreach ($tsts as $t) {
	list($playerCount, $last) = $t;

	$players = array_pad([], $playerCount, 0);
	$p       = 0;
	$current = 0;
	$circle  = [0];

	for ($m = 1; $m <= $last; $m++) {
		$max        = count($circle);
		$currentPos = array_search($current, $circle);

		if ($m % 23 === 0) {
			$players[$p] += $m;
			$removePos   = $currentPos - 7;
			if ($removePos < 0) {
				$removePos += $max;
			}

			$remove = array_splice($circle, $removePos, 1)[0];
//			echo "Didnt play $m at $currentPos, removed $remove at $removePos\n";
			$players[$p] += $remove;
			$current     = $circle[$removePos];
		} else {
			$nextPos = $currentPos + 2;
			if ($nextPos > $max) {
				$nextPos -= $max;
			}
			array_splice($circle, $nextPos, 0, $m);
//			echo "Circle now " . implode(', ', $circle) . PHP_EOL;
			$current = $m;
		}

		$p++;
		if ($p == $playerCount) {
			$p = 0;
		}

		if (count($circle) === 100) {
			$xpos = array_search($current, $circle);
			$tmp = array_merge(
					array_slice($circle, 50, 50),
				$circle,
				array_slice($circle, 0, 50)
			);
			$xpos += 50;
			$circle = array_slice($tmp, $xpos - 10, 20);
		}
	}
	$highest = max($players);
	$highp   = array_search($highest, $players);
	echo "players $playerCount winner $highp last $last Highest score $highest\n";

}

//$in = $test;
//$twos  = $lines;
$one = $two = '';

echo "Part 1 $one\n\n";

echo "Part 2 $two\n";
echo "\n";