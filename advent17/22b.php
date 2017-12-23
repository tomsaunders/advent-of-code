#!/usr/bin/env php
<?php
$in = file_get_contents('22.txt');

// $in = <<<TST
// ..#
// #..
// ...
// TST;

define('N', 'N');
define('S', 'S');
define('E', 'E');
define('W', 'W');
define('INFTD', '#');
define('CLEAN', '.');
define('WEAK', 'w');
define('FLGGD', 'f');

$left = [N => W, W => S, S => E, E => N];
$right= [N => E, E => S, S => W, W => N];
$rev  = [N => S, E => W, S => N, W => E];
$move = [N => [0, -1], E => [1, 0], S => [0, 1], W => [-1, 0]];

$pos = [0,0];
$dir = N;

$in = explode("\n", $in);
$grid = [];
$size = strlen($in[0]);
$off = floor($size/2);
for ($r = 0; $r < $size; $r++){
    for ($c = 0; $c < $size; $c++){
        $y = $r - $off;
        $x = $c - $off;
        $k = k([$x, $y]);
        $grid[$k] = $in[$r][$c];
    }
}
function k($pos) { return implode(":", $pos); }
function infected($grid){
    return strlen(str_replace(CLEAN, '', implode('', $grid)));
}

$moves = 10000000;
$inf = 0;
for ($i = 0; $i < $moves; $i++){
    $k = k($pos);
    if (isset($grid[$k]) && $grid[$k] === INFTD){
        // turn right
        $grid[$k] = FLGGD;
        $dir = $right[$dir];
    } else if (isset($grid[$k]) && $grid[$k] === WEAK){
        $grid[$k] = INFTD;
        $inf++;
    } else if (isset($grid[$k]) && $grid[$k] === FLGGD){
        $grid[$k] = CLEAN;
        $dir = $rev[$dir];
    } else {
        // turn left
        $grid[$k] = WEAK;
        $dir = $left[$dir];
    }
    list($dx, $dy) = $move[$dir];
    list($px, $py) = $pos;
    $pos = [$px + $dx, $dy + $py];
}
for ($y = -5; $y <= 5; $y++){
    for ($x = -5; $x <= 5; $x++){
        $k = k([$x, $y]);
        // echo isset($grid[$k]) && $grid[$k] === INFTD ? INFTD : CLEAN;  
    }
    // echo "\n";
}
// echo "{$pos[0]} {$pos[1]}\n";
echo "\nMoves $moves Inf $inf\n";
// print_r($grid);