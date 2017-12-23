#!/usr/bin/env php
<?php
$in = file_get_contents('19.txt');

// $in = <<<TST
//     |          
//     |  +--+    
//     A  |  C    
// F---|----E|--+ 
//     |  |  |  D 
//     +B-+  +--+ 
// TST;

$grid = explode("\n", $in);


define('DOT', ' ');
define('UDPIPE', '|');
define('LRPIPE', '-');
define('TURN', '+');

define('U', '/\\');
define('D', '\\/');
define('L', '<');
define('R', '>');

$moves = [
    U => [0, -1],
    D => [0, 1],
    L => [-1, 0],
    R => [1, 0]
];

$start = 0;
$dir = D;
$on = TRUE;
for ($i = 0; $i < strlen($grid[0]); $i++){
    if ($grid[0][$i] !== DOT) {
        $start = $i;
        break;
    }
}

$pos = [$start, 0];
$path = '';
$steps = 1;
while (TRUE){
    list($x, $y) = $pos;
    // echo "$x, $y $dir - $path\n";
    list($dx, $dy) = $moves[$dir];

    $nx = $x + $dx;
    $ny = $y + $dy;

    if (!isset($grid[$ny][$nx])){
        echo $path . PHP_EOL;
        echo $steps . PHP_EOL;
        exit;
    }

    $spot = $grid[$ny][$nx];
    $steps++;

    if ($spot === TURN){
        // work out next direction by location of next pipe
        if ($dir === U || $dir === D){
            list ($lx, $ly) = $moves[L];
            if (isset($grid[$ny][$nx+$lx]) && $grid[$ny][$nx+$lx] !== DOT){
                $dir = L;
            } else {
                $dir = R;
            }
        } else {
            list ($ux, $uy) = $moves[U];
            if (isset($grid[$ny+$uy][$nx]) && $grid[$ny+$uy][$nx] !== DOT){
                $dir = U;
            } else {
                $dir = D;
            }
        }
    } else if ($spot === UDPIPE || $spot === LRPIPE){
        // keep goings
    } else if ($spot === DOT){
        echo "OVER\n";
        echo $path . PHP_EOL;
        echo $steps . PHP_EOL;
        exit;
    } else {
        $path .= $spot;
    }

    $pos = [$nx, $ny];
}