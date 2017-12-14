#!/usr/bin/php
<?php
$in = file_get_contents('2.txt');
$tst= <<<TST
5 9 2 8
9 4 7 3
3 8 6 5
TST;

$lines = explode("\n", $in);
$total = 0;
foreach ($lines as $line){
    $nums = explode(" ", $line);
    $c = count($nums);
    for ($a = 0; $a < $c; $a++){
        $x = $nums[$a];
        for ($b = 0; $b < $c; $b++){
            if ($a === $b) continue;
            $y = $nums[$b];

            $quot = $x / $y;
            if ($quot == round($quot)){
                $total += $quot;
                break 2;
            }
        }
    }
}
echo $total;
echo "\n\n";
