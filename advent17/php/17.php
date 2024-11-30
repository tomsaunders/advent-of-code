#!/usr/bin/env php
<?php
$in = 329;
$spins = 2017;

// $in = 3;

$values = [0];
$pos = 0;

for ($i = 1; $i <= $spins; $i++){
    $next = ($pos + $in) % count($values);
    $next++;
    array_splice($values, $next, 0, $i);
    $pos = $next;
}
echo "Part 1\n";
echo $values[($pos + 1)  % count($values)] . PHP_EOL;

$spins = 50000000;
$values = [0];
$pos = 0;

$indexOne = 0;
for ($i = 1; $i <= $spins; $i++){
    $next = ($pos + $in) % $i;
    $next++;
    if ($next === 1) $indexOne = $i;
    // array_splice($values, $next, 0, $i);
    $pos = $next;
}
echo "Part 2\n";
echo $indexOne . PHP_EOL;
