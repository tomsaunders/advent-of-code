#!/usr/bin/php
<?php
$in = file_get_contents('2.txt');
$tst= <<<TST
17  16  15  14  13
18   5   4   3  12
19   6   1   2  11
20   7   8   9  10
21  22  23---> ...
TST;

$s  = 1;
$sq = 1;

$x = 0;
$y = 0;
$p = 1;
$find = 277678; // INPUT
$topL = 1;
$topR = 1;
$botL = 1;
$botR = 1;

while ($p < $find){
    if ($p === $sq){
        $x++;
        $s += 2;
        $topR = $sq + $s - 1;
        $topL = $topR + $s - 1;
        $botL = $topL + $s - 1;
        $botR = $botL + $s - 1;
        $sq = $s * $s;
        if ($botR !== $sq){
            echo "WTF this is wrong $botR $sq\n\n";
            exit;
        }
        
    } else if ($p < $topR){
        $y++;
    } else if ($p < $topL){
        $x--;
    } else if ($p < $botL){
        $y--;
    } else if ($p < $botR){
        $x++;
    }
    $p++;
}
$dist = abs($x) + abs($y);
echo "At $p = $x, $y , dist is $dist\n\n";